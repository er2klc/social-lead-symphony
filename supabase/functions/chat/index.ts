import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-openai-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

console.log('Chat function loaded')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, teamId, platformId, currentTeamId, userId } = await req.json()
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Processing chat request:', {
      messageCount: messages.length,
      teamId,
      platformId,
      currentTeamId,
      userId
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's team memberships
    const { data: teamMemberships, error: teamError } = await supabaseClient
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId)

    if (teamError) {
      console.error('Error fetching team memberships:', teamError)
      throw teamError
    }

    const teamIds = teamMemberships?.map(tm => tm.team_id) || []
    console.log('User team memberships:', teamIds)

    // Search for similar content if we have a user message
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user')
    let contextMessages = []

    if (lastUserMessage) {
      try {
        console.log('Generating embedding for message:', lastUserMessage.content)
        
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.headers.get('x-openai-key')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: lastUserMessage.content,
            model: 'text-embedding-3-small'
          })
        })

        if (!embeddingResponse.ok) {
          throw new Error('Failed to generate embedding')
        }

        const { data: [{ embedding }] } = await embeddingResponse.json()
        console.log('Generated embedding successfully')

        // Search for similar content in team content
        const { data: similarContent, error: matchError } = await supabaseClient.rpc(
          'match_content',
          {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: 5,
            content_type: 'team'
          }
        )

        if (matchError) {
          console.error('Error matching content:', matchError)
          throw matchError
        }

        console.log('Found similar content:', similarContent?.length || 0, 'items')

        if (similarContent && similarContent.length > 0) {
          // Filter content to only include teams the user is a member of
          const relevantContent = similarContent.filter(content => 
            teamIds.includes(content.team_id)
          )

          contextMessages = relevantContent.map(content => ({
            role: 'system',
            content: `Relevant context: ${content.content}`
          }))

          console.log('Added context messages:', contextMessages.length)
        }
      } catch (error) {
        console.error('Error searching similar content:', error)
        // Continue without context if search fails
      }
    }

    // Combine context with user messages
    const processedMessages = [
      ...messages.slice(0, 1), // System message
      ...contextMessages,
      ...messages.slice(1) // User messages
    ]

    console.log('Making request to OpenAI with', processedMessages.length, 'messages')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        Authorization: `Bearer ${req.headers.get('x-openai-key')}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: processedMessages.map(({ role, content }) => ({ role, content })),
        stream: true,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(error.error?.message || 'Failed to get response from OpenAI')
    }

    console.log('OpenAI response received, starting stream...')

    let buffer = '';
    const stream = new TransformStream({
      async transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk);
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') {
            controller.terminate();
            return;
          }
          if (!line.startsWith('data: ')) continue;
          
          try {
            const json = JSON.parse(line.slice(6));
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              const message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content,
                createdAt: new Date().toISOString()
              };
              controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
            console.error('Problematic line:', line);
          }
        }
      },
    });

    return new Response(response.body?.pipeThrough(stream), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ProgressTracker } from './progress-tracker.ts';

interface ScanProfileParams {
  username: string;
  leadId: string;
  apifyApiKey: string;
}

export async function scanLinkedInProfile({ 
  username, 
  leadId, 
  apifyApiKey 
}: ScanProfileParams) {
  const profileUrl = `https://www.linkedin.com/in/${username}/`;
  console.log('Starting Apify scan for LinkedIn profile:', profileUrl);

  const startResponse = await fetch(
    `https://api.apify.com/v2/actor-tasks/creativable~linkedin-people-profiles/runs?token=${apifyApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startUrls: [{ url: profileUrl }],
        maxRequestRetries: 3,
        maxConcurrency: 1,
        maxItems: 1,
      }),
    }
  );

  if (!startResponse.ok) {
    const errorText = await startResponse.text();
    console.error('Failed to start Apify actor:', errorText);
    throw new Error('Failed to start LinkedIn profile scan');
  }

  const runData = await startResponse.json();
  const runId = runData.data.id;

  let attempts = 0;
  const maxAttempts = 30;
  let profileData = null;

  while (attempts < maxAttempts) {
    console.log(`Polling for results (attempt ${attempts + 1}/${maxAttempts})`);

    const datasetResponse = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apifyApiKey}`
    );

    if (!datasetResponse.ok) {
      console.error('Failed to fetch dataset:', await datasetResponse.text());
      throw new Error('Failed to fetch scan results');
    }

    const items = await datasetResponse.json();
    
    if (items.length > 0) {
      profileData = items[0];
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  if (!profileData) {
    throw new Error('Timeout waiting for profile data');
  }

  return profileData;
}
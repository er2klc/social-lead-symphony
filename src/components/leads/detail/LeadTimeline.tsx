import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  MessageSquare, 
  CheckSquare, 
  StickyNote, 
  Phone, 
  Mail, 
  Calendar,
  ArrowRight,
  FileText,
  Bell,
  Instagram,
  Linkedin,
  MessageCircle,
  UserPlus,
  ListTodo,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

type TimelineItem = {
  id: string;
  type: "message" | "task" | "note" | "phase_change" | "reminder" | "upload" | "contact_created" | "appointment" | "presentation";
  content: string;
  timestamp: string;
  status?: string;
  platform?: string;
  metadata?: {
    dueDate?: string;
    meetingType?: string;
    color?: string;
  };
};

interface LeadTimelineProps {
  lead: {
    messages: Tables<"messages">[];
    tasks: Tables<"tasks">[];
    notes: Tables<"notes">[];
    created_at: string;
    name: string;
  };
}

export const LeadTimeline = ({ lead }: LeadTimelineProps) => {
  const timelineItems: TimelineItem[] = [
    {
      id: 'contact-created',
      type: 'contact_created',
      content: `Kontakt ${lead.name} wurde erstellt`,
      timestamp: lead.created_at,
    } as const,
    ...lead.messages.map(message => ({
      id: message.id,
      type: 'message' as const,
      content: message.content,
      timestamp: message.sent_at || '',
      status: message.platform,
      platform: message.platform
    })),
    ...lead.tasks.map(task => ({
      id: task.id,
      type: task.meeting_type ? 'appointment' as const : 'task' as const,
      content: task.title,
      timestamp: task.created_at || '',
      status: task.completed ? 'completed' : 'pending',
      metadata: {
        dueDate: task.due_date,
        meetingType: task.meeting_type,
        color: task.color
      }
    })),
    ...lead.notes.map(note => ({
      id: note.id,
      type: 'note' as const,
      content: note.content,
      timestamp: note.created_at || '',
      metadata: {
        color: note.color
      }
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: TimelineItem['type'], platform?: string) => {
    switch (type) {
      case 'contact_created':
        return <UserPlus className="h-4 w-4 text-white" />;
      case 'message':
        if (platform === 'instagram') return <Instagram className="h-4 w-4 text-white" />;
        if (platform === 'linkedin') return <Linkedin className="h-4 w-4 text-white" />;
        if (platform === 'whatsapp') return <MessageCircle className="h-4 w-4 text-white" />;
        return <MessageSquare className="h-4 w-4 text-white" />;
      case 'task':
        return <ListTodo className="h-4 w-4 text-white" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-white" />;
      case 'note':
        return <StickyNote className="h-4 w-4 text-white" />;
      case 'phase_change':
        return <ArrowRight className="h-4 w-4 text-white" />;
      case 'reminder':
        return <Bell className="h-4 w-4 text-white" />;
      case 'upload':
        return <FileText className="h-4 w-4 text-white" />;
      case 'presentation':
        return <Send className="h-4 w-4 text-white" />;
    }
  };

  const getIconColor = (type: TimelineItem['type'], status?: string) => {
    switch (type) {
      case 'contact_created':
        return 'bg-green-500';
      case 'message':
        return 'bg-blue-500';
      case 'task':
        return status === 'completed' ? 'bg-green-500' : 'bg-cyan-500';
      case 'appointment':
        return status === 'completed' ? 'bg-green-500' : 'bg-orange-500';
      case 'note':
        return 'bg-yellow-500';
      case 'phase_change':
        return 'bg-purple-500';
      case 'reminder':
        return 'bg-red-500';
      case 'upload':
        return 'bg-gray-500';
      case 'presentation':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBorderColor = (type: TimelineItem['type'], status?: string) => {
    switch (type) {
      case 'contact_created':
        return 'border-green-500';
      case 'message':
        return 'border-blue-500';
      case 'task':
        return status === 'completed' ? 'border-green-500' : 'border-cyan-500';
      case 'appointment':
        return status === 'completed' ? 'border-green-500' : 'border-orange-500';
      case 'note':
        return 'border-yellow-500';
      case 'phase_change':
        return 'border-purple-500';
      case 'reminder':
        return 'border-red-500';
      case 'upload':
        return 'border-gray-500';
      case 'presentation':
        return 'border-indigo-500';
      default:
        return 'border-gray-500';
    }
  };

  const formatDate = (date: string) => {
    const weekday = format(new Date(date), "EEE", { locale: de });
    const formattedDate = format(new Date(date), "dd.MM.yyyy | HH:mm 'Uhr'", { locale: de });
    return `${weekday}. ${formattedDate}`;
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Aktivitäten</h3>
      <div className="relative space-y-6">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-gray-200" />
        
        {timelineItems.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-1">
            {/* Date above the card */}
            <div className="flex items-center gap-2 ml-16 text-sm text-gray-600">
              {formatDate(item.timestamp)}
            </div>
            
            <div className="flex gap-4 items-start group relative">
              {/* Circle with Icon */}
              <div 
                className={cn(
                  "z-10 flex items-center justify-center w-8 h-8 rounded-full",
                  getIconColor(item.type, item.status)
                )}
              >
                {getIcon(item.type, item.platform)}
              </div>
              
              {/* Connecting Line to Card */}
              <div className="absolute left-10 top-4 w-4 h-0.5 bg-gray-200" />
              
              {/* Event Card */}
              <div className={cn(
                "flex-1 min-w-0 rounded-lg p-4 bg-white shadow-md border-2",
                getBorderColor(item.type, item.status)
              )}>
                <div className="font-medium mb-1">
                  {item.content}
                </div>
                {item.metadata?.dueDate && (
                  <div className="text-sm text-gray-500">
                    Fällig am: {formatDate(item.metadata.dueDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {timelineItems.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            Noch keine Aktivitäten vorhanden
          </div>
        )}
      </div>
    </div>
  );
};
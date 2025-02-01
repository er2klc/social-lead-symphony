import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Save, X, Trash2, Edit, Mic } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TimelineItemCardProps {
  type: string;
  content: string;
  metadata?: {
    dueDate?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    filePath?: string;
    status?: 'completed' | 'cancelled' | 'outdated';
    completedAt?: string;
    cancelledAt?: string;
    updatedAt?: string;
    oldDate?: string;
    newDate?: string;
    type?: string;
    oldStatus?: string;
    newStatus?: string;
    last_edited_at?: string;
  };
  status?: string;
  onDelete?: () => void;
  id?: string;
  created_at?: string;
  isCompleted?: boolean;
}

export const TimelineItemCard = ({ 
  type,
  content,
  metadata,
  status,
  onDelete,
  id,
  created_at,
  isCompleted
}: TimelineItemCardProps) => {
  const { settings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleTaskComplete = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(
        isCompleted
          ? (settings?.language === "en" ? "Task uncompleted" : "Aufgabe nicht erledigt")
          : (settings?.language === "en" ? "Task completed! 🎉" : "Aufgabe erledigt! 🎉")
      );
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(
        settings?.language === "en"
          ? "Error updating task"
          : "Fehler beim Aktualisieren der Aufgabe"
      );
    }
  };

  const handleSave = async () => {
    if (!id || type !== 'note') return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          content: editedContent,
          metadata: {
            ...metadata,
            last_edited_at: new Date().toISOString()
          }
        })
        .eq('id', id);

      if (error) throw error;

      setIsEditing(false);
      toast.success(
        settings?.language === "en" 
          ? "Note updated successfully" 
          : "Notiz erfolgreich aktualisiert"
      );
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(
        settings?.language === "en"
          ? "Error updating note"
          : "Fehler beim Aktualisieren der Notiz"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          try {
            const response = await fetch('https://agqaitxlmxztqyhpcjau.functions.supabase.co/voice-to-text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({ audio: base64Audio })
            });

            const { text } = await response.json();
            if (text) {
              setEditedContent(prev => prev + (prev ? '\n' : '') + text);
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            toast.error(
              settings?.language === "en"
                ? "Error transcribing audio"
                : "Fehler bei der Audiotranskription"
            );
          }
        };
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      toast.success(
        settings?.language === "en"
          ? "Recording started..."
          : "Aufnahme gestartet..."
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(
        settings?.language === "en"
          ? "Error accessing microphone"
          : "Fehler beim Zugriff auf das Mikrofon"
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      toast.success(
        settings?.language === "en"
          ? "Recording stopped"
          : "Aufnahme beendet"
      );
    }
  };

  const renderContent = () => {
    if (isEditing && type === 'note') {
      return (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] w-full"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(content);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              {settings?.language === "en" ? "Cancel" : "Abbrechen"}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || editedContent.trim() === content.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              {settings?.language === "en" ? "Save" : "Speichern"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="relative group"
      >
        <div className={`whitespace-pre-wrap break-words ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {content}
        </div>
        <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {type === 'task' && !isCompleted && (
            <button
              onClick={handleTaskComplete}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center hover:border-green-500 hover:bg-green-50">
                <Check className="h-3 w-3 text-transparent hover:text-green-500" />
              </div>
            </button>
          )}
          {type === 'note' && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
            </button>
          )}
          {type === 'phase_change' && onDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMetadata = () => {
    if (metadata?.last_edited_at) {
      return (
        <div className="text-xs text-gray-500 mt-2">
          {settings?.language === "en" ? "Created" : "Erstellt"}: {format(new Date(created_at || ''), 'PPp', { locale: settings?.language === "en" ? undefined : de })}
          <br />
          {settings?.language === "en" ? "Last edited" : "Zuletzt bearbeitet"}: {format(new Date(metadata.last_edited_at), 'PPp', { locale: settings?.language === "en" ? undefined : de })}
        </div>
      );
    }
    
    if (type === 'task' && isCompleted && metadata?.completedAt) {
      return (
        <div className="text-xs text-gray-500 mt-2">
          {settings?.language === "en" ? "Completed" : "Erledigt"}: {format(new Date(metadata.completedAt), 'PPp', { locale: settings?.language === "en" ? undefined : de })}
        </div>
      );
    }
    return null;
  };

  const getBorderColor = () => {
    if (status === 'completed') return 'border-green-500';
    if (status === 'cancelled') return 'border-red-500';
    if (type === 'phase_change') return 'border-blue-500';
    if (type === 'note') return 'border-yellow-400';
    if (type === 'message') return 'border-purple-500';
    if (type === 'task') return 'border-orange-500';
    if (type === 'file_upload') return 'border-cyan-500';
    if (type === 'contact_created') return 'border-emerald-500';
    return 'border-gray-200';
  };

  return (
    <div className={`flex-1 min-w-0 rounded-lg p-4 bg-white shadow-md border ${getBorderColor()} group relative`}>
      {renderContent()}
      {renderMetadata()}
    </div>
  );
};

import { format } from "date-fns";
import { de } from "date-fns/locale";
import { X } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { NoteCard } from "./cards/NoteCard";
import { TaskCard } from "./cards/TaskCard";
import { AppointmentCard } from "./cards/AppointmentCard";
import { FileCard } from "./cards/FileCard";
import { TimelineItemType } from "./TimelineUtils";
import { NewAppointmentDialog } from "@/components/calendar/NewAppointmentDialog";
import { useState } from "react";

interface TimelineItemCardProps {
  type: TimelineItemType;
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
    meetingType?: string;
    color?: string;
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
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);

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
    if (type === 'appointment') return 'border-indigo-500';
    if (type === 'task') return 'border-orange-500';
    if (type === 'file_upload') return 'border-cyan-500';
    if (type === 'contact_created') return 'border-emerald-500';
    return 'border-gray-200';
  };

  const renderContent = () => {
    if (type === 'task' && id) {
      return (
        <TaskCard
          id={id}
          content={content}
          metadata={metadata}
          isCompleted={isCompleted}
          onDelete={onDelete}
        />
      );
    }

    if (type === 'appointment' && id) {
      return (
        <>
          <AppointmentCard
            content={content}
            metadata={metadata}
            isCompleted={isCompleted}
            onDelete={onDelete}
            onEdit={() => setIsEditingAppointment(true)}
          />
          {isEditingAppointment && (
            <NewAppointmentDialog
              open={isEditingAppointment}
              onOpenChange={setIsEditingAppointment}
              initialSelectedDate={metadata?.dueDate ? new Date(metadata.dueDate) : null}
              appointmentToEdit={{
                id,
                leadId: '',
                time: metadata?.dueDate ? format(new Date(metadata.dueDate), 'HH:mm') : '09:00',
                title: content,
                color: metadata?.color || '#40E0D0',
                meeting_type: metadata?.meetingType || 'phone_call',
                completed: isCompleted,
                cancelled: status === 'cancelled',
              }}
            />
          )}
        </>
      );
    }

    if (type === 'file_upload') {
      return (
        <FileCard
          content={content}
          metadata={metadata}
        />
      );
    }

    if (type === 'note' && id) {
      return (
        <NoteCard
          id={id}
          content={content}
          metadata={metadata}
          onDelete={onDelete}
        />
      );
    }

    return (
      <div className="relative group">
        <div className="whitespace-pre-wrap break-words">
          {content}
        </div>
        {onDelete && (
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onDelete}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex-1 min-w-0 rounded-lg p-4 bg-white shadow-md border ${getBorderColor()} group relative`}>
      {renderContent()}
      {renderMetadata()}
    </div>
  );
};
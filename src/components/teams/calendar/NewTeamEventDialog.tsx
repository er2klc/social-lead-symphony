import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { TeamEventForm } from "./TeamEventForm";

interface NewTeamEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSelectedDate: Date | null;
  teamId: string;
  eventToEdit?: any;
  onDisableInstance?: (date: Date) => void;
}

export const NewTeamEventDialog = ({
  open,
  onOpenChange,
  initialSelectedDate,
  teamId,
  eventToEdit,
  onDisableInstance,
}: NewTeamEventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? "Termin bearbeiten" : "Neuer Termin"} am{" "}
            {initialSelectedDate &&
              format(initialSelectedDate, "dd. MMMM yyyy", { locale: de })}
          </DialogTitle>
        </DialogHeader>

        <TeamEventForm
          teamId={teamId}
          selectedDate={initialSelectedDate}
          eventToEdit={eventToEdit}
          onClose={() => onOpenChange(false)}
          onDisableInstance={onDisableInstance}
        />
      </DialogContent>
    </Dialog>
  );
};
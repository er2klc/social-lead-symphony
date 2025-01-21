import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddLeadDialog } from "../AddLeadDialog";
import { AddFromSocialDialog } from "../AddFromSocialDialog";

export function LeadsHeader() {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-xl font-semibold">Kontakte</h1>
      <div className="flex items-center space-x-2">
        <AddFromSocialDialog />
        <AddLeadDialog
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Kontakt
            </Button>
          }
        />
      </div>
    </div>
  );
}
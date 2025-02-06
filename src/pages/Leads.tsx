
import { useState, useEffect } from "react";
import { LeadsHeader } from "@/components/leads/header/LeadsHeader";
import { LeadKanbanView } from "@/components/leads/LeadKanbanView";
import { LeadTableView } from "@/components/leads/LeadTableView";
import { useLeadsQuery } from "@/hooks/use-leads-query";
import { useNavigate } from "react-router-dom";

const Leads = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: leads = [] } = useLeadsQuery(selectedPipelineId);
  const navigate = useNavigate();

  const handleLeadClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };

  const handlePipelineSelect = (id: string) => {
    console.log("Pipeline selected:", id);
    setSelectedPipelineId(id);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <LeadsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPipelineId={selectedPipelineId}
        setSelectedPipelineId={handlePipelineSelect}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setIsEditMode={setIsEditMode}
      />

      <div className="flex-1 overflow-hidden mt-[84px]">
        {viewMode === "kanban" ? (
          <LeadKanbanView
            leads={leads}
            selectedPipelineId={selectedPipelineId}
            setSelectedPipelineId={handlePipelineSelect}
            isEditMode={isEditMode}
          />
        ) : (
          <LeadTableView
            leads={leads}
            onLeadClick={handleLeadClick}
            selectedPipelineId={selectedPipelineId}
          />
        )}
      </div>
    </div>
  );
};

export default Leads;

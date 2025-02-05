
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PresentationLoading } from '@/components/presentation/PresentationLoading';
import { PresentationError } from '@/components/presentation/PresentationError';
import { PresentationContent } from '@/components/presentation/PresentationContent';
import { usePresentationData } from '@/components/presentation/hooks/usePresentationData';
import { usePresentationView } from '@/components/presentation/hooks/usePresentationView';
import { useUnloadHandler } from '@/components/presentation/hooks/useUnloadHandler';

export default function PresentationPage() {
  const { leadId, pageId } = useParams();
  const { pageData, isLoading, error } = usePresentationData(leadId, pageId);
  const { viewId, createView, updateProgress } = usePresentationView(pageId, leadId);

  useUnloadHandler(viewId);

  useEffect(() => {
    if (pageData) {
      createView(pageData);
    }
  }, [pageData, createView]);

  if (isLoading) return <PresentationLoading />;
  if (error || !pageData) return <PresentationError error={error || "Presentation not found"} />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-yellow-500/10 to-blue-500/20 opacity-30" />
      <PresentationContent 
        pageData={pageData} 
        onProgress={(progress) => updateProgress(progress, pageData)} 
      />
    </div>
  );
}

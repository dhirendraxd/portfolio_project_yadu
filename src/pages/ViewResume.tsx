import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewResume = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Dhirendra_Singh_Dhami_Resume.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      <main className="container py-6 px-4">
        <div className="mx-auto max-w-5xl">
          <iframe
            src="/resume.pdf"
            className="w-full h-[calc(100vh-120px)] border rounded-lg shadow-lg"
            title="Resume"
          />
        </div>
      </main>
    </div>
  );
};

export default ViewResume;

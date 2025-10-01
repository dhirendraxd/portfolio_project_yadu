
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Download } from "lucide-react";

const WorkResume = () => {
  const handleResumeView = () => {
    // For demonstration - in a real app, this would open a PDF viewer or modal
    window.open('/resume.pdf', '_blank');
  };

  const handleResumeDownload = () => {
    // For demonstration - in a real app, this would download the actual PDF
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Yadav_Singh_Dhami_Resume.pdf';
    link.click();
  };

  return (
    <Card className="glass-card shadow-soft border-0">
      <CardContent className="p-8 md:p-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <BookOpen className="h-8 w-8 text-forest mr-3" />
          <h2 className="text-3xl font-semibold">Resume & CV</h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Download or view my comprehensive resume detailing my experience, education, and achievements in rural development and community engagement.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            onClick={handleResumeView}
            className="flex items-center justify-center space-x-2 bg-forest hover:bg-forest/90 text-cream rounded-2xl px-6 py-3 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <Eye className="h-5 w-5" />
            <span>View Resume</span>
          </Button>
          
          <Button 
            onClick={handleResumeDownload}
            variant="outline"
            className="flex items-center justify-center space-x-2 border-forest text-forest hover:bg-forest hover:text-cream rounded-2xl px-6 py-3 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <Download className="h-5 w-5" />
            <span>Download Resume</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkResume;

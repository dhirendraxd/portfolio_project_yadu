
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";

const WorkSkills = () => {
  const skills = [
    "Community Engagement", "Research & Analysis", "Project Management",
    "Sustainable Development", "Data Collection", "Policy Analysis", 
    "Rural Economics", "Social Impact Assessment", "Leadership",
    "Environmental Advocacy", "Cross-cultural Communication"
  ];

  const languages = ["Hindi (Native)", "English (Fluent)", "Nepali (Conversational)"];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="glass-card hover:shadow-medium transition-all duration-300">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Star className="h-6 w-6 text-coral mr-3" />
            <h3 className="text-xl font-semibold">Core Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm animate-fade-in-up bg-sage/20 text-forest border-sage/30 hover:bg-sage/30 transition-colors"
                     style={{ animationDelay: `${index * 0.05}s` }}>
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card hover:shadow-medium transition-all duration-300">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-coral mr-3" />
            <h3 className="text-xl font-semibold">Languages</h3>
          </div>
          <div className="space-y-3">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center space-x-3 animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-2 h-2 rounded-full bg-forest"></div>
                <span className="text-muted-foreground">{language}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkSkills;

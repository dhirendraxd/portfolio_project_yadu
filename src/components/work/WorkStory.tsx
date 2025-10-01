
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

const WorkStory = () => {
  const timeline = [
    {
      year: "2024",
      title: "Postgraduate Studies",
      description: "Currently pursuing Masters in Rural Development, focusing on sustainable community empowerment strategies.",
      type: "education"
    },
    {
      year: "2023",
      title: "Community Leadership Program", 
      description: "Led multiple grassroots initiatives focused on environmental sustainability and social justice.",
      type: "leadership"
    },
    {
      year: "2022",
      title: "Research Assistant",
      description: "Conducted field research on rural development practices and their impact on local communities.",
      type: "experience"
    },
    {
      year: "2021",
      title: "Bachelor's Degree",
      description: "Graduated with honors in Social Sciences, specializing in community development.",
      type: "education"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-soft border-0 glass-card">
        <CardContent className="p-8 md:p-12">
          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 text-coral mr-3" />
            <h2 className="text-2xl font-semibold">My Story</h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Growing up in a rural community, I witnessed firsthand the challenges and resilience 
              of local populations. This early exposure to grassroots realities shaped my understanding 
              that authentic development must be community-driven and culturally sensitive.
            </p>
            <p>
              My academic journey in Rural Development has been complemented by extensive fieldwork, 
              where I've collaborated with diverse stakeholders - from smallholder farmers to policy 
              makers - to design and implement sustainable development interventions.
            </p>
            <p>
              I believe in the power of data-driven storytelling to advocate for marginalized communities. 
              My research focuses on bridging the gap between academic knowledge and practical solutions 
              that can create lasting positive impact.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-2xl font-semibold mb-8 text-center">My Journey</h3>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start space-x-6 animate-fade-in-up" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-forest to-sage flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {item.year.slice(-2)}
                  </span>
                </div>
              </div>
              <Card className="flex-1 shadow-soft border-0 glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <Badge variant={item.type === 'education' ? 'default' : 'secondary'} className="bg-earth text-cream">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkStory;

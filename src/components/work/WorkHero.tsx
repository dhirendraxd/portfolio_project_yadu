
import React from "react";

const WorkHero = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-balance">
              My <span className="text-forest bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">Journey</span> & Work
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore my story, skills, and portfolio of community-driven projects focused on sustainable development and social impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkHero;

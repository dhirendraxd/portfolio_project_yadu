import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/useCmsData";

const TestimonialsCarousel = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!testimonials?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const nextTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <Card className="glass-card max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!testimonials?.length) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto relative">
      <Card className="glass-card border-0 overflow-hidden">
        <CardContent className="p-8 md:p-12 text-center relative">
          <div className="absolute top-6 left-6 text-accent/20">
            <Quote className="h-12 w-12" />
          </div>
          
          <div className="relative z-10">
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed italic">
              "{currentTestimonial.content}"
            </p>
            
            <div className="flex flex-col items-center space-y-2">
              {currentTestimonial.image_url && (
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                  <img 
                    src={currentTestimonial.image_url} 
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h4 className="font-medium text-lg">{currentTestimonial.name}</h4>
              <div className="text-sm text-muted-foreground">
                {currentTestimonial.role && (
                  <span>{currentTestimonial.role}</span>
                )}
                {currentTestimonial.role && currentTestimonial.organization && (
                  <span className="mx-2">•</span>
                )}
                {currentTestimonial.organization && (
                  <span>{currentTestimonial.organization}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {testimonials.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-card border-0 hover:bg-primary/10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-card border-0 hover:bg-primary/10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
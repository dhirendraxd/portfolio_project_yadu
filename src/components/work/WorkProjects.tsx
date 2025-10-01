
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Star, Heart, Calendar, ExternalLink } from "lucide-react";
import { usePortfolioItems } from "@/hooks/useCmsData";

const WorkProjects = () => {
  const { data: portfolioItems, isLoading } = usePortfolioItems();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Portfolio filtering
  const categories = portfolioItems ? ["all", ...new Set(portfolioItems.map(item => item.category))] : ["all"];
  
  const filteredItems = portfolioItems?.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-muted-foreground"
        >
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`capitalize rounded-2xl transition-all duration-300 ${
              selectedCategory === category 
                ? "bg-forest text-cream shadow-soft" 
                : "border-forest/30 text-forest hover:bg-forest/10"
            }`}
          >
            {category === "all" ? "All Projects" : category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
           <Card key={item.id} className="glass-card group animate-fade-in-up hover:shadow-medium transition-all duration-500 hover:scale-105" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                {item.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs bg-earth/20 text-earth border-earth/30">
                    {item.category}
                  </Badge>
                  {item.featured && (
                    <Star className="h-4 w-4 text-coral" />
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                
                {item.impact && (
                  <div className="bg-sage/10 rounded-lg p-3 mb-4 border border-sage/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Heart className="h-4 w-4 text-coral" />
                      <span className="text-sm font-medium">Impact</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.impact}</p>
                  </div>
                )}
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs border-forest/30 text-forest">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-forest/30 text-forest">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.created_at).getFullYear()}</span>
                  </div>
                  
                  {item.link_url && (
                    <Button variant="ghost" size="sm" asChild className="p-2 hover:bg-forest/10">
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-forest" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default WorkProjects;

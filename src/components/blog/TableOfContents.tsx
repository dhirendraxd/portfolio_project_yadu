import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className = "" }) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeItem, setActiveItem] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      items.push({ id, title, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Set up intersection observer for active section tracking
    const observers: IntersectionObserver[] = [];
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0.1
    });

    // Observe all heading elements
    tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <Card className={`sticky top-24 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <List className="h-4 w-4" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {tocItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => scrollToHeading(item.id)}
              className={`
                w-full justify-start text-left h-auto py-2 px-3
                ${item.level === 1 ? 'font-semibold' : ''}
                ${item.level === 2 ? 'ml-3 font-medium' : ''}
                ${item.level === 3 ? 'ml-6' : ''}
                ${item.level === 4 ? 'ml-9 text-sm' : ''}
                ${item.level === 5 ? 'ml-12 text-sm' : ''}
                ${item.level === 6 ? 'ml-15 text-xs' : ''}
                ${activeItem === item.id 
                  ? 'bg-forest/10 text-forest border-l-2 border-forest' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }
                transition-colors duration-200
              `}
            >
              <div className="flex items-center gap-2 w-full">
                {activeItem === item.id && (
                  <ChevronRight className="h-3 w-3 text-forest flex-shrink-0" />
                )}
                <span className="truncate">{item.title}</span>
              </div>
            </Button>
          ))}
        </nav>
        
        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">
            Reading Progress
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-forest h-1 rounded-full transition-all duration-300"
              style={{ 
                width: `${tocItems.length > 0 ? 
                  ((tocItems.findIndex(item => item.id === activeItem) + 1) / tocItems.length) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableOfContents;
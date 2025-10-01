import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  tags?: string[];
  categories?: string[];
  reading_time?: number;
  created_at: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentPostTags: string[];
  currentPostCategories: string[];
  allPosts: BlogPost[];
  maxPosts?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  currentPostTags = [],
  currentPostCategories = [],
  allPosts = [],
  maxPosts = 3
}) => {
  // Algorithm to find related posts
  const findRelatedPosts = () => {
    const otherPosts = allPosts.filter(post => post.id !== currentPostId);
    
    const scoredPosts = otherPosts.map(post => {
      let score = 0;
      
      // Score based on shared tags
      const sharedTags = (post.tags || []).filter(tag => 
        currentPostTags.includes(tag)
      );
      score += sharedTags.length * 3;
      
      // Score based on shared categories
      const sharedCategories = (post.categories || []).filter(category => 
        currentPostCategories.includes(category)
      );
      score += sharedCategories.length * 5;
      
      // Boost score for recent posts
      const daysSincePublished = Math.floor(
        (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublished <= 30) score += 2;
      if (daysSincePublished <= 7) score += 1;
      
      return { ...post, score };
    });
    
    // Sort by score and return top posts
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts);
  };

  const relatedPosts = findRelatedPosts();

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Related Articles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {relatedPosts.map((post) => (
            <article key={post.id} className="group">
              <div className="flex gap-4">
                {/* Featured Image */}
                {post.featured_image_url && (
                  <div className="flex-shrink-0">
                    <Link to={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg border group-hover:shadow-md transition-shadow"
                      />
                    </Link>
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-forest transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* Meta information */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Read More Link */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="group/button h-auto p-0 font-medium text-forest hover:text-forest/80"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <span>Read more</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover/button:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
        
        {/* View All Posts */}
        <div className="mt-8 pt-6 border-t">
          <Button variant="outline" asChild className="w-full">
            <Link to="/blog">
              <BookOpen className="h-4 w-4 mr-2" />
              View All Articles
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedPosts;
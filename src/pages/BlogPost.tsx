import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useCmsData';
import EnhancedBlogPost from '@/components/blog/EnhancedBlogPost';
import { Card, CardContent } from "@/components/ui/card";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogPost, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen relative pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-64 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return <Navigate to="/blog" replace />;
  }

  return <EnhancedBlogPost blogPost={blogPost} />;
};

export default BlogPostPage;
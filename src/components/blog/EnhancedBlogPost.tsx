import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowLeft,
  Share2,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SocialShare from "./SocialShare";
import TableOfContents from "./TableOfContents";
import RelatedPosts from "./RelatedPosts";
import CommentSection from "./CommentSection";
import { createBlogStructuredData, createBreadcrumbStructuredData } from "@/utils/structuredData";
import { useBlogPosts } from "@/hooks/useCmsData";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  custom_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  tags?: string[];
  categories?: string[];
  published: boolean;
  allow_comments: boolean;
  seo_focus_keyword?: string;
  schema_type: string;
  word_count?: number;
  reading_time?: number;
  created_at: string;
  updated_at: string;
}

interface EnhancedBlogPostProps {
  blogPost: BlogPost;
}

const EnhancedBlogPost: React.FC<EnhancedBlogPostProps> = ({ blogPost }) => {
  const { data: allPosts } = useBlogPosts();
  
  // Convert markdown to HTML (simple implementation)
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-forest pl-4 italic my-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-forest hover:text-forest/80 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>');
  };

  const htmlContent = markdownToHtml(blogPost.content);
  const currentUrl = `https://yadavsinghdhami.com/blog/${blogPost.slug}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cleanHeadingId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Add IDs to headings for TOC
  const processContentForTOC = (content: string) => {
    return content.replace(
      /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/g,
      (match, level, text) => {
        const id = cleanHeadingId(text);
        return `<h${level} id="${id}" class="scroll-mt-24">${text}</h${level}>`;
      }
    );
  };

  const processedContent = processContentForTOC(htmlContent);

  return (
    <>
      <SEOHead 
        title={blogPost.custom_title || `${blogPost.title} - Yadav Singh Dhami`}
        description={blogPost.meta_description || blogPost.excerpt || blogPost.title}
        keywords={`${blogPost.seo_focus_keyword || ''}, ${(blogPost.tags || []).join(', ')}, Yadav Singh Dhami, rural development, sustainability`}
        canonical={currentUrl}
        ogType="article"
        ogImage={blogPost.featured_image_url}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            createBlogStructuredData(
              blogPost.title,
              blogPost.excerpt || blogPost.title,
              blogPost.created_at,
              blogPost.featured_image_url,
              blogPost.tags
            ),
            createBreadcrumbStructuredData([
              { name: "Home", url: "https://yadavsinghdhami.com" },
              { name: "Blog", url: "https://yadavsinghdhami.com/blog" },
              { name: blogPost.title, url: currentUrl }
            ])
          ]
        }}
      />
      
      <div className="min-h-screen relative">
        <div className="relative pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Back to Blog */}
              <div className="mb-8">
                <Button variant="ghost" asChild className="group">
                  <Link to="/blog">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <article className="lg:col-span-3">
                  {/* Featured Image */}
                  {blogPost.featured_image_url && (
                    <div className="mb-8">
                      <img
                        src={blogPost.featured_image_url}
                        alt={blogPost.featured_image_alt || blogPost.title}
                        className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-glass"
                      />
                    </div>
                  )}

                  {/* Article Header */}
                  <header className="mb-8">
                    {/* Categories */}
                    {blogPost.categories && blogPost.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blogPost.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="bg-forest/10 text-forest">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
                      {blogPost.title}
                    </h1>

                    {/* Excerpt */}
                    {blogPost.excerpt && (
                      <p className="text-xl text-charcoal/80 mb-6 leading-relaxed">
                        {blogPost.excerpt}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-muted pb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Yadav Singh Dhami</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={blogPost.created_at}>
                          {formatDate(blogPost.created_at)}
                        </time>
                      </div>

                      {blogPost.reading_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{blogPost.reading_time} min read</span>
                        </div>
                      )}

                      {blogPost.word_count && (
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{blogPost.word_count} words</span>
                        </div>
                      )}
                    </div>
                  </header>

                  {/* Article Content */}
                  <div 
                    className="prose prose-lg max-w-none mb-12"
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.75',
                      color: 'hsl(var(--charcoal))'
                    }}
                    dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${processedContent}</p>` }}
                  />

                  {/* Tags */}
                  {blogPost.tags && blogPost.tags.length > 0 && (
                    <div className="mb-8 pb-8 border-b border-muted">
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {blogPost.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="hover:bg-forest/10 hover:text-forest transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Share */}
                  <div className="mb-12">
                    <SocialShare
                      title={blogPost.title}
                      url={currentUrl}
                      excerpt={blogPost.excerpt}
                    />
                  </div>

                  {/* Comments */}
                  {blogPost.allow_comments && (
                    <CommentSection 
                      blogPostId={blogPost.id} 
                      allowComments={blogPost.allow_comments} 
                    />
                  )}
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                  {/* Table of Contents */}
                  <TableOfContents content={blogPost.content} />

                  {/* Related Posts */}
                  {allPosts && (
                    <RelatedPosts
                      currentPostId={blogPost.id}
                      currentPostTags={blogPost.tags || []}
                      currentPostCategories={blogPost.categories || []}
                      allPosts={allPosts}
                    />
                  )}

                  {/* Author Card */}
                  <Card className="sticky top-24">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-charcoal mb-2">
                        Yadav Singh Dhami
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Rural Development Researcher & Sustainability Expert
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/work">
                          View Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedBlogPost;
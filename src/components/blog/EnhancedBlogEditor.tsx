import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Save, Eye, Clock, Send, Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";
import SEOEditor from "./SEOEditor";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  custom_title: string;
  meta_description: string;
  featured_image_url: string;
  featured_image_alt: string;
  tags: string[];
  categories: string[];
  published: boolean;
  scheduled_publish_at?: string;
  allow_comments: boolean;
  seo_focus_keyword: string;
  schema_type: string;
}

interface EnhancedBlogEditorProps {
  blogPost?: BlogPost;
  onSave?: (post: BlogPost) => void;
  onCancel?: () => void;
}

const EnhancedBlogEditor: React.FC<EnhancedBlogEditorProps> = ({
  blogPost,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    custom_title: '',
    meta_description: '',
    featured_image_url: '',
    featured_image_alt: '',
    tags: [],
    categories: [],
    published: false,
    allow_comments: true,
    seo_focus_keyword: '',
    schema_type: 'BlogPosting'
  });
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Initialize form data
  useEffect(() => {
    if (blogPost) {
      setFormData(blogPost);
    }
  }, [blogPost]);

  // Calculate word count and reading time
  useEffect(() => {
    const plainText = formData.content.replace(/<[^>]+>/g, '');
    const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.round(words / 250)));
  }, [formData.content]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!formData.slug && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug]);

  // Auto-generate SEO title from main title
  useEffect(() => {
    if (!formData.custom_title && formData.title) {
      setFormData(prev => ({ 
        ...prev, 
        custom_title: `${formData.title} - Yadav Singh Dhami` 
      }));
    }
  }, [formData.title, formData.custom_title]);

  const handleSave = async (publishNow = false) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please add some content");
      return;
    }

    setSaving(true);

    try {
      const postData = {
        ...formData,
        published: publishNow,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...'
      };

      let result;
      if (formData.id) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', formData.id)
          .select()
          .single();
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(publishNow ? "Post published successfully!" : "Post saved as draft!");
      
      if (onSave) {
        onSave(result.data);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleScheduledPublish = async () => {
    if (!formData.scheduled_publish_at) {
      toast.error("Please select a publish date");
      return;
    }

    const scheduledDate = new Date(formData.scheduled_publish_at);
    if (scheduledDate <= new Date()) {
      toast.error("Scheduled date must be in the future");
      return;
    }

    await handleSave(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            {formData.id ? 'Edit Post' : 'Create New Post'}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
            {formData.published && (
              <Badge variant="default">Published</Badge>
            )}
            {!formData.published && (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your post title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-friendly-slug"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      URL: /blog/{formData.slug || 'your-slug'}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Rich Text Editor */}
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Publishing Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published">Publish immediately</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this post visible to readers
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, published: checked }))
                      }
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="scheduled_publish_at">Schedule for later</Label>
                    <Input
                      id="scheduled_publish_at"
                      type="datetime-local"
                      value={formData.scheduled_publish_at}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        scheduled_publish_at: e.target.value 
                      }))}
                    />
                    {formData.scheduled_publish_at && (
                      <Button
                        onClick={handleScheduledPublish}
                        className="mt-2"
                        size="sm"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Publish
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_comments">Allow comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Let readers comment on this post
                      </p>
                    </div>
                    <Switch
                      id="allow_comments"
                      checked={formData.allow_comments}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, allow_comments: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* SEO Sidebar */}
        <div className="space-y-6">
          <SEOEditor
            customTitle={formData.custom_title}
            setCustomTitle={(value) => setFormData(prev => ({ ...prev, custom_title: value }))}
            metaDescription={formData.meta_description}
            setMetaDescription={(value) => setFormData(prev => ({ ...prev, meta_description: value }))}
            slug={formData.slug}
            setSlug={(value) => setFormData(prev => ({ ...prev, slug: value }))}
            seoFocusKeyword={formData.seo_focus_keyword}
            setSeoFocusKeyword={(value) => setFormData(prev => ({ ...prev, seo_focus_keyword: value }))}
            tags={formData.tags}
            setTags={(tags) => setFormData(prev => ({ ...prev, tags }))}
            categories={formData.categories}
            setCategories={(categories) => setFormData(prev => ({ ...prev, categories }))}
            schemaType={formData.schema_type}
            setSchemaType={(type) => setFormData(prev => ({ ...prev, schema_type: type }))}
            featuredImageUrl={formData.featured_image_url}
            setFeaturedImageUrl={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
            featuredImageAlt={formData.featured_image_alt}
            setFeaturedImageAlt={(alt) => setFormData(prev => ({ ...prev, featured_image_alt: alt }))}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedBlogEditor;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  X, 
  Eye,
  EyeOff,
  FileText,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  tags: string[];
  published: boolean;
  [key: string]: any;
}

interface SimpleBlogEditorProps {
  blogPost?: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const SimpleBlogEditor: React.FC<SimpleBlogEditorProps> = ({ 
  blogPost, 
  onSave, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BlogPost>({
    title: blogPost?.title || '',
    slug: blogPost?.slug || '',
    excerpt: blogPost?.excerpt || '',
    content: blogPost?.content || '',
    featured_image_url: blogPost?.featured_image_url || '',
    tags: blogPost?.tags || [],
    published: blogPost?.published || false,
    ...blogPost
  });

  const [tagInput, setTagInput] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Content required", 
        description: "Please enter some content for your blog post.",
        variant: "destructive"
      });
      return;
    }

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featured_image_url: formData.featured_image_url?.trim() || null,
        tags: formData.tags,
        published: formData.published,
        schema_type: 'BlogPosting',
        allow_comments: true,
        version: 1
      };

      if (blogPost?.id) {
        const { error } = await supabaseAdmin
          .from('blog_posts')
          .update(postData)
          .eq('id', blogPost.id);

        if (error) throw error;

        toast({
          title: "Post updated!",
          description: `"${formData.title}" has been updated successfully.`
        });
      } else {
        const { error } = await supabaseAdmin
          .from('blog_posts')
          .insert(postData);

        if (error) throw error;

        toast({
          title: "Post created!",
          description: `"${formData.title}" has been ${formData.published ? 'published' : 'saved as draft'}.`
        });
      }

      onSave(formData);
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Error saving post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-forest" />
            {blogPost?.id ? 'Edit Post' : 'Create New Post'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {formData.published ? (
              <Badge className="bg-green-100 text-green-800">
                <Eye className="h-3 w-3 mr-1" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary">
                <EyeOff className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter your blog post title..."
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              placeholder="url-friendly-title"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Brief description for previews and SEO..."
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <Label htmlFor="image">Featured Image URL</Label>
          <div className="flex gap-2">
            <ImageIcon className="h-9 w-9 p-2 border rounded text-muted-foreground" />
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              value={formData.featured_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                {tag} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            placeholder="Write your blog post content here..."
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={15}
            className="min-h-[400px]"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <Label>Publication Status</Label>
            <p className="text-sm text-muted-foreground">
              {formData.published 
                ? "This post will be visible to all visitors" 
                : "This post is saved as draft and not visible publicly"
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="published">Draft</Label>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-forest hover:bg-forest/90">
            <Save className="h-4 w-4 mr-2" />
            {formData.published ? 'Publish' : 'Save Draft'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleBlogEditor;
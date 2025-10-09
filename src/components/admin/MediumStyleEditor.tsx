import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bold, 
  Italic, 
  Link, 
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  Heading2,
  Code,
  MoreHorizontal,
  Eye,
  EyeOff,
  Share,
  Settings,
  History,
  ExternalLink,
  Edit3,
  Upload,
  FileImage
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAllBlogPosts } from "@/hooks/useCmsData";
import VisualMarkdownEditor from "@/components/admin/VisualMarkdownEditor";

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

const MediumStyleEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: blogPosts, refetch } = useAllBlogPosts();
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    tags: [],
    published: false,
  });
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeaturedImageDialog, setShowFeaturedImageDialog] = useState(false);
  const [showMetaDialog, setShowMetaDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [inlinePreviewHtml, setInlinePreviewHtml] = useState<string>('');
  const [postsFilter, setPostsFilter] = useState<'all' | 'drafts' | 'published'>('all');
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);
  const [visualMode, setVisualMode] = useState(false);
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

  // Formatting helpers for the editor
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelection = () => {
    const el = textareaRef.current;
    if (!el) return null;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    return { el, start, end, value: el.value };
  };

  const setContentWithSelection = (newContent: string, newStart: number, newEnd: number) => {
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(newStart, newEnd);
      }
    }, 0);
  };

  const surroundSelection = (before: string, after: string = before, placeholder = '') => {
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const selected = value.slice(start, end) || placeholder;
    const newText = value.slice(0, start) + before + selected + after + value.slice(end);
    const newStart = start + before.length;
    const newEnd = newStart + selected.length;
    setContentWithSelection(newText, newStart, newEnd);
  };

  const prefixLines = (prefix: string) => {
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const before = value.slice(0, start);
    const selection = value.slice(start, end);
    const after = value.slice(end);
    const lines = selection.split('\n');
    const modified = lines.map(l => (l ? `${prefix}${l}` : prefix)).join('\n');
    const newText = before + modified + after;
    setContentWithSelection(newText, start, start + modified.length);
  };

  const handleButtonClick = (buttonName: string, action: () => void) => {
    setActiveButton(buttonName);
    action();
    setTimeout(() => setActiveButton(null), 200);
  };

  const handleBold = () => surroundSelection('**', '**', 'bold text');
  const handleItalic = () => surroundSelection('*', '*', 'italic text');
  const handleCodeInline = () => surroundSelection('`', '`', 'code');
  const handleHeading = (level: number) => {
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const selection = value.slice(start, end) || 'Heading';
    const prefix = '#'.repeat(level);
    const lines = selection.split('\n').map(l => `${prefix} ${l}`).join('\n');
    const newText = value.slice(0, start) + lines + value.slice(end);
    setContentWithSelection(newText, start, start + lines.length);
  };
  const handleQuote = () => prefixLines('> ');
  const handleList = () => prefixLines('- ');
  const handleListOrdered = () => {
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const selection = value.slice(start, end) || 'List item';
    const lines = selection.split('\n');
    const modified = lines.map((l, i) => `${i + 1}. ${l || 'List item'}`).join('\n');
    const newText = value.slice(0, start) + modified + value.slice(end);
    setContentWithSelection(newText, start, start + modified.length);
  };
  const handleLink = () => {
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const selected = value.slice(start, end) || 'link text';
    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;
    const markdown = `[${selected}](${url})`;
    const newText = value.slice(0, start) + markdown + value.slice(end);
    const pos = start + markdown.length;
    setContentWithSelection(newText, pos, pos);
  };
  const handleImage = () => {
    const url = window.prompt('Image URL', 'https://');
    if (!url) return;
    const alt = window.prompt('Alt text', 'image');
    const position = window.prompt('Image position (left, right, center, or leave empty for default)', '');
    
    let markdown = `![${alt || 'image'}](${url})`;
    
    // Add position indicator if specified
    if (position && ['left', 'right', 'center'].includes(position.toLowerCase())) {
      markdown = `![${alt || 'image'}](${url} "${position}")`;
    }
    
    const sel = getSelection();
    if (!sel) return;
    const { start, end, value } = sel;
    const newText = value.slice(0, start) + markdown + value.slice(end);
    const pos = start + markdown.length;
    setContentWithSelection(newText, pos, pos);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF).",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    // Validate size (<= 5 MB)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      toast({
        title: "Image too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    const alt = file.name.split('.')[0];

    // Try Supabase Storage upload first (clean URL)
    try {
      const path = `posts/${editingPost?.id || 'drafts'}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from('blog-images')
        .getPublicUrl(path);

      const url = pub.publicUrl;

      // Insert markdown reference and set preview
      const markdown = `![${alt}](${url})`;
      const sel = getSelection();
      if (sel) {
        const { start, end, value } = sel;
        const newText = value.slice(0, start) + markdown + value.slice(end);
        const pos = start + markdown.length;
        setContentWithSelection(newText, pos, pos);
      }

      setLastImagePreview(url);
      setVisualMode(true);
      toast({ title: 'Image uploaded', description: 'Inserted image from your device.' });
    } catch (err) {
      // Fallback to base64 inline image if storage is not set up or user not authenticated
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string; // data:image/...;base64,xxx
        const markdown = `![${alt}](${base64})`;
        const sel = getSelection();
        if (!sel) return;
        const { start, end, value } = sel;
        const newText = value.slice(0, start) + markdown + value.slice(end);
        const pos = start + markdown.length;
        setContentWithSelection(newText, pos, pos);
        setLastImagePreview(base64);
        setVisualMode(true);
        toast({ title: 'Inline image added', description: 'Using inline image since storage upload failed.' });
      };
      reader.readAsDataURL(file);
    } finally {
      event.target.value = '';
    }
  };
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-5">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="list-disc ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="list-decimal ml-4">$1</li>')
      .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"(left|right|center)")?\)/g, (match, alt, url, position) => {
        let className = 'max-w-full h-auto rounded-lg my-4';
        if (position === 'left') {
          className = 'float-left mr-4 mb-4 max-w-xs rounded-lg';
        } else if (position === 'right') {
          className = 'float-right ml-4 mb-4 max-w-xs rounded-lg';
        } else if (position === 'center') {
          className = 'mx-auto block max-w-2xl rounded-lg my-4';
        }
        return `<img src="${url}" alt="${alt}" class="${className}" />`;
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');
  };

  // Inline preview of current block (between blank lines)
  const getCurrentBlock = (text: string, cursor: number) => {
    const prevBlank = text.lastIndexOf('\n\n', Math.max(0, cursor - 1));
    const start = prevBlank >= 0 ? prevBlank + 2 : 0;
    const nextBlank = text.indexOf('\n\n', cursor);
    const end = nextBlank >= 0 ? nextBlank : text.length;
    return text.slice(start, end).trim();
  };

  const updateInlinePreview = () => {
    const el = textareaRef.current;
    if (!el) {
      setInlinePreviewHtml(markdownToHtml(formData.content || ''));
      return;
    }
    const cursor = el.selectionStart || 0;
    const block = getCurrentBlock(formData.content || '', cursor);
    setInlinePreviewHtml(markdownToHtml(block));
  };

  useEffect(() => {
    updateInlinePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.content]);

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        handleButtonClick('bold', handleBold);
      } else if (key === 'i') {
        e.preventDefault();
        handleButtonClick('italic', handleItalic);
      } else if (key === 'k') {
        e.preventDefault();
        handleButtonClick('link', handleLink);
      }
    }
  };

  const handleSave = async (publishStatus: boolean) => {
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

    setIsSaving(true);

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 160),
        content: formData.content.trim(),
        featured_image_url: formData.featured_image_url?.trim() || null,
        tags: formData.tags,
        published: publishStatus,
        schema_type: 'BlogPosting',
        allow_comments: true,
        version: 1
      };

      if (editingPost?.id) {
        const { data, error } = await supabase.functions.invoke('manage-blog', {
          body: {
            action: 'update',
            postId: editingPost.id,
            data: postData
          }
        });

        if (error) throw error;

        // Update the form data with the returned data
        setFormData({ ...data, tags: data.tags || [] });
        setEditingPost(data);

        toast({
          title: "Post updated!",
          description: `"${formData.title}" has been updated successfully.`
        });
      } else {
        const { data, error } = await supabase.functions.invoke('manage-blog', {
          body: {
            action: 'create',
            data: postData
          }
        });

        if (error) throw error;

        // Update the form data with the returned data
        setFormData({ ...data, tags: data.tags || [] });
        setEditingPost(data);

        toast({
          title: "Post created!",
          description: `"${formData.title}" has been ${publishStatus ? 'published' : 'saved as draft'}.`
        });
      }

      refetch();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Error saving post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: post.tags || []
    });
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      tags: [],
      published: false,
    });
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = !post.published;
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-blog', {
        body: {
          action: 'update',
          postId: post.id,
          data: {
            ...post,
            published: newStatus
          }
        }
      });

      if (error) throw error;

      toast({
        title: newStatus ? "Post published!" : "Post unpublished!",
        description: `"${post.title}" has been ${newStatus ? 'published' : 'unpublished'}.`
      });

      refetch();

      // If we're editing this post, update the form
      if (editingPost?.id === post.id) {
        setFormData({ ...data, tags: data.tags || [] });
        setEditingPost(data);
      }
    } catch (error: any) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Error updating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const { error } = await supabase.functions.invoke('manage-blog', {
        body: {
          action: 'delete',
          postId: postId
        }
      });

      if (error) throw error;

      toast({
        title: "Post deleted!",
        description: "Blog post has been deleted successfully."
      });

      refetch();
      
      // If we're editing the deleted post, reset the form
      if (editingPost?.id === postId) {
        handleNewPost();
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareDraft = () => {
    if (editingPost?.slug) {
      const draftUrl = `${window.location.origin}/blog/${editingPost.slug}`;
      navigator.clipboard.writeText(draftUrl);
      toast({
        title: "Draft link copied!",
        description: "Share this link to let others preview your draft."
      });
    } else {
      toast({
        title: "Save draft first",
        description: "Please save your post as a draft before sharing.",
        variant: "destructive"
      });
    }
  };

  const handleFeaturedImageSave = () => {
    setShowFeaturedImageDialog(false);
    toast({
      title: "Featured image updated!",
      description: "Your featured image has been updated."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium">Blog Editor</h1>
            {editingPost ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Editing: {editingPost.title?.substring(0, 20)}...
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                New Draft
              </Badge>
            )}
            {formData.published ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
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
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleNewPost}>
              New Post
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </Button>
            
            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={handleShareDraft}>
                  <Share className="mr-2 h-4 w-4" />
                  Share draft link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFeaturedImageDialog(true)}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Change featured image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowMetaDialog(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Change display title / excerpt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <History className="mr-2 h-4 w-4" />
                  See revision history
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  More settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Input */}
        <div className="mb-6">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-4xl font-bold border-none px-0 py-4 placeholder:text-muted-foreground/60 focus-visible:ring-0 shadow-none bg-transparent"
            style={{ fontSize: '2.5rem', lineHeight: '1.2' }}
          />
        </div>

        {/* Slug Preview */}
        {formData.slug && (
          <div className="mb-4 px-3 py-2 bg-muted/30 rounded-lg text-sm text-muted-foreground flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            <span>URL: /blog/{formData.slug}</span>
          </div>
        )}

        {/* Thumbnail/Featured Image Section */}
        <div className="mb-6 p-4 border-2 border-dashed rounded-lg bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Post Thumbnail</span>
            </div>
            {formData.featured_image_url && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
              >
                Remove
              </Button>
            )}
          </div>
          
          {formData.featured_image_url ? (
            <div className="relative group">
              <img
                src={formData.featured_image_url}
                alt="Thumbnail preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowFeaturedImageDialog(true)}
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                Add a thumbnail image that will appear in blog listings
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowFeaturedImageDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Thumbnail
              </Button>
            </div>
          )}
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tag}
                <button
                  onClick={() => {
                    const newTags = formData.tags.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, tags: newTags }));
                  }}
                  className="ml-2 hover:text-destructive"
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add tags (press Enter)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                const tag = input.value.trim();
                if (tag && !formData.tags.includes(tag)) {
                  setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                  input.value = '';
                }
              }
            }}
            className="border-dashed"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border rounded-lg mb-6 bg-card shadow-sm">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'bold' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('bold', handleBold)} 
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'italic' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('italic', handleItalic)} 
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'heading' ? 'bg-primary/20 scale-110' : ''}`}
                  title="Heading"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={() => handleButtonClick('heading', () => handleHeading(1))}>
                  <span className="text-2xl font-bold">H1</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleButtonClick('heading', () => handleHeading(2))}>
                  <span className="text-xl font-bold">H2</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleButtonClick('heading', () => handleHeading(3))}>
                  <span className="text-lg font-bold">H3</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'quote' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('quote', handleQuote)} 
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'list' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('list', handleList)} 
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'ordered-list' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('ordered-list', handleListOrdered)} 
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'link' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('link', handleLink)} 
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'image' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('image', handleImage)} 
              title="Insert Image URL"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload Image from PC"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 transition-all duration-200 hover:bg-primary/10 bg-primary/5 border-primary/20"
                title="Upload Image from PC"
              >
                <Upload className="h-4 w-4 mr-1" />
                <span className="text-xs">Upload</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 ${activeButton === 'code' ? 'bg-primary/20 scale-110' : ''}`}
              onClick={() => handleButtonClick('code', handleCodeInline)} 
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={visualMode ? "default" : "ghost"}
              size="sm" 
              className="h-9 px-3 transition-all duration-200"
              onClick={() => setVisualMode(!visualMode)}
              title="Toggle Visual Mode"
            >
              Visual
            </Button>
            <Button 
              variant={showPreview ? "default" : "ghost"}
              size="sm" 
              className="h-9 px-3 transition-all duration-200"
              onClick={() => setShowPreview(!showPreview)}
              title="Toggle Preview"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {lastImagePreview && (
          <div className="mb-4 p-3 border rounded-md bg-card/50 flex items-center gap-3">
            <img src={lastImagePreview} alt="Last uploaded preview" className="h-16 w-16 object-cover rounded" />
            <div className="text-sm text-muted-foreground">Last image inserted into the editor.</div>
          </div>
        )}

        {/* Content Editor */}
        <div className="mb-8">
          {showPreview ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Write</h3>
                {visualMode ? (
                  <VisualMarkdownEditor
                    value={formData.content}
                    onChange={(markdown) => setFormData(prev => ({ ...prev, content: markdown }))}
                  />
                ) : (
                  <Textarea
                    placeholder="Tell your story..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    onSelect={updateInlinePreview}
                    onKeyUp={updateInlinePreview}
                    onKeyDown={handleEditorKeyDown}
                    ref={textareaRef}
                    className="min-h-[500px] text-lg leading-relaxed border rounded-lg p-4 resize-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
                    style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
                  />
                )}
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Inline view</div>
                  <div
                    className="p-3 border rounded-md bg-card/50 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: inlinePreviewHtml || 'Start typing to see inline view...' }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
                <div 
                  className="min-h-[500px] p-4 border rounded-lg bg-card prose prose-sm max-w-none overflow-auto"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.content || 'Start writing to see the preview...') }}
                />
              </div>
            </div>
          ) : (
            <>
              {visualMode ? (
                <VisualMarkdownEditor
                  value={formData.content}
                  onChange={(markdown) => setFormData(prev => ({ ...prev, content: markdown }))}
                />
              ) : (
                <Textarea
                  placeholder="Tell your story..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  onSelect={updateInlinePreview}
                  onKeyUp={updateInlinePreview}
                  onKeyDown={handleEditorKeyDown}
                  ref={textareaRef}
                  className="min-h-[500px] text-lg leading-relaxed border-none px-0 resize-none focus-visible:ring-0 shadow-none bg-transparent transition-all duration-200"
                  style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
                />
              )}
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">Inline view</div>
                <div
                  className="p-3 border rounded-md bg-card/50 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: inlinePreviewHtml || 'Start typing to see inline view...' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Featured Image Dialog */}
        {showFeaturedImageDialog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Featured Image / Thumbnail</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Option 1: Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (!file.type.startsWith('image/')) {
                          toast({ title: "Invalid file type", description: "Please upload an image file.", variant: "destructive" });
                          return;
                        }
                        
                        const MAX_BYTES = 5 * 1024 * 1024;
                        if (file.size > MAX_BYTES) {
                          toast({ title: "Image too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
                          return;
                        }
                        
                        try {
                          const path = `thumbnails/${Date.now()}-${file.name}`;
                          const { error: uploadError } = await supabase.storage
                            .from('blog-images')
                            .upload(path, file, { upsert: false, contentType: file.type });
                          
                          if (uploadError) throw uploadError;
                          
                          const { data: pub } = supabase.storage
                            .from('blog-images')
                            .getPublicUrl(path);
                          
                          setFormData(prev => ({ ...prev, featured_image_url: pub.publicUrl }));
                          toast({ title: 'Thumbnail uploaded', description: 'Successfully uploaded thumbnail image.' });
                        } catch (err) {
                          toast({ title: 'Upload failed', description: 'Failed to upload thumbnail. Please try URL instead.', variant: "destructive" });
                        }
                        e.target.value = '';
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image File
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Option 2: Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.featured_image_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  />
                </div>
                
                {formData.featured_image_url && (
                  <div className="p-2 border rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <img
                      src={formData.featured_image_url}
                      alt="Featured preview"
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.classList.remove('hidden');
                      }}
                    />
                    <p className="text-xs text-destructive hidden mt-2">Failed to load image from URL</p>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowFeaturedImageDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFeaturedImageSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Information Dialog */}
        {showMetaDialog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">URL Slug</label>
                  <Input
                    placeholder="url-friendly-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    placeholder="Brief description for previews..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowMetaDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowMetaDialog(false)}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar with existing posts */}
        {blogPosts && blogPosts.length > 0 && (
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Your Posts</h3>
              <div className="flex gap-2">
                <Button 
                  variant={postsFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostsFilter('all')}
                >
                  All ({blogPosts.length})
                </Button>
                <Button 
                  variant={postsFilter === 'drafts' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostsFilter('drafts')}
                >
                  Drafts ({blogPosts.filter(p => !p.published).length})
                </Button>
                <Button 
                  variant={postsFilter === 'published' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostsFilter('published')}
                >
                  Published ({blogPosts.filter(p => p.published).length})
                </Button>
              </div>
            </div>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {blogPosts
                .filter(post => {
                  if (postsFilter === 'drafts') return !post.published;
                  if (postsFilter === 'published') return post.published;
                  return true;
                })
                .map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleLoadPost(post)}
                      >
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {post.excerpt?.substring(0, 80)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          variant={post.published ? "default" : "secondary"} 
                          className="text-xs cursor-pointer hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePublish(post);
                          }}
                          title={post.published ? "Click to unpublish" : "Click to publish"}
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadPost(post);
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          title="Edit post"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          title="Delete post"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediumStyleEditor;
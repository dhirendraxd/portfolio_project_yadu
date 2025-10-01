import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Search, Target, Globe } from "lucide-react";
import { useState } from 'react';

interface SEOEditorProps {
  customTitle: string;
  setCustomTitle: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  seoFocusKeyword: string;
  setSeoFocusKeyword: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  schemaType: string;
  setSchemaType: (type: string) => void;
  featuredImageUrl: string;
  setFeaturedImageUrl: (url: string) => void;
  featuredImageAlt: string;
  setFeaturedImageAlt: (alt: string) => void;
}

const SEOEditor: React.FC<SEOEditorProps> = ({
  customTitle,
  setCustomTitle,
  metaDescription,
  setMetaDescription,
  slug,
  setSlug,
  seoFocusKeyword,
  setSeoFocusKeyword,
  tags,
  setTags,
  categories,
  setCategories,
  schemaType,
  setSchemaType,
  featuredImageUrl,
  setFeaturedImageUrl,
  featuredImageAlt,
  setFeaturedImageAlt
}) => {
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  const generateSlugFromTitle = () => {
    const slug = customTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(slug);
  };

  // SEO Score calculation
  const calculateSEOScore = () => {
    let score = 0;
    const checks = [];

    // Title length (30-60 chars is optimal)
    if (customTitle.length >= 30 && customTitle.length <= 60) {
      score += 20;
      checks.push({ text: "Title length optimal", status: "good" });
    } else {
      checks.push({ text: `Title length: ${customTitle.length} chars (30-60 recommended)`, status: "warning" });
    }

    // Meta description length (120-160 chars is optimal)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      score += 20;
      checks.push({ text: "Meta description length optimal", status: "good" });
    } else {
      checks.push({ text: `Meta description: ${metaDescription.length} chars (120-160 recommended)`, status: "warning" });
    }

    // Focus keyword in title
    if (seoFocusKeyword && customTitle.toLowerCase().includes(seoFocusKeyword.toLowerCase())) {
      score += 15;
      checks.push({ text: "Focus keyword in title", status: "good" });
    } else if (seoFocusKeyword) {
      checks.push({ text: "Focus keyword not in title", status: "error" });
    }

    // Focus keyword in meta description
    if (seoFocusKeyword && metaDescription.toLowerCase().includes(seoFocusKeyword.toLowerCase())) {
      score += 15;
      checks.push({ text: "Focus keyword in meta description", status: "good" });
    } else if (seoFocusKeyword) {
      checks.push({ text: "Focus keyword not in meta description", status: "error" });
    }

    // Slug quality
    if (slug && slug.length > 3 && slug.includes('-')) {
      score += 10;
      checks.push({ text: "SEO-friendly slug", status: "good" });
    } else {
      checks.push({ text: "Improve slug structure", status: "warning" });
    }

    // Featured image
    if (featuredImageUrl && featuredImageAlt) {
      score += 10;
      checks.push({ text: "Featured image with alt text", status: "good" });
    } else if (featuredImageUrl) {
      checks.push({ text: "Featured image missing alt text", status: "warning" });
    } else {
      checks.push({ text: "No featured image", status: "warning" });
    }

    // Tags and categories
    if (tags.length > 0 && categories.length > 0) {
      score += 10;
      checks.push({ text: "Tags and categories added", status: "good" });
    } else {
      checks.push({ text: "Add tags and categories", status: "warning" });
    }

    return { score, checks };
  };

  const seoAnalysis = calculateSEOScore();

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SEO Score: {seoAnalysis.score}/100
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoAnalysis.checks.map((check, index) => (
              <div key={index} className={`text-sm flex items-center gap-2 ${
                check.status === 'good' ? 'text-green-600' : 
                check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  check.status === 'good' ? 'bg-green-500' : 
                  check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                {check.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic SEO Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customTitle">Custom SEO Title</Label>
            <Input
              id="customTitle"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter SEO-optimized title (30-60 characters)"
              maxLength={60}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {customTitle.length}/60 characters
            </div>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter compelling meta description (120-160 characters)"
              maxLength={160}
              rows={3}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {metaDescription.length}/160 characters
            </div>
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateSlugFromTitle}
                disabled={!customTitle}
              >
                Generate
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              URL: /blog/{slug || 'your-slug'}
            </div>
          </div>

          <div>
            <Label htmlFor="seoFocusKeyword">Focus Keyword</Label>
            <Input
              id="seoFocusKeyword"
              value={seoFocusKeyword}
              onChange={(e) => setSeoFocusKeyword(e.target.value)}
              placeholder="Main keyword to optimize for"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
            <Input
              id="featuredImageUrl"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="featuredImageAlt">Alt Text</Label>
            <Input
              id="featuredImageAlt"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              placeholder="Descriptive alt text for the image"
            />
          </div>

          {featuredImageUrl && (
            <div className="mt-4">
              <Label>Preview</Label>
              <img
                src={featuredImageUrl}
                alt={featuredImageAlt}
                className="w-full max-w-md h-48 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories and Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Categories</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category"
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button type="button" onClick={addCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(category)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Structured Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="schemaType">Schema Type</Label>
            <Select value={schemaType} onValueChange={setSchemaType}>
              <SelectTrigger>
                <SelectValue placeholder="Select schema type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="HowTo">How-To</SelectItem>
                <SelectItem value="FAQPage">FAQ Page</SelectItem>
                <SelectItem value="NewsArticle">News Article</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOEditor;
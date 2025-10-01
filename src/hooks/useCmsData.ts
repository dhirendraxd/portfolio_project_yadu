import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  impact: string | null;
  tags: string[] | null;
  image_url: string | null;
  link_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  custom_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  image_url: string | null;
  tags: string[] | null;
  categories: string[] | null;
  reading_time: number | null;
  word_count: number | null;
  published: boolean;
  allow_comments: boolean;
  scheduled_publish_at: string | null;
  seo_focus_keyword: string | null;
  schema_type: string;
  internal_links: string[] | null;
  external_links: string[] | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  organization: string | null;
  content: string;
  image_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export const usePortfolioItems = () => {
  return useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PortfolioItem[];
    },
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

export const useImpactStats = () => {
  return useQuery({
    queryKey: ["impact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as ImpactStat[];
    },
  });
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

export const useSiteSetting = (key: string) => {
  return useQuery({
    queryKey: ["site-setting", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .single();
      
      if (error) throw error;
      return data as SiteSetting;
    },
  });
};

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  content: string;
  author_name: string;
  author_email: string;
  parent_comment_id: string | null;
  approved: boolean;
  spam_score: number;
  created_at: string;
  updated_at: string;
}

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as BlogCategory[];
    },
  });
};

export const useBlogComments = (blogPostId: string) => {
  return useQuery({
    queryKey: ["blog-comments", blogPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_post_id", blogPostId)
        .eq("approved", true)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as BlogComment[];
    },
    enabled: !!blogPostId,
  });
};
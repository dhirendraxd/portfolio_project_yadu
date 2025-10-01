-- Create CMS tables for editable content

-- Portfolio items table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  impact TEXT,
  tags TEXT[],
  image_url TEXT,
  link_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  reading_time INTEGER,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Impact statistics table
CREATE TABLE public.impact_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table for background images and other settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Portfolio items are publicly readable" 
ON public.portfolio_items 
FOR SELECT 
USING (true);

CREATE POLICY "Blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Impact stats are publicly readable" 
ON public.impact_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Testimonials are publicly readable" 
ON public.testimonials 
FOR SELECT 
USING (true);

CREATE POLICY "Site settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_stats_updated_at
  BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default impact statistics
INSERT INTO public.impact_stats (label, value, icon, display_order) VALUES
('Communities Served', '15+', 'Users', 1),
('Research Publications', '8', 'BookOpen', 2),
('People Impacted', '350+', 'Heart', 3),
('Active Projects', '5', 'Star', 4);

-- Insert default testimonials
INSERT INTO public.testimonials (name, role, organization, content, featured) VALUES
('Dr. Sarah Johnson', 'Research Director', 'Rural Development Institute', 'Yadav''s community-centered approach to research has been instrumental in creating lasting positive change in rural communities.', true),
('Priya Sharma', 'Community Leader', 'Village Development Committee', 'His dedication to sustainability and social justice has transformed how we approach development in our region.', true);

-- Insert default portfolio items
INSERT INTO public.portfolio_items (title, category, description, impact, tags, featured) VALUES
('Community-Based Water Management', 'Research', 'Sustainable water resource management practices in rural communities', '12 villages', ARRAY['Research', 'Water', 'Sustainability'], true),
('Digital Literacy for Rural Women', 'Project', 'Technology training to bridge the digital divide', '250+ women', ARRAY['Education', 'Technology', 'Women Empowerment'], true),
('Youth Leadership Development', 'Volunteer', 'Leadership workshops for rural youth', '80+ youth', ARRAY['Leadership', 'Youth', 'Community'], false);

-- Insert default blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, reading_time, published) VALUES
('The Future of Sustainable Rural Development', 'future-sustainable-rural-development', 'Exploring innovative approaches to community-centered development that prioritize environmental sustainability and social equity.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...', 8, true),
('Building Community Resilience Through Participatory Research', 'building-community-resilience', 'How involving communities in research processes leads to more effective and sustainable development outcomes.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...', 6, true);

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('hero_background_image', '/src/assets/hero-sustainability.jpg', 'Hero section background image'),
('site_title', 'Yadav Singh Dhami - Sustainability & Rural Development', 'Main site title'),
('site_description', 'Personal portfolio of Yadav Singh Dhami - Rural Development student passionate about sustainability, social justice, and community empowerment', 'Site description for SEO');
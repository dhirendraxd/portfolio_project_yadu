-- Fix security warnings by updating function with search_path
CREATE OR REPLACE FUNCTION public.delete_expired_content()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete expired blog posts
  DELETE FROM public.blog_posts
  WHERE auto_delete_at IS NOT NULL
    AND auto_delete_at <= now();

  -- Delete expired portfolio items
  DELETE FROM public.portfolio_items
  WHERE auto_delete_at IS NOT NULL
    AND auto_delete_at <= now();
END;
$$;

-- Also fix the existing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
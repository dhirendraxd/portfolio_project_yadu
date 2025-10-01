-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.calculate_blog_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate word count from content
  NEW.word_count = array_length(string_to_array(regexp_replace(NEW.content, '<[^>]+>', '', 'g'), ' '), 1);
  
  -- Calculate reading time (average 250 words per minute)
  NEW.reading_time = GREATEST(1, ROUND(NEW.word_count::numeric / 250));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
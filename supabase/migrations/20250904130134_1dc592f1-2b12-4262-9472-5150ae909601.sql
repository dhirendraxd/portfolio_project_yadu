-- Enable required extensions for scheduling
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Add auto-delete column to content tables
alter table public.blog_posts
  add column if not exists auto_delete_at timestamp with time zone null;

alter table public.portfolio_items
  add column if not exists auto_delete_at timestamp with time zone null;

-- Helpful indexes for efficient cleanup
create index if not exists blog_posts_auto_delete_at_idx
  on public.blog_posts (auto_delete_at);

create index if not exists portfolio_items_auto_delete_at_idx
  on public.portfolio_items (auto_delete_at);

-- Function to delete expired content
create or replace function public.delete_expired_content()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete expired blog posts
  delete from public.blog_posts
  where auto_delete_at is not null
    and auto_delete_at <= now();

  -- Delete expired portfolio items
  delete from public.portfolio_items
  where auto_delete_at is not null
    and auto_delete_at <= now();
end;
$$;

-- Ensure only one cron job exists by unscheduling any previous one
do $$
declare
  jid integer;
begin
  for jid in select jobid from cron.job where jobname = 'delete-expired-content-every-5-min' loop
    perform cron.unschedule(jid);
  end loop;
end $$;

-- Schedule the cleanup every 5 minutes
select cron.schedule(
  'delete-expired-content-every-5-min',
  '*/5 * * * *',
  $$select public.delete_expired_content();$$
);

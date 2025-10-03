import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, data, postId } = await req.json();
    
    console.log('Blog management action:', action, 'postId:', postId);

    let result;
    
    switch (action) {
      case 'create':
        result = await supabase
          .from('blog_posts')
          .insert(data)
          .select()
          .single();
        break;
        
      case 'update':
        if (!postId) {
          throw new Error('Post ID required for update');
        }
        result = await supabase
          .from('blog_posts')
          .update(data)
          .eq('id', postId)
          .select()
          .single();
        break;
        
      case 'delete':
        if (!postId) {
          throw new Error('Post ID required for delete');
        }
        result = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (result.error) {
      console.error('Database error:', result.error);
      throw result.error;
    }

    console.log('Operation successful:', action);
    
    return new Response(
      JSON.stringify(result.data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in manage-blog function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

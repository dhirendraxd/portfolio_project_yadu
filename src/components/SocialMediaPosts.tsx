import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Star, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  post_url?: string;
  image_url?: string;
  posted_at?: string;
  featured: boolean;
  created_at: string;
  post_title?: string;
  mentions?: string[];
}

const SocialMediaPosts = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["social-media-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_posts")
        .select("*")
        .order("posted_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SocialMediaPost[];
    },
  });

  const getPlatformColor = (platform: string) => {
    const colors = {
      facebook: "bg-blue-600",
      instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      linkedin: "bg-blue-700",
      twitter: "bg-sky-500",
      youtube: "bg-red-600",
      tiktok: "bg-black",
      other: "bg-gray-600"
    };
    return colors[platform as keyof typeof colors] || colors.other;
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      facebook: Facebook,
      instagram: Instagram,
      linkedin: Linkedin,
      twitter: Twitter,
      youtube: Youtube,
      tiktok: Star, // Using Star as placeholder for TikTok
      other: ExternalLink
    };
    return icons[platform as keyof typeof icons] || icons.other;
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !posts?.length) {
    return null;
  }

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-glass">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-forest via-sage to-coral bg-clip-text text-transparent">
            Social Media Highlights
          </h2>
          <p className="text-xl font-semibold text-charcoal max-w-2xl mx-auto leading-relaxed">
            Stay connected with my latest thoughts, updates, and insights across social platforms
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-charcoal mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-coral" />
              Featured Posts
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {featuredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="glass-card hover-lift transition-all duration-300 border-coral/20"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(post.platform)}`}>
                          {(() => {
                            const IconComponent = getPlatformIcon(post.platform);
                            return <IconComponent className="h-5 w-5" />;
                          })()}
                        </div>
                        <div>
                          <span className="capitalize font-semibold">{post.platform}</span>
                          {post.posted_at && (
                            <div className="flex items-center gap-1 text-sm text-charcoal/60">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.posted_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {post.post_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(post.post_url, '_blank')}
                          className="hover:text-coral"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {post.post_title && (
                      <h4 className="font-semibold text-charcoal text-lg">{post.post_title}</h4>
                    )}
                    <p className="text-charcoal/90 leading-relaxed">{post.content}</p>
                    {post.mentions && post.mentions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-charcoal/75 font-medium">Mentions:</span>
                        {post.mentions.map((mention, index) => (
                          <span key={index} className="text-sm bg-forest/10 text-forest px-2 py-1 rounded-full">
                            @{mention}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.image_url && (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={post.image_url}
                          alt="Social media post"
                          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-charcoal mb-6">Recent Posts</h3>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {regularPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="glass-card hover-lift transition-all duration-300 w-80 flex-shrink-0"
                  >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getPlatformColor(post.platform)}`}>
                          {(() => {
                            const IconComponent = getPlatformIcon(post.platform);
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                        </div>
                        <span className="capitalize text-sm font-semibold">{post.platform}</span>
                      </div>
                      {post.post_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(post.post_url, '_blank')}
                          className="hover:text-coral"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </CardTitle>
                    {post.posted_at && (
                      <div className="flex items-center gap-1 text-xs text-charcoal/60">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.posted_at).toLocaleDateString()}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {post.post_title && (
                      <h4 className="font-semibold text-charcoal text-base">{post.post_title}</h4>
                    )}
                    <p className="text-charcoal/85 text-sm leading-relaxed line-clamp-4">{post.content}</p>
                    {post.mentions && post.mentions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.mentions.slice(0, 3).map((mention, index) => (
                          <span key={index} className="text-xs bg-forest/10 text-forest px-2 py-1 rounded-full">
                            @{mention}
                          </span>
                        ))}
                        {post.mentions.length > 3 && (
                          <span className="text-xs text-charcoal/60">+{post.mentions.length - 3} more</span>
                        )}
                      </div>
                    )}
                    {post.image_url && (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={post.image_url}
                          alt="Social media post"
                          className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialMediaPosts;
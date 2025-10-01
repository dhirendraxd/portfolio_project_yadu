import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, ExternalLink, X } from "lucide-react";

interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  post_url?: string;
  image_url?: string;
  posted_at?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  post_title?: string;
  mentions?: string[];
}

const SocialMediaManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);
  const [formData, setFormData] = useState({
    platform: "",
    content: "",
    post_url: "",
    image_url: "",
    posted_at: "",
    featured: false,
    post_title: "",
    mentions: [] as string[]
  });
  const [mentionInput, setMentionInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch social media posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["social-media-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SocialMediaPost[];
    },
  });

  // Create/Update mutation
  const upsertMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const postData = {
        platform: data.platform,
        content: data.content,
        post_url: data.post_url || null,
        image_url: data.image_url || null,
        posted_at: data.posted_at || null,
        featured: data.featured,
        post_title: data.post_title || null,
        mentions: data.mentions.length > 0 ? data.mentions : null
      };

      if (editingPost) {
        const { error } = await supabase
          .from("social_media_posts")
          .update(postData)
          .eq("id", editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("social_media_posts")
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-media-posts"] });
      toast({
        title: "Success",
        description: `Social media post ${editingPost ? "updated" : "created"} successfully!`,
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? "update" : "create"} post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_media_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-media-posts"] });
      toast({
        title: "Success",
        description: "Social media post deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      platform: "",
      content: "",
      post_url: "",
      image_url: "",
      posted_at: "",
      featured: false,
      post_title: "",
      mentions: []
    });
    setMentionInput("");
    setEditingPost(null);
  };

  const handleEdit = (post: SocialMediaPost) => {
    setEditingPost(post);
    setFormData({
      platform: post.platform,
      content: post.content,
      post_url: post.post_url || "",
      image_url: post.image_url || "",
      posted_at: post.posted_at ? post.posted_at.split('T')[0] : "",
      featured: post.featured,
      post_title: post.post_title || "",
      mentions: post.mentions || []
    });
    setMentionInput("");
    setIsDialogOpen(true);
  };

  const addMention = () => {
    if (mentionInput.trim() && !formData.mentions.includes(mentionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        mentions: [...prev.mentions, mentionInput.trim()]
      }));
      setMentionInput("");
    }
  };

  const removeMention = (mention: string) => {
    setFormData(prev => ({
      ...prev,
      mentions: prev.mentions.filter(m => m !== mention)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.content) {
      toast({
        title: "Error",
        description: "Platform and content are required fields.",
        variant: "destructive",
      });
      return;
    }
    upsertMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Social Media Posts</h2>
          <p className="text-charcoal/70">Manage your social media content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Social Media Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Social Media Post" : "Add New Social Media Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posted_at">Posted Date</Label>
                  <Input
                    id="posted_at"
                    type="date"
                    value={formData.posted_at}
                    onChange={(e) => setFormData({ ...formData, posted_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="post_title">Post Title</Label>
                <Input
                  id="post_title"
                  placeholder="Give your post a title..."
                  value={formData.post_title}
                  onChange={(e) => setFormData({ ...formData, post_title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Your social media post content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Mentions</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a mention (person/organization)..."
                    value={mentionInput}
                    onChange={(e) => setMentionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                  />
                  <Button type="button" onClick={addMention} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.mentions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.mentions.map((mention, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-forest/10 text-forest px-2 py-1 rounded-full text-sm"
                      >
                        @{mention}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeMention(mention)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="post_url">Post URL</Label>
                <Input
                  id="post_url"
                  placeholder="https://..."
                  value={formData.post_url}
                  onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "Saving..." : editingPost ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="capitalize">{post.platform}</span>
                    {post.featured && (
                      <span className="bg-coral text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </CardTitle>
                  {post.post_title && (
                    <h4 className="font-medium text-charcoal mt-1">{post.post_title}</h4>
                  )}
                  <CardDescription>
                    {post.posted_at ? new Date(post.posted_at).toLocaleDateString() : "No date"}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {post.post_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(post.post_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/80 mb-3">{post.content}</p>
              {post.mentions && post.mentions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm text-charcoal/75 font-medium">Mentions:</span>
                  {post.mentions.map((mention, index) => (
                    <span key={index} className="text-sm bg-forest/10 text-forest px-2 py-1 rounded-full">
                      @{mention}
                    </span>
                  ))}
                </div>
              )}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Social media post"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        ))}
        
        {posts?.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-charcoal/60">No social media posts yet. Add your first post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialMediaManager;
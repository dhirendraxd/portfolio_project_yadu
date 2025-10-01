import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Reply, 
  Clock, 
  User,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  blog_post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  parent_comment_id?: string;
  created_at: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  blogPostId: string;
  allowComments: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  blogPostId, 
  allowComments = true 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });

  // Load comments
  useEffect(() => {
    loadComments();
  }, [blogPostId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_post_id', blogPostId)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into threads
      const organizedComments = organizeComments(data || []);
      setComments(organizedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeComments = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into threads
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.author_email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_post_id: blogPostId,
          author_name: formData.author_name.trim(),
          author_email: formData.author_email.trim(),
          content: formData.content.trim(),
          parent_comment_id: parentId || null,
          approved: false // Comments need approval
        });

      if (error) throw error;

      toast.success("Comment submitted! It will appear after approval.");
      
      // Reset form
      setFormData({
        author_name: '',
        author_email: '',
        content: ''
      });
      setReplyingTo(null);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const CommentForm = ({ parentId, onCancel }: { parentId?: string; onCancel?: () => void }) => (
    <form onSubmit={(e) => handleSubmit(e, parentId)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`name-${parentId || 'root'}`}>Name *</Label>
          <Input
            id={`name-${parentId || 'root'}`}
            value={formData.author_name}
            onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label htmlFor={`email-${parentId || 'root'}`}>Email *</Label>
          <Input
            id={`email-${parentId || 'root'}`}
            type="email"
            value={formData.author_email}
            onChange={(e) => setFormData(prev => ({ ...prev, author_email: e.target.value }))}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor={`comment-${parentId || 'root'}`}>
          {parentId ? 'Reply' : 'Comment'} *
        </Label>
        <Textarea
          id={`comment-${parentId || 'root'}`}
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder={parentId ? "Write your reply..." : "Share your thoughts..."}
          rows={4}
          required
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          <Send className="h-4 w-4 mr-2" />
          {submitting ? 'Submitting...' : (parentId ? 'Post Reply' : 'Post Comment')}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        <AlertTriangle className="h-3 w-3 inline mr-1" />
        Comments are moderated and will appear after approval.
      </div>
    </form>
  );

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-forest/10 text-forest">
            {getInitials(comment.author_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">
              {comment.author_name}
            </span>
            {comment.approved && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <time dateTime={comment.created_at}>
                {formatDate(comment.created_at)}
              </time>
            </div>
          </div>
          
          <div className="text-foreground whitespace-pre-wrap mb-3">
            {comment.content}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(comment.id)}
            className="h-auto p-0 font-medium text-forest hover:text-forest/80"
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
          
          {replyingTo === comment.id && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <CommentForm 
                parentId={comment.id} 
                onCancel={() => setReplyingTo(null)} 
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (!allowComments) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="bg-muted/50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Join the discussion</h3>
          <CommentForm />
        </div>
        
        {/* Comments List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
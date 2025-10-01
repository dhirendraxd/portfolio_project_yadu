import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Copy, 
  Share2,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  url: string;
  excerpt?: string;
  via?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  title, 
  url, 
  excerpt = "", 
  via = "yadavsinghdhami" 
}) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedExcerpt = encodeURIComponent(excerpt);
  const encodedVia = encodeURIComponent(via);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "hover:bg-blue-50"
    },
    {
      name: "Twitter/X",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=${encodedVia}`,
      color: "text-black hover:text-gray-700",
      bgColor: "hover:bg-gray-50"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
      color: "text-blue-700 hover:text-blue-800",
      bgColor: "hover:bg-blue-50"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "text-green-600 hover:text-green-700",
      bgColor: "hover:bg-green-50"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0ARead more: ${encodedUrl}`,
      color: "text-gray-600 hover:text-gray-700",
      bgColor: "hover:bg-gray-50"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  // Web Share API for mobile devices
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5" />
          Share this article
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Social sharing buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {shareLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                onClick={() => handleShare(social.url)}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${social.bgColor} transition-colors`}
                title={`Share on ${social.name}`}
              >
                <social.icon className={`h-5 w-5 ${social.color}`} />
                <span className="text-xs font-medium">{social.name}</span>
              </Button>
            ))}
          </div>

          {/* Copy link and native share */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={copyToClipboard}
              className="flex-1 flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            
            {navigator.share && (
              <Button
                variant="secondary"
                onClick={handleNativeShare}
                className="flex-1 flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>

          {/* Share statistics (placeholder) */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Help spread the word about rural development and sustainability!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
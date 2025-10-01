import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const isHomePage = location.pathname === "/" && !isAdmin;
  if (isAdmin) return null;
  
  const [formData, setFormData] = useState({
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    emailjs.init({ publicKey: "AvLSpB8ymZKG65p76" });
  }, []);

  useEffect(() => {
    emailjs.init({ publicKey: "AvLSpB8ymZKG65p76" });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both email and message fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // EmailJS configuration
      const serviceID = 'your_service_id'; // Replace with your service ID
      const templateID = 'your_template_id'; // Replace with your template ID
      const publicKey = 'AvLSpB8ymZKG65p76';

      // Initialize EmailJS
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        await (window as any).emailjs.send(serviceID, templateID, {
          user_email: formData.email,
          message: formData.message,
          to_email: 'your-email@example.com' // Replace with your email
        }, publicKey);

        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon!",
          className: "bg-sage text-white"
        });
        
        setFormData({ email: "", message: "" });
      } else {
        throw new Error('EmailJS not loaded');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact me directly.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-glass-border">
      {/* Mixed gradient background overlay */}
      {isHomePage && <div className="absolute inset-0 gradient-mixed opacity-15"></div>}
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Contact Form Section - Only on homepage, not on admin page */}
      {isHomePage && !window.location.pathname.includes('/admin') && (
          <div className="mb-12">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-forest via-sage to-coral bg-clip-text text-transparent mb-3">
                  Get In Touch
                </h3>
                <p className="text-charcoal/80 text-lg">
                  Have a message? I'd love to hear from you. Send me a note and I'll get back to you soon.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-charcoal flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="bg-white/50 border-glass-border focus:border-sage focus:ring-sage/20 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-charcoal flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts, questions, or ideas..."
                      rows={5}
                      className="bg-white/50 border-glass-border focus:border-sage focus:ring-sage/20 transition-all duration-300 resize-none"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-forest to-sage hover:from-sage hover:to-forest text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Information Panel */}
                <div className="lg:pl-8">
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-glass-border">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/lovable-uploads/41416594-3d23-4786-856d-ccf87d42c4d6.png" 
                          alt="Yadav Singh Dhami" 
                          className="w-10 h-10 rounded-lg object-cover shadow-glass"
                        />
                        <span className="font-semibold text-charcoal text-lg">Yadav Singh Dhami</span>
                      </div>
                      <p className="text-charcoal/80 text-sm leading-relaxed">
                        Passionate advocate for sustainability, social justice, and community empowerment. 
                        Building bridges between rural communities and sustainable development.
                      </p>
                      
                      <div className="space-y-3 pt-4">
                        <h4 className="font-semibold text-charcoal">Quick Links</h4>
                        <div className="flex flex-col space-y-2">
                          <Link 
                            to="/" 
                            className="text-charcoal/70 hover:text-forest text-sm transition-colors hover-lift inline-block"
                          >
                            Home
                          </Link>
                          <Link 
                            to="/blog" 
                            className="text-charcoal/70 hover:text-forest text-sm transition-colors hover-lift inline-block"
                          >
                            Blog
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Simple footer for other pages */}
        {!isHomePage && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/41416594-3d23-4786-856d-ccf87d42c4d6.png" 
                alt="Yadav Singh Dhami" 
                className="w-8 h-8 rounded-lg object-cover shadow-glass"
              />
              <span className="font-semibold text-charcoal text-lg">Yadav Singh Dhami</span>
            </div>
            <div className="flex justify-center space-x-6">
              <Link 
                to="/" 
                className="text-charcoal/70 hover:text-forest text-sm transition-colors hover-lift"
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="text-charcoal/70 hover:text-forest text-sm transition-colors hover-lift"
              >
                Blog
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-glass-border pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-charcoal/80 text-sm font-medium">
            © 2024 Yadav Singh Dhami. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-charcoal/80 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-coral animate-pulse" />
            <span>for sustainable change</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
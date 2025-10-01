
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, ArrowRight, BookOpen, MessageCircle, Filter, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts, useBlogCategories } from "@/hooks/useCmsData";
import SEOHead from "@/components/SEOHead";
import { createBreadcrumbStructuredData, createBlogStructuredData } from "@/utils/structuredData";
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from "@/utils/seoConstants";

const Blog = () => {
  const { data: blogPosts, isLoading } = useBlogPosts();
  const { data: blogCategories } = useBlogCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get all unique tags
  const allTags = blogPosts ? 
    Array.from(new Set(blogPosts.flatMap(post => post.tags || []))) : [];

  // Filter posts based on search, tag, and category
  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    const matchesCategory = !selectedCategory || post.categories?.includes(selectedCategory);
    
    return matchesSearch && matchesTag && matchesCategory && post.published;
  }) || [];

  const featuredPost = filteredPosts.find(post => post.tags?.includes("featured")) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <>
      <SEOHead 
        title={PAGE_TITLES.blog}
        description={PAGE_DESCRIPTIONS.blog}
        keywords={`${SITE_CONFIG.keywords.join(', ')}, blog, research insights, articles, stories, development policy analysis, environmental advocacy, rural economics research`}
        canonical="https://yadavsinghdhami.com/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            createBreadcrumbStructuredData([
              { name: "Home", url: "https://yadavsinghdhami.com" },
              { name: "Blog & Insights", url: "https://yadavsinghdhami.com/blog" }
            ]),
            ...(featuredPost ? [createBlogStructuredData(
              featuredPost.title,
              featuredPost.excerpt || featuredPost.title,
              featuredPost.created_at,
              featuredPost.image_url,
              featuredPost.tags
            )] : [])
          ]
        }}
      />
      <div className="min-h-screen relative">
      {/* Page background uses global gradient; overlay removed to avoid fade */}
      <div className="relative pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <div className="max-w-5xl mx-auto text-center mb-16">
            <div className="glass-card rounded-4xl p-8 md:p-12 shadow-glass mb-8 hover:shadow-glass-hover transition-all duration-500">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="p-3 bg-deep-purple/10 rounded-2xl">
                  <BookOpen className="h-8 w-8 text-deep-purple" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy">
                  Blog & <span className="text-forest bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">Insights</span>
                </h1>
              </div>
              <p className="text-xl text-charcoal/80 leading-relaxed max-w-4xl mx-auto mb-6">
                Exploring sustainable development, community empowerment, and social justice through research, 
                stories, and actionable insights from the field.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-charcoal/60">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{filteredPosts.length} Articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>{allTags.length} Topics</span>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-hover transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-charcoal/50" />
                  <Input
                    placeholder="Search articles, topics, or insights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 glass bg-white/70 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-2xl text-base font-medium placeholder:text-charcoal/50"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant={selectedTag === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag("")}
                    className={`rounded-2xl h-10 px-6 font-medium transition-all duration-300 hover-lift ${
                      selectedTag === "" 
                        ? "bg-forest hover:bg-forest/90 text-white shadow-glass" 
                        : "glass-button border-forest/30 text-forest hover:bg-forest/10 hover:border-forest/50"
                    }`}
                  >
                    All Topics
                  </Button>
                  {allTags.slice(0, 4).map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                      className={`capitalize rounded-2xl h-10 px-5 font-medium transition-all duration-300 hover-lift ${
                        selectedTag === tag 
                          ? "bg-coral hover:bg-coral/90 text-white shadow-glass" 
                          : "glass-button border-coral/30 text-coral hover:bg-coral/10 hover:border-coral/50"
                      }`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="glass-card h-96 rounded-4xl"></div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card h-80 rounded-4xl"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass-card rounded-4xl p-12 shadow-glass hover:shadow-glass-hover transition-all duration-300">
                <div className="p-4 bg-charcoal/5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-charcoal/40" />
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-4">No Articles Found</h3>
                <p className="text-charcoal/70 mb-8 text-lg leading-relaxed">
                  {searchTerm || selectedTag 
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "New articles are being crafted. Check back soon for fresh insights and stories!"}
                </p>
                {(searchTerm || selectedTag) && (
                  <Button 
                    onClick={() => { setSearchTerm(""); setSelectedTag(""); }}
                    className="bg-forest hover:bg-forest/90 text-white rounded-2xl h-12 px-8 font-medium shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-16">
              {/* Enhanced Featured Article */}
              {featuredPost && (
                <div className="group glass-card rounded-4xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-500 hover-lift">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {featuredPost.image_url && (
                      <div className="relative h-72 lg:h-auto overflow-hidden">
                        <img 
                          src={featuredPost.image_url} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-6 left-6">
                          <Badge className="glass-muted bg-deep-purple/20 backdrop-blur-sm text-deep-purple border-deep-purple/30 rounded-full px-4 py-2 font-medium">
                            Featured Story
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-3 mb-6">
                        {featuredPost.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-sage/40 text-sage bg-sage/10 rounded-full px-3 py-1 font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight group-hover:text-forest transition-colors duration-300">
                        {featuredPost.title}
                      </h2>
                      
                      {featuredPost.excerpt && (
                        <p className="text-lg text-charcoal/80 mb-8 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-charcoal/60">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{new Date(featuredPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          {featuredPost.reading_time && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">{featuredPost.reading_time} min read</span>
                            </div>
                          )}
                        </div>
                        
                        <Button className="bg-earth-brown hover:bg-earth-brown/90 text-white rounded-2xl h-12 px-8 font-medium shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift group/btn" asChild>
                          <Link to={`/blog/${featuredPost.slug}`}>
                            Read Full Article
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Articles Grid */}
              {otherPosts.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-navy mb-4">More Articles & Insights</h3>
                    <p className="text-charcoal/70 text-lg">Discover more stories and research from our work</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {otherPosts.map((post, index) => (
                     <Card key={post.id} className="group glass-card hover:shadow-glass-hover transition-all duration-500 hover-lift animate-fade-in-up rounded-4xl overflow-hidden border-0" 
                           style={{ animationDelay: `${index * 0.1}s` }}>
                        <Link to={`/blog/${post.slug}`} className="block">
                          <CardContent className="p-0">
                          {post.image_url && (
                            <div className="relative h-52 overflow-hidden">
                              <img 
                                src={post.image_url} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                          )}
                          
                          <div className="p-6">
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-sage/30 text-sage bg-sage/10 rounded-full px-3 py-1">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <h3 className="font-bold text-xl mb-4 line-clamp-2 text-navy leading-tight group-hover:text-forest transition-colors duration-300">
                              {post.title}
                            </h3>
                            
                            {post.excerpt && (
                              <p className="text-charcoal/70 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-charcoal/60">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                {post.reading_time && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="font-medium">{post.reading_time}m</span>
                                  </div>
                                )}
                              </div>
                              
                              <Button variant="ghost" size="sm" className="p-3 hover:bg-forest/10 rounded-xl text-forest group-hover:bg-forest group-hover:text-white transition-all duration-300">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Blog;

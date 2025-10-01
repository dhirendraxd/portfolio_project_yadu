import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Target, Heart, Sparkles, ArrowRight, Star, Eye, Download, Filter, Calendar, ExternalLink, ChevronDown, Linkedin, Facebook, Youtube, Instagram, GraduationCap, BookText } from "lucide-react";
import { usePortfolioItems } from "@/hooks/useCmsData";
import SocialMediaPosts from "@/components/SocialMediaPosts";
import ParticleEffects from "@/components/ParticleEffects";
import SEOHead from "@/components/SEOHead";
import { createPersonStructuredData, createWebsiteStructuredData, createBreadcrumbStructuredData } from "@/utils/structuredData";
import { useState } from "react";

const Index = () => {
  const { data: portfolioItems, isLoading } = usePortfolioItems();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Portfolio filtering
  const categories = portfolioItems ? ["all", ...new Set(portfolioItems.map(item => item.category))] : ["all"];
  
  const filteredItems = portfolioItems?.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  ) || [];

  const skills = [
    "Community Engagement", "Research & Analysis", "Project Management",
    "Sustainable Development", "Data Collection", "Policy Analysis", 
    "Rural Economics", "Social Impact Assessment", "Leadership",
    "Environmental Advocacy", "Cross-cultural Communication"
  ];

  const languages = ["Hindi (Native)", "English (Fluent)", "Nepali (Conversational)"];

  const handleResumeView = () => {
    window.open('/resume.pdf', '_blank');
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Yadav_Singh_Dhami_Resume.pdf';
    link.click();
  };

  return (
    <>
      <SEOHead 
        title="Yadav Singh Dhami | Rural Development Researcher & Sustainability Expert"
        description="Yadav Singh Dhami is a rural development researcher driving sustainable change through evidence-based research and community engagement. Explore Yadav's portfolio, research projects, and insights on sustainable development in Nepal and beyond."
        keywords="Yadav Singh Dhami, Yadav, Singh Dhami, Yadav researcher, Yadav Singh sustainability, rural development researcher, sustainability expert, community engagement specialist, social impact researcher, environmental advocacy, rural economics expert, policy analysis, sustainable development, Nepal researcher, development studies"
        canonical="https://yadavsinghdhami.com"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            createPersonStructuredData(),
            createWebsiteStructuredData(),
            createBreadcrumbStructuredData([
              { name: "Home", url: "https://yadavsinghdhami.com" }
            ])
          ]
        }}
      />
    <div className="min-h-screen relative">
      {/* Particle Effects */}
      <ParticleEffects />
      
      {/* Mixed gradient background overlay */}
      <div className="fixed inset-0 gradient-mixed opacity-25 pointer-events-none z-0"></div>

      {/* Hero Section - Redesigned with centered layout */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating elements with your color scheme */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-forest/10 rounded-full blur-2xl animate-gentle-float"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-coral/15 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-sage/8 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-earth-brown/12 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '6s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in-up">
              {/* Professional Badge */}
              <div className="inline-flex items-center space-x-2 glass-card rounded-full px-6 py-3 mb-8 hover-lift border border-glass-border">
                <Sparkles className="h-4 w-4 text-sunlight-yellow" />
                <span className="text-sm font-medium text-forest">Community Impact Researcher</span>
              </div>
              
              {/* Name with enhanced styling - Using H1 for SEO */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal mb-12 tracking-tight">
                Yadav Singh Dhami
              </h1>
              
              {/* Enhanced subtitle */}
              <p className="text-xl md:text-2xl text-charcoal/80 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Driving sustainable change through evidence-based research and community engagement in rural development initiatives.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => document.getElementById('work-section')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" 
                className="group bg-forest hover:bg-forest/90 text-white rounded-2xl px-8 py-4 text-base font-semibold shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift border border-glass-border"
              >
                <span>Explore My Research</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="group glass-button text-charcoal hover:bg-forest/10 hover:border-forest/30 rounded-2xl px-8 py-4 text-base font-semibold shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift"
              >
                <Link to="/blog" className="flex items-center space-x-2">
                  <span>Read Blog</span>
                  <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="animate-fade-in-up animation-delay-400 mb-12">
              <p className="text-sm text-charcoal/60 mb-6 font-medium">Connect with me</p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                {[
                  { icon: Linkedin, href: "#", label: "LinkedIn", color: "text-blue-600" },
                  { icon: GraduationCap, href: "#", label: "ORCID", color: "text-green-600" },
                  { icon: BookText, href: "#", label: "Google Scholar", color: "text-blue-500" },
                  { icon: Facebook, href: "#", label: "Facebook", color: "text-blue-700" },
                  { icon: Youtube, href: "#", label: "YouTube", color: "text-red-600" },
                  { icon: Instagram, href: "#", label: "Instagram", color: "text-pink-600" },
                  { icon: BookOpen, href: "/blog", label: "Blog", color: "text-forest" }
                ].map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="group glass-card w-12 h-12 rounded-2xl flex items-center justify-center hover-lift border border-glass-border hover:border-forest/30 transition-all duration-300 hover:shadow-glass-hover"
                    title={social.label}
                  >
                    <social.icon className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform duration-300`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Arrow Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="animate-bounce cursor-pointer group" 
            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover-lift border border-glass-border group-hover:border-forest/30 transition-all duration-300">
              <ChevronDown className="h-5 w-5 text-forest group-hover:text-forest/80 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Semantic HTML5 */}
      <section id="about-section" className="py-24 lg:py-32 relative" aria-labelledby="about-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Content */}
              <article className="space-y-10">
                <div className="animate-fade-in-up">
                  <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-8 text-balance leading-tight">
                    Building bridges between 
                    <span className="text-forest"> communities</span> and 
                    <span className="text-sage"> sustainable development</span>
                  </h2>
                  
                  <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed">
                    <p className="text-xl">
                      My journey in rural development research has taken me deep into communities 
                      where real change happens. I believe that sustainable development isn't just 
                      about policies and programs—it's about understanding people, their stories, 
                      and their dreams.
                    </p>
                    
                    <p className="text-lg">
                      Through extensive fieldwork and academic research, I work to bridge the gap 
                      between grassroots realities and sustainable solutions that create lasting 
                      positive impact for marginalized communities.
                    </p>
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-300 flex flex-wrap gap-3">
                  {[
                    { name: "Rural Development", color: "forest" },
                    { name: "Community Research", color: "coral" },
                    { name: "Social Impact", color: "sage" },
                    { name: "Sustainability", color: "earth" }
                  ].map((tag, index) => (
                    <Badge 
                      key={tag.name}
                      className={`px-6 py-3 text-sm font-medium glass-card text-${tag.color} hover:bg-${tag.color}/10 transition-all duration-300 hover-lift rounded-full border-${tag.color}/20`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </article>

              {/* Feature Card */}
              <div className="animate-fade-in-up animation-delay-300">
                <Card className="glass-card shadow-glass border-glass-border overflow-hidden rounded-4xl hover-lift">
                  <CardContent className="p-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-forest to-sage flex items-center justify-center shadow-glass">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-6">
                      Community-Centered Approach
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed text-lg">
                      Every project begins with listening. Understanding the unique challenges, 
                      strengths, and aspirations of each community guides my research and 
                      advocacy work.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section - Semantic HTML5 */}
      <section id="work-section" className="py-24 lg:py-32 relative" aria-labelledby="work-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Work Hero */}
            <header className="text-center mb-16">
              <div className="animate-fade-in-up">
                <h2 id="work-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-8 text-balance leading-tight">
                  My Professional <span className="text-forest bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">Journey</span>
                </h2>
                <p className="text-xl text-charcoal/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Explore my skills, experience, and portfolio of community-driven projects focused on sustainable development and social impact.
                </p>
              </div>
            </header>

            {/* Work Content with Tabs */}
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 glass-card p-1 max-w-md mx-auto rounded-2xl">
                <TabsTrigger value="skills" className="text-sm md:text-base px-3 py-2 rounded-xl">Skills</TabsTrigger>
                <TabsTrigger value="resume" className="text-sm md:text-base px-3 py-2 rounded-xl">Resume</TabsTrigger>
                <TabsTrigger value="projects" className="text-sm md:text-base px-3 py-2 rounded-xl">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="glass-card hover:shadow-glass-hover transition-all duration-300 hover-lift rounded-4xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Star className="h-6 w-6 text-coral mr-3" />
                        <h3 className="text-xl font-semibold text-charcoal">Core Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 text-sm animate-fade-in-up glass-muted text-forest border-forest/20 hover:bg-forest/10 transition-colors hover-lift rounded-full"
                                 style={{ animationDelay: `${index * 0.05}s` }}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card hover:shadow-glass-hover transition-all duration-300 hover-lift rounded-4xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Users className="h-6 w-6 text-coral mr-3" />
                        <h3 className="text-xl font-semibold text-charcoal">Languages</h3>
                      </div>
                      <div className="space-y-3">
                        {languages.map((language, index) => (
                          <div key={index} className="flex items-center space-x-3 animate-fade-in-up"
                               style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="w-2 h-2 rounded-full bg-forest"></div>
                            <span className="text-charcoal/80">{language}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resume" className="space-y-8">
                <Card className="glass-card shadow-glass border-glass-border rounded-4xl">
                  <CardContent className="p-8 md:p-12 text-center">
                    <div className="flex items-center justify-center mb-6">
                      <BookOpen className="h-8 w-8 text-forest mr-3" />
                      <h3 className="text-3xl font-semibold text-charcoal">Resume & CV</h3>
                    </div>
                    <p className="text-charcoal/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                      Download or view my comprehensive resume detailing my experience, education, and achievements in rural development and community engagement.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <Button 
                        onClick={handleResumeView}
                        className="flex items-center justify-center space-x-2 bg-forest hover:bg-forest/90 text-white rounded-2xl px-6 py-3 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift"
                      >
                        <Eye className="h-5 w-5" />
                        <span>View Resume</span>
                      </Button>
                      
                      <Button 
                        onClick={handleResumeDownload}
                        variant="outline"
                        className="flex items-center justify-center space-x-2 bg-earth-brown hover:bg-earth-brown/90 border-earth-brown text-white hover:text-white rounded-2xl px-6 py-3 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover-lift"
                      >
                        <Download className="h-5 w-5" />
                        <span>Download Resume</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-8">
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-charcoal/70 glass-muted rounded-xl"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter:</span>
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`capitalize rounded-2xl transition-all duration-300 hover-lift ${
                        selectedCategory === category 
                          ? "bg-forest text-white shadow-glass" 
                          : "glass-button text-forest hover:bg-forest/10"
                      }`}
                    >
                      {category === "all" ? "All Projects" : category}
                    </Button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="glass-card animate-pulse rounded-4xl">
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="h-3 bg-muted rounded w-full mb-2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                     <Card key={item.id} className="glass-card group animate-fade-in-up hover:shadow-glass-hover transition-all duration-500 hover-lift rounded-4xl" 
                           style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="p-6">
                          {item.image_url && (
                            <div className="mb-4 rounded-2xl overflow-hidden">
                              <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="text-xs glass-muted text-earth border-earth/30 rounded-full">
                              {item.category}
                            </Badge>
                            {item.featured && (
                              <Star className="h-4 w-4 text-sunlight-yellow" />
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-charcoal">{item.title}</h3>
                          
                          {item.description && (
                            <p className="text-charcoal/70 text-sm mb-3 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          
                          {item.impact && (
                            <div className="glass-muted rounded-2xl p-3 mb-4 border border-glass-border">
                              <div className="flex items-center space-x-2 mb-1">
                                <Heart className="h-4 w-4 text-coral" />
                                <span className="text-sm font-medium text-charcoal">Impact</span>
                              </div>
                              <p className="text-xs text-charcoal/60 leading-relaxed">{item.impact}</p>
                            </div>
                          )}
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs border-forest/30 text-forest rounded-full">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-forest/30 text-forest rounded-full">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-charcoal/60">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(item.created_at).getFullYear()}</span>
                            </div>
                            
                            {item.link_url && (
                              <Button variant="ghost" size="sm" asChild className="p-2 hover:bg-forest/10 rounded-xl">
                                <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 text-forest" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {filteredItems.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-charcoal/60">No projects found in this category.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Social Media Posts Section */}
      <SocialMediaPosts />
      </div>
    </>
  );
};

export default Index;

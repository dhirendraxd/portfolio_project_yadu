
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkHero from "@/components/work/WorkHero";
import WorkSkills from "@/components/work/WorkSkills";
import WorkResume from "@/components/work/WorkResume";
import WorkProjects from "@/components/work/WorkProjects";
import SEOHead from "@/components/SEOHead";
import { createPersonStructuredData, createBreadcrumbStructuredData } from "@/utils/structuredData";
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from "@/utils/seoConstants";

const Work = () => {
  return (
    <>
      <SEOHead 
        title={PAGE_TITLES.work}
        description={PAGE_DESCRIPTIONS.work}
        keywords={`${SITE_CONFIG.keywords.join(', ')}, resume, portfolio, professional experience, community engagement projects, social impact work`}
        canonical="https://yadavsinghdhami.com/work"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            createPersonStructuredData(),
            createBreadcrumbStructuredData([
              { name: "Home", url: "https://yadavsinghdhami.com" },
              { name: "Work & Portfolio", url: "https://yadavsinghdhami.com/work" }
            ])
          ]
        }}
      />
      <div className="min-h-screen bg-background text-foreground">
      <WorkHero />

      {/* Main Content with Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 glass-card p-1">
                <TabsTrigger value="skills" className="text-sm md:text-base px-3 py-2">Skills</TabsTrigger>
                <TabsTrigger value="resume" className="text-sm md:text-base px-3 py-2">Resume</TabsTrigger>
                <TabsTrigger value="projects" className="text-sm md:text-base px-3 py-2">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-8">
                <WorkSkills />
              </TabsContent>

              <TabsContent value="resume" className="space-y-8">
                <WorkResume />
              </TabsContent>

              <TabsContent value="projects" className="space-y-8">
                <WorkProjects />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Work;

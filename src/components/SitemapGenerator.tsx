// Sitemap generator component for SEO
// This creates a dynamic sitemap based on available content

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (
  portfolioItems?: Array<{ id: string; updated_at: string }>,
  blogPosts?: Array<{ id: string; slug: string; updated_at: string; published: boolean }>
): SitemapUrl[] => {
  const baseUrl = 'https://yadavsinghdhami.com';
  const today = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: today,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/work`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: today,
      changefreq: 'weekly', 
      priority: 0.9
    }
  ];

  // Add portfolio items
  if (portfolioItems) {
    portfolioItems.forEach(item => {
      urls.push({
        loc: `${baseUrl}/portfolio/${item.id}`,
        lastmod: new Date(item.updated_at).toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      });
    });
  }

  // Add published blog posts
  if (blogPosts) {
    blogPosts.filter(post => post.published).forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.updated_at).toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  }

  return urls;
};

export const createXMLSitemap = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const xmlFooter = '</urlset>';
  
  const urlsXML = urls.map(url => {
    return `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('');

  return xmlHeader + urlsXML + '\n' + xmlFooter;
};

// React component for rendering sitemap links (for HTML version)
export const SitemapComponent = ({ urls }: { urls: SitemapUrl[] }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-charcoal">Site Map</h1>
      <div className="space-y-4">
        {urls.map((url, index) => (
          <div key={index} className="border-b border-muted pb-4">
            <a 
              href={url.loc} 
              className="text-forest hover:text-forest/80 transition-colors text-lg font-medium"
            >
              {url.loc}
            </a>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              {url.lastmod && <span>Last Modified: {url.lastmod}</span>}
              {url.changefreq && <span>Update Frequency: {url.changefreq}</span>}
              {url.priority && <span>Priority: {url.priority}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SitemapComponent;
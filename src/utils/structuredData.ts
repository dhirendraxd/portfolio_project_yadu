// Structured Data (Schema.org JSON-LD) for better SEO

export const createPersonStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Yadav Singh Dhami",
  "alternateName": ["Yadav", "Singh Dhami", "Yadav Singh"],
  "jobTitle": "Rural Development Researcher & Sustainability Expert",
  "description": "Yadav Singh Dhami is a rural development researcher driving sustainable change through community engagement and evidence-based research. Expert in sustainability, social impact, and rural economics.",
  "url": "https://yadavsinghdhami.com",
  "image": "https://yadavsinghdhami.com/profile-image.jpg",
  "sameAs": [
    "https://linkedin.com/in/yadavsinghdhami",
    "https://orcid.org/0000-0000-0000-0000",
    "https://scholar.google.com/citations?user=example"
  ],
  "knowsAbout": [
    "Rural Development",
    "Sustainability Research",
    "Community Engagement", 
    "Social Impact Assessment",
    "Environmental Advocacy",
    "Policy Analysis",
    "Rural Economics",
    "Sustainable Development",
    "Development Studies",
    "Community Research"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Rural Development Researcher",
    "description": "Specializing in sustainable development and community engagement"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "University Name"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Nepal"
  },
  "award": "Rural Development Excellence",
  "nationality": "Nepalese"
});

export const createWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Website",
  "name": "Yadav Singh Dhami",
  "description": "Personal website of Yadav Singh Dhami - Rural development researcher focused on sustainability and community impact",
  "url": "https://yadavsinghdhami.com",
  "author": {
    "@type": "Person",
    "name": "Yadav Singh Dhami"
  },
  "publisher": {
    "@type": "Person", 
    "name": "Yadav Singh Dhami"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yadavsinghdhami.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const createBlogStructuredData = (
  title: string, 
  excerpt: string, 
  publishedDate: string, 
  imageUrl?: string,
  tags?: string[]
) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": excerpt,
  "author": {
    "@type": "Person",
    "name": "Yadav Singh Dhami",
    "url": "https://yadavsinghdhami.com"
  },
  "publisher": {
    "@type": "Person",
    "name": "Yadav Singh Dhami"
  },
  "datePublished": publishedDate,
  "dateModified": publishedDate,
  "image": imageUrl || "https://yadavsinghdhami.com/og-image.jpg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": window.location.href
  },
  "keywords": tags?.join(', ') || "rural development, sustainability, research",
  "articleSection": "Research & Development"
});

export const createPortfolioStructuredData = (
  title: string,
  description: string,
  category: string,
  imageUrl?: string,
  tags?: string[]
) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": title,
  "description": description,
  "author": {
    "@type": "Person", 
    "name": "Yadav Singh Dhami"
  },
  "creator": {
    "@type": "Person",
    "name": "Yadav Singh Dhami"
  },
  "image": imageUrl,
  "genre": category,
  "keywords": tags?.join(', ') || "rural development, sustainability",
  "inLanguage": "en-US",
  "copyrightHolder": {
    "@type": "Person",
    "name": "Yadav Singh Dhami"
  }
});

export const createBreadcrumbStructuredData = (breadcrumbs: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
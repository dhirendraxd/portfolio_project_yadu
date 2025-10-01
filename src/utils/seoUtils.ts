// SEO utility functions for dynamic content optimization
import { SITE_CONFIG } from "./seoConstants";
import { NAME_VARIATIONS, PROFESSIONAL_TITLES } from "./nameVariations";

/**
 * Generate keyword-rich title with name variations
 */
export const generateSEOTitle = (baseTitle: string, includeNameVariations = true): string => {
  if (!includeNameVariations) return baseTitle;
  
  // Ensure the main name is prominent in titles
  if (!baseTitle.includes("Yadav Singh Dhami")) {
    return `Yadav Singh Dhami - ${baseTitle}`;
  }
  
  return baseTitle;
};

/**
 * Generate keyword-rich meta description
 */
export const generateSEODescription = (baseDescription: string, includeNameVariations = true): string => {
  if (!includeNameVariations) return baseDescription;
  
  // Ensure the description mentions the name naturally
  if (!baseDescription.toLowerCase().includes("yadav")) {
    return baseDescription.replace(/^(\w)/, `Yadav Singh Dhami is a $1`);
  }
  
  return baseDescription;
};

/**
 * Generate comprehensive keywords array
 */
export const generateSEOKeywords = (additionalKeywords: string[] = []): string => {
  const allKeywords = [
    ...SITE_CONFIG.keywords,
    ...additionalKeywords,
    ...NAME_VARIATIONS.slice(0, 5), // First 5 name variations
    ...PROFESSIONAL_TITLES.slice(0, 3) // First 3 professional titles
  ];
  
  return [...new Set(allKeywords)].join(', ');
};

/**
 * Generate FAQ structured data for better SEO
 */
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Generate local business structured data (if applicable)
 */
export const generateLocalBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Yadav Singh Dhami - Rural Development Research",
  "description": "Professional rural development research and sustainability consulting services",
  "provider": {
    "@type": "Person",
    "name": "Yadav Singh Dhami"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Nepal"
  },
  "serviceType": [
    "Rural Development Research",
    "Sustainability Consulting", 
    "Community Engagement",
    "Social Impact Assessment"
  ]
});

/**
 * Generate breadcrumb navigation for better UX and SEO
 */
export const generateBreadcrumbNavigation = (currentPage: string, parentPages: Array<{ name: string; path: string }> = []) => {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...parentPages,
    { name: currentPage, path: "" }
  ];
  
  return breadcrumbs;
};
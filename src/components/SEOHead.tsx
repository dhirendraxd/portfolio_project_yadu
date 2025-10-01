import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  structuredData?: object;
}

export const SEOHead = ({ 
  title = "Yadav Singh Dhami - Rural Development Researcher & Sustainability Expert",
  description = "Rural development researcher driving sustainable change through community engagement and evidence-based research. Portfolio, insights & projects focused on social impact.",
  keywords = "rural development, sustainability, community engagement, social impact, research, environmental advocacy",
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  structuredData
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:type', ogType);
    updateOGTag('og:image', `${window.location.origin}${ogImage}`);
    updateOGTag('og:url', window.location.href);
    
    // Update Twitter tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', content);
    };
    
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
    updateTwitterTag('twitter:image', `${window.location.origin}${ogImage}`);
    
    // Add structured data if provided
    if (structuredData) {
      let structuredScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredScript) {
        structuredScript = document.createElement('script');
        structuredScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredScript);
      }
      structuredScript.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, keywords, canonical, ogImage, ogType, structuredData]);
  
  return null;
};

export default SEOHead;
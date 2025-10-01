// SEO optimization utilities for performance and search engine visibility

// Lazy loading intersection observer setup
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Critical CSS inlining helper
export const loadCriticalCSS = (cssString: string) => {
  const style = document.createElement('style');
  style.textContent = cssString;
  document.head.appendChild(style);
};

// Preload important resources
export const preloadResources = () => {
  const resources = [
    { href: '/og-image.jpg', as: 'image' },
    { href: '/favicon.ico', as: 'image' },
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
};

// Set up performance monitoring
export const setupPerformanceMonitoring = () => {
  // Core Web Vitals monitoring - simplified version
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      import('web-vitals').then((vitals) => {
        if (vitals.onCLS) vitals.onCLS(console.log);
        if (vitals.onFCP) vitals.onFCP(console.log);
        if (vitals.onLCP) vitals.onLCP(console.log);
        if (vitals.onTTFB) vitals.onTTFB(console.log);
      });
    } catch (error) {
      console.warn('Web vitals monitoring not available');
    }
  }
};

// Clean URL parameters for better SEO
export const cleanURL = (url: string): string => {
  const cleanedUrl = new URL(url);
  
  // Remove tracking parameters that don't affect content
  const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
  
  paramsToRemove.forEach(param => {
    cleanedUrl.searchParams.delete(param);
  });
  
  return cleanedUrl.toString();
};

// Generate breadcrumb navigation for better UX and SEO
export const generateBreadcrumbs = (pathname: string): Array<{name: string, path: string}> => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', path: '/' }];
  
  const pathMap: Record<string, string> = {
    'work': 'Work & Portfolio',
    'blog': 'Blog & Insights',
    'admin': 'Admin Dashboard'
  };
  
  let currentPath = '';
  paths.forEach(path => {
    currentPath += `/${path}`;
    breadcrumbs.push({
      name: pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1),
      path: currentPath
    });
  });
  
  return breadcrumbs;
};

// SEO-friendly URL slug generation
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Image optimization helper
export const getOptimizedImageSrc = (
  src: string, 
  width: number, 
  height?: number, 
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string => {
  // This would integrate with an image optimization service in production
  // For now, return the original source with size hints
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('f', format);
  
  return `${src}?${params.toString()}`;
};

// Schema.org structured data injection
export const injectStructuredData = (data: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
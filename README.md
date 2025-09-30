# Yadav Singh Dhami — Portfolio (Rural Development Researcher & Sustainability Expert)

About this project
-------------------

Yadav Singh Dhami's portfolio is a modern, SEO-first personal website that highlights research, projects, and writing on rural development and sustainability. The site is built with a lightweight CMS integration and structured data to improve discoverability for keywords like "rural development", "sustainability", "community engagement" and "social impact research".

Why this project matters
------------------------

- Showcases evidence-based research and community-led projects in rural development.
- Uses structured data (JSON-LD), Open Graph and Twitter metadata to improve search and social sharing.
- Focused on accessibility, performance, and readable content to reach practitioners, policymakers, and researchers.

Standout features
-----------------

- Curated portfolio and project pages with category filtering and impact highlights
- Research-focused blog with SEO-friendly metadata and article structured data
- CMS-backed content (blog posts, portfolio items, testimonials, impact stats) for easy publishing
- Minimal admin editor for quick content updates (replace with full auth in production)
- Carefully crafted meta tags, canonical URLs and OG images for improved indexing and shares

Technology & integrations
------------------------

- React + TypeScript with Vite for fast, modern web development
- Tailwind CSS for design system and responsive layouts
- Supabase as a headless CMS for posts and portfolio data
- React Query for client-side caching and data fetching
- Rich SEO helpers (custom `SEOHead` component and structured data utilities)

SEO & discoverability highlights
-------------------------------

This project is optimized for discoverability:

- Canonical URL and robust meta descriptions are included in `index.html` and per-page via `SEOHead`.
- Open Graph and Twitter cards are provided to generate rich link previews on social platforms.
- JSON-LD structured data for Person, Website and Blog elements help search engines understand the content.
- Sitemap generation is available via the `components/SitemapGenerator.tsx` (consider publishing a sitemap to Search Console).

Security & production notes
--------------------------

- The repo currently includes a Supabase client file for demo purposes. Replace any hard-coded keys with environment-driven configuration when publishing.
- The Admin panel provided is intended as a lightweight editor and should be secured with production-grade authentication.

How to share this project
-------------------------

Here are quick ideas to promote the project (great for Twitter/LinkedIn/Research networks):

- Share a short thread highlighting 1–2 case studies or impact stats from the portfolio.
- Post an article summary (with a link to a blog post) and include relevant hashtags: #ruraldevelopment #sustainability #socialimpact
- Add the site to academic profiles (ORCID, Google Scholar) and link back to case studies.
- Submit the sitemap to Google Search Console and Bing Webmaster Tools to accelerate indexing.

Callouts for maintainers
-----------------------

- Ensure the canonical URL in `index.html` matches your production domain.
- Keep OG image sizes at 1200x630 for best social preview results.
- Consider publishing a regular blog schedule (4–8 posts/year) to build organic visibility.

Contact & credits
-----------------

Project author: Yadav (update with preferred name and contact links).

Design & code: Modern React + Tailwind patterns with accessibility and SEO in mind.

License
-------

Add a LICENSE (MIT recommended) to make the project easier for others to reuse.

Generated on: 2025-09-30


// Name variations and related keywords for SEO optimization
export const NAME_VARIATIONS = [
  "Yadav Singh Dhami",
  "Yadav",
  "Singh Dhami", 
  "Yadav Singh",
  "Mr. Yadav Singh Dhami",
  "Dr. Yadav Singh Dhami",
  "Researcher Yadav Singh Dhami",
  "Yadav S. Dhami",
  "Y. S. Dhami",
  "Yadav researcher",
  "Yadav Singh sustainability expert",
  "Yadav rural development"
];

export const PROFESSIONAL_TITLES = [
  "Rural Development Researcher",
  "Sustainability Expert", 
  "Community Engagement Specialist",
  "Social Impact Researcher",
  "Environmental Advocate",
  "Policy Analyst",
  "Development Studies Expert",
  "Rural Economics Specialist",
  "Community Research Expert",
  "Sustainable Development Practitioner"
];

export const LOCATION_KEYWORDS = [
  "Nepal researcher",
  "Nepalese development expert",
  "South Asian rural development",
  "Himalayan region researcher",
  "Nepal sustainability expert"
];

// Function to generate keyword-rich content
export const generateKeywordRichText = (baseText: string, includeVariations = true): string => {
  if (!includeVariations) return baseText;
  
  // Add natural keyword variations to content
  return baseText.replace(/rural development researcher/gi, "rural development researcher Yadav Singh Dhami");
};

// SEO-optimized anchor text variations
export const ANCHOR_TEXT_VARIATIONS = [
  "Yadav Singh Dhami",
  "researcher Yadav Singh Dhami", 
  "sustainability expert Yadav",
  "Yadav's research",
  "Yadav Singh's work",
  "development researcher Yadav Singh Dhami"
];
// Centralized job categories list
// Update this list to add/remove categories. You can also fetch from backend later.
const JOB_CATEGORIES = [
  // Development & IT
  { value: 'development', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'fullstack', label: 'Full-Stack Development' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'database', label: 'Database Administration' },
  { value: 'qa', label: 'QA & Testing' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'ai-ml', label: 'AI / Machine Learning' },
  { value: 'data-science', label: 'Data Science & Analytics' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'game-dev', label: 'Game Development' },
  { value: 'embedded', label: 'Embedded / IoT' },

  // Design & Creative
  { value: 'design', label: 'Design (UI/UX, Graphic)' },
  { value: 'video', label: 'Video Production & Animation' },
  { value: 'audio', label: 'Audio Production & Voiceover' },
  { value: 'illustration', label: 'Illustration' },

  // Writing & Translation
  { value: 'writing', label: 'Writing & Editing' },
  { value: 'translation', label: 'Translation & Localization' },
  { value: 'content', label: 'Content Strategy & Copywriting' },

  // Sales, Marketing & Support
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'seo', label: 'SEO & ASO' },
  { value: 'social', label: 'Social Media Management' },
  { value: 'sales', label: 'Sales & Business Development' },
  { value: 'support', label: 'Customer Support' },

  // Management & Operations
  { value: 'pm', label: 'Project / Product Management' },
  { value: 'hr', label: 'HR & Recruiting' },
  { value: 'admin', label: 'Admin & Virtual Assistance' },

  // Finance & Legal
  { value: 'finance', label: 'Finance & Accounting' },
  { value: 'legal', label: 'Legal' },

  // Other
  { value: 'education', label: 'Education & Tutoring' },
  { value: 'healthcare-it', label: 'Healthcare IT' },
  { value: 'research', label: 'Research & Surveys' },
];

export default JOB_CATEGORIES;

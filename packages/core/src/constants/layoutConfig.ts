import { LayoutType, ResumeField } from '../types';

export const LAYOUT_CONFIG: Record<
  LayoutType,
  {
    left?: Array<ResumeField>;
    right?: Array<ResumeField>;
  }
> = {
  // Traditional Sidebar layout
  classic: {
    left: [
      ResumeField.ABOUT_ME,
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.CERTIFICATIONS,
      ResumeField.EDUCATION,
    ],
    right: [
      ResumeField.KEY_IMPACT,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
    ],
  },

  // Single column, modern stacked layout
  modern: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.CERTIFICATIONS,
      ResumeField.EDUCATION,
    ],
  },

  // Centered, lightweight single column
  minimalist: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.SKILLS,
      ResumeField.CERTIFICATIONS,
      ResumeField.EDUCATION,
    ],
  },

  // Formal swap: Main Content left, Sidebar right
  executive: {
    left: [ResumeField.ABOUT_ME, ResumeField.EXPERIENCE, ResumeField.PROJECTS],
    right: [
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.CERTIFICATIONS,
      ResumeField.EDUCATION,
      ResumeField.KEY_IMPACT,
    ],
  },

  // High-impact: Skills Grid top, Experience full-width bottom
  creative: {
    left: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.TOOLS,
      ResumeField.SKILLS,
      ResumeField.CERTIFICATIONS,
    ],
    right: [
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.EDUCATION,
    ],
  },
};

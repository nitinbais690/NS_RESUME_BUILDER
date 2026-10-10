import { LayoutType, ResumeField } from '../../types';

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
      ResumeField.LANGUAGES,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.EDUCATION,
    ],
    right: [
      ResumeField.KEY_IMPACT,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
    ],
  },

  // Single column, modern stacked layout
  modern: {
    left: [], // SCSS [data-layout='modern'] forces column-direction
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.EDUCATION,
      ResumeField.LANGUAGES,
    ],
  },

  // Centered, lightweight single column
  minimalist: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
      ResumeField.SKILLS,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.EDUCATION,
      ResumeField.LANGUAGES,
    ],
  },

  // Formal swap: Main Content left, Sidebar right
  executive: {
    left: [
      ResumeField.ABOUT_ME,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
    ],
    right: [
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.LANGUAGES,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
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
      ResumeField.LANGUAGES,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
    ],
    right: [
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
      ResumeField.EDUCATION,
    ],
  },

  // ATS-safe: one column, standard section order, no sidebars or graphics so
  // applicant tracking systems parse it in reading order.
  ats: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.EDUCATION,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.LANGUAGES,
    ],
  },
};

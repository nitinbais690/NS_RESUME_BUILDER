import { LayoutType, ResumeField } from '../../types';

export type EntryStyle = 'inline' | 'stacked' | 'org-first';

export interface LayoutConfig {
  left?: Array<ResumeField>;
  right?: Array<ResumeField>;
  /** Section headings to use instead of the field names (ATS-standard wording). */
  titles?: Partial<Record<ResumeField, string>>;
  /** Render Skills + Tools as one "Technical Skills" block of labelled rows. */
  inlineSkills?: boolean;
  /**
   * How ATS-first layouts lay out an entry's title, company, link and date
   * (plain text in that reading order, bullets as a real list):
   *  - inline:    "Title — Company | link ............ Date"
   *  - stacked:   "Title" then "Company — link — Date"
   *  - org-first: "**Company**" then "*Title* ........ Date" (Harvard)
   * Unset keeps the designed layouts' timeline look.
   */
  entryStyle?: EntryStyle;
  /** "split": name and profile links left, labelled email/phone right. */
  headerStyle?: 'split';
  /**
   * Contact details render as a labelled section in a column (place
   * ResumeField.CONTACT there) instead of in the header next to the name.
   */
  contactInColumn?: boolean;
}

/** Headings ATS parsers (Workday especially) recognise reliably. */
const ATS_TITLES: Partial<Record<ResumeField, string>> = {
  [ResumeField.ABOUT_ME]: 'Summary',
  [ResumeField.KEY_IMPACT]: 'Key Achievements',
  [ResumeField.EXPERIENCE]: 'Work Experience',
};

export const LAYOUT_CONFIG: Record<LayoutType, LayoutConfig> = {
  // Densest one-pager: summary and wins up top, skills as inline rows, then
  // experience. Small type, tight rules, left-aligned header.
  compact: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.SKILLS,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.EDUCATION,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.LANGUAGES,
      ResumeField.VOLUNTEERING,
    ],
    titles: ATS_TITLES,
    inlineSkills: true,
    entryStyle: 'inline',
  },

  // After Jake's Resume: centered small-caps name, small-caps headings over a
  // full-width rule, title/dates then italic company on each entry.
  tech: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.SKILLS,
      ResumeField.EDUCATION,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.LANGUAGES,
      ResumeField.VOLUNTEERING,
    ],
    titles: { ...ATS_TITLES, [ResumeField.EXPERIENCE]: 'Experience' },
    inlineSkills: true,
    entryStyle: 'inline',
  },

  // University career-office style: qualifications, education and skills up
  // front; each job reads "**Organization**" then "*Title* ...... Date".
  harvard: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.EDUCATION,
      ResumeField.SKILLS,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.LANGUAGES,
    ],
    titles: {
      ...ATS_TITLES,
      [ResumeField.KEY_IMPACT]: 'Summary of Qualifications',
      [ResumeField.SKILLS]: 'Technical Skills',
      [ResumeField.EXPERIENCE]: 'Relevant Experience',
      [ResumeField.PROJECTS]: 'Project Experience',
      [ResumeField.VOLUNTEERING]: 'Additional Experience',
    },
    inlineSkills: true,
    entryStyle: 'org-first',
  },

  // Split header (name + profile links left, labelled email/phone right),
  // centered caps headings between rules, "TITLE | COMPANY ..... Date".
  professional: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.EDUCATION,
      ResumeField.SKILLS,
      ResumeField.KEY_IMPACT,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.VOLUNTEERING,
      ResumeField.LANGUAGES,
    ],
    titles: {
      ...ATS_TITLES,
      [ResumeField.SKILLS]: 'Skills Summary',
      [ResumeField.CERTIFICATIONS]: 'Certificates',
    },
    inlineSkills: true,
    entryStyle: 'inline',
    headerStyle: 'split',
  },

  // Centered serif with a double rule, headings set between two lines,
  // "Title" over "Company — Date", skills as a grid.
  elegant: {
    left: [],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.EDUCATION,
      ResumeField.SKILLS,
      ResumeField.TOOLS,
      ResumeField.LANGUAGES,
      ResumeField.CERTIFICATIONS,
      ResumeField.AWARDS,
      ResumeField.VOLUNTEERING,
    ],
    titles: { ...ATS_TITLES, [ResumeField.EXPERIENCE]: 'Experience', [ResumeField.CERTIFICATIONS]: 'Certificates' },
    entryStyle: 'stacked',
  },

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

  // Two columns for people who want a sidebar: contact and credentials left;
  // summary, skills and experience right. Left comes first in the DOM, so
  // parsers read it as one block before the main column.
  sidebar: {
    left: [
      ResumeField.CONTACT,
      ResumeField.EDUCATION,
      ResumeField.CERTIFICATIONS,
      ResumeField.LANGUAGES,
      ResumeField.AWARDS,
    ],
    right: [
      ResumeField.ABOUT_ME,
      ResumeField.KEY_IMPACT,
      ResumeField.SKILLS,
      ResumeField.EXPERIENCE,
      ResumeField.PROJECTS,
      ResumeField.VOLUNTEERING,
    ],
    titles: ATS_TITLES,
    inlineSkills: true,
    entryStyle: 'inline',
    contactInColumn: true,
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
    titles: { [ResumeField.ABOUT_ME]: 'Summary' },
    entryStyle: 'inline',
  },
};

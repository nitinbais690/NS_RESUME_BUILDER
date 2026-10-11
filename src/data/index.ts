import { ResumeData, ResumeField, ContactInfo } from '../types';

/**
 * Starter resume: a full, realistic one-pager written the way ATS keyword
 * matching rewards — standard titles, quantified action-verb bullets, and the
 * skill names spelled out where they were used. Fits one page in Compact.
 */
const dummyResumeData: ResumeData = {
  [ResumeField.CONTACT]: {
    [ContactInfo.NAME]: 'Alex Johnson',
    [ContactInfo.POSITION]: 'Senior Software Engineer, Mobile',
    [ContactInfo.PHONE]: '+1 555 123 4567',
    [ContactInfo.EMAIL]: 'alex.johnson@example.com',
    [ContactInfo.LINKEDIN]: 'linkedin.com/in/alexjohnson',
    [ContactInfo.GITHUB]: 'github.com/alexjohnson',
    [ContactInfo.LOCATION]: 'New York, NY',
  },

  [ResumeField.ABOUT_ME]:
    'Senior Software Engineer with 7+ years building React Native and TypeScript mobile apps used by 5M+ customers. ' +
    'Led the architecture of a modular Super App, cut release cycles from 4 weeks to 1, and kept crash-free sessions above 99.9%. ' +
    'Strong in system design, performance tuning, CI/CD and mentoring cross-functional teams.',

  [ResumeField.KEY_IMPACT]: [
    'Grew mobile checkout conversion 18% (+$4.2M annual revenue) by rebuilding the payment flow',
    'Reduced app cold-start time 42% (3.1s → 1.8s) with Hermes, lazy modules and JSI bindings',
    'Cut feature delivery time 30% by launching a shared design system adopted by 6 product teams',
    'Mentored 9 engineers; 4 were promoted to senior roles within 18 months',
  ],

  [ResumeField.SKILLS]: [
    'React Native',
    'TypeScript',
    'JavaScript (ES2023)',
    'React',
    'Swift',
    'Kotlin',
    'Node.js',
    'GraphQL',
    'REST APIs',
    'System Design',
    'Performance Optimization',
    'Accessibility (WCAG 2.2)',
    'Agile / Scrum',
  ],

  [ResumeField.TOOLS]: [
    'Redux Toolkit',
    'Zustand',
    'Jest',
    'Detox',
    'GitHub Actions',
    'Fastlane',
    'Firebase',
    'Sentry',
    'Datadog',
    'AWS (Lambda, S3)',
    'Figma',
  ],

  [ResumeField.EXPERIENCE]: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer, Mobile',
      company: 'TechNova Labs, New York, NY',
      date: 'Jan 2022 – Present',
      start: '2022-01',
      end: 'present',
      technologies: ['React Native', 'TypeScript', 'GraphQL', 'JSI', 'GitHub Actions'],
      desc:
        '• Architected a modular Super App hosting 6 product verticals with shared auth, payments and analytics.\n' +
        '• Rebuilt checkout with optimistic UI and offline queueing, raising conversion 18% and cutting payment errors 35%.\n' +
        '• Moved builds to GitHub Actions + Fastlane with OTA updates, shrinking the release cycle from 4 weeks to 1.\n' +
        '• Kept crash-free sessions at 99.9%+ across 40 releases through Sentry alerting, Detox E2E tests and staged rollouts.\n' +
        '• Led architecture reviews and hiring loops; mentored 5 engineers through quarterly growth plans.',
    },
    {
      id: 'exp-2',
      title: 'Software Engineer, Mobile',
      company: 'PixelCraft Solutions, Boston, MA',
      date: 'Jun 2019 – Dec 2021',
      start: '2019-06',
      end: '2021-12',
      technologies: ['React Native', 'Redux', 'Node.js', 'Firebase'],
      desc:
        '• Delivered 3 cross-platform apps (iOS and Android) from one codebase, reaching 1.2M downloads and a 4.7★ store rating.\n' +
        '• Built a reusable component library of 60+ components, cutting UI development time 25%.\n' +
        '• Raised unit test coverage from 35% to 80% with Jest and added CI quality gates.',
    },
    {
      id: 'exp-3',
      title: 'Frontend Developer',
      company: 'BrightPath Digital, Remote',
      date: 'Jul 2017 – May 2019',
      start: '2017-07',
      end: '2019-05',
      technologies: ['React', 'JavaScript', 'REST APIs'],
      desc:
        '• Built responsive React dashboards for 20+ B2B clients, improving page load time 50% with code splitting.\n' +
        '• Integrated REST APIs and Stripe billing, automating invoicing for 3,000+ monthly subscriptions.',
    },
  ],

  [ResumeField.PROJECTS]: [
    {
      id: 'proj-1',
      name: 'OpenTrack: Open-source fitness tracker',
      link: 'https://github.com/alexjohnson/opentrack',
      technologies: ['React Native', 'TypeScript', 'SQLite', 'HealthKit'],
      desc: 'Offline-first workout tracker with HealthKit and Google Fit sync; 2.3K GitHub stars and 15 contributors.',
    },
    {
      id: 'proj-2',
      name: 'Smart TV Streaming Platform',
      link: '',
      technologies: ['Android TV', 'ExoPlayer', 'Kotlin'],
      desc: 'D-pad-first OTT app for Android TV; reduced video start latency 37% with adaptive prefetching.',
    },
  ],

  [ResumeField.EDUCATION]: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'Global Institute of Technology',
      year: '2013 – 2017',
      score: 'GPA 3.8/4.0',
    },
  ],

  [ResumeField.CERTIFICATIONS]: [
    {
      id: 'cert-1',
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      link: '',
    },
    {
      id: 'cert-2',
      name: 'Meta React Native Specialization',
      issuer: 'Meta (Coursera)',
      date: '2022',
    },
  ],

  [ResumeField.LANGUAGES]: [
    { id: 'lang-1', name: 'English', level: 'Native' },
    { id: 'lang-2', name: 'Spanish', level: 'Professional' },
  ],

  [ResumeField.AWARDS]: [
    {
      id: 'award-1',
      title: 'Engineering Excellence Award',
      issuer: 'TechNova Labs',
      date: '2024',
      desc: '',
    },
  ],

  [ResumeField.VOLUNTEERING]: [],
};

export default dummyResumeData;

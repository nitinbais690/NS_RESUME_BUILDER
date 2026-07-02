import { ResumeData, ResumeField, ContactInfo } from '../types';

const dummyResumeData: ResumeData = {
  [ResumeField.CONTACT]: {
    [ContactInfo.NAME]: 'Alex Johnson',
    [ContactInfo.POSITION]: 'Senior React Native Engineer',
    [ContactInfo.PHONE]: '+1 555 123 4567',
    [ContactInfo.EMAIL]: 'alex.johnson@example.com',
    [ContactInfo.LINKEDIN]: 'linkedin.com/in/alexjohnson',
    [ContactInfo.GITHUB]: 'github.com/alexjohnson',
    [ContactInfo.LOCATION]: 'Remote / New York, USA',
  },

  [ResumeField.ABOUT_ME]:
    'Senior React Native Engineer with 6+ years of experience building high-performance mobile applications and scalable platform architectures. Specialized in Super Apps, modular design systems, and native performance optimization. Proven track record of delivering reliable, user-focused products with strong business impact.',

  [ResumeField.KEY_IMPACT]: [
    'Led architecture for a modular Super App used by multiple product teams',
    'Improved app stability to 99.9% crash-free sessions',
    'Reduced feature delivery time by 30% through shared platform components',
    'Increased user engagement by 20% using analytics-driven iteration',
  ],

  [ResumeField.SKILLS]: [
    'React & React Native',
    'TypeScript',
    'System Design',
    'Performance Optimization',
  ],

  [ResumeField.TOOLS]: [
    'TypeScript',
    'React Native',
    'Jest & Detox',
    'Fastlane & CI/CD',
    'CodePush',
    'Mixpanel & Google Analytics',
    'SonarQube',
  ],

  [ResumeField.EXPERIENCE]: [
    {
      id: 'exp-1',
      title: 'Senior Mobile Engineer',
      company: 'TechNova Labs',
      date: 'Jan 2022 – Present',
      technologies: ['React Native', 'TypeScript', 'Zustand', 'JSI'],
      desc:
        '• Designed a modular mobile platform supporting multiple product verticals within a single Super App.\n' +
        '• Implemented native performance optimizations using JSI and custom native modules.\n' +
        '• Maintained high app reliability with 99.9% crash-free sessions across releases.\n' +
        '• Mentored junior engineers and led architectural reviews.',
    },
    {
      id: 'exp-2',
      title: 'Mobile Engineer',
      company: 'PixelCraft Solutions',
      date: 'Jun 2019 – Dec 2021',
      technologies: ['React Native', 'Redux', 'JavaScript'],
      desc:
        '• Built cross-platform mobile applications with shared business logic and reusable UI components.\n' +
        '• Collaborated with designers to deliver smooth animations and consistent user experiences.\n' +
        '• Improved release stability through automated testing and CI pipelines.',
    },
  ],

  [ResumeField.PROJECTS]: [
    {
      id: 'proj-1',
      name: 'Unified Commerce App',
      link: 'https://example.com/project',
      technologies: ['React Native', 'Modular Architecture', 'WebView Bridge'],
      desc: 'A Super App combining shopping, payments, and user accounts into a single mobile experience with shared infrastructure and scalable architecture.',
    },
    {
      id: 'proj-2',
      name: 'Smart TV Streaming Platform',
      link: 'https://example.com/project',
      technologies: ['Android TV', 'ExoPlayer'],
      desc: 'Optimized OTT application for TV devices with D-pad navigation and reduced video startup latency.',
    },
  ],

  [ResumeField.EDUCATION]: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science',
      school: 'Global Institute of Technology',
      year: '2015 – 2019',
      score: '10 CSG',
    },
  ],

  [ResumeField.CERTIFICATIONS]: [
    {
      id: 'cert-1',
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      link: 'https://example.com/certificate',
    },
    {
      id: 'cert-2',
      name: 'React Professional Certification',
      issuer: 'Meta',
      date: '2022',
    },
  ],
};

export default dummyResumeData;

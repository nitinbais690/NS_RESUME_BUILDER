import { ResumeField } from '../../../types';

import { TextAreaField } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const AboutMe: React.FC = () => {
  const aboutMe = useResumeStore((s) => s.resumeData[ResumeField.ABOUT_ME]);
  const updateAboutMe = useResumeStore((s) => s.updateAboutMe);

  return (
    <section>
      <TextAreaField
        label="Professional Summary"
        placeholder="Write a short paragraph about your background, skills, and what makes you stand out…"
        value={aboutMe}
        onChange={(e) => updateAboutMe(e.target.value)}
        maxChars={600}
      />
    </section>
  );
};

export default AboutMe;

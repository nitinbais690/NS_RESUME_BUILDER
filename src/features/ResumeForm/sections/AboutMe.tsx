import { ResumeField } from '../../../types';

import { TextAreaField } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const AboutMe: React.FC = () => {
  const aboutMe = useResumeStore((s) => s.resumeData[ResumeField.ABOUT_ME]);
  const updateAboutMe = useResumeStore((s) => s.updateAboutMe);

  return (
    <section>
      <TextAreaField
        value={aboutMe}
        onChange={(e) => updateAboutMe(e.target.value)}
      />
    </section>
  );
};

export default AboutMe;

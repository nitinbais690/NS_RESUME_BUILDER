import { BaseFormProps } from '../types';
import { ResumeField } from '../../../types';

import { TextAreaField } from '../common/FormFields';

const AboutMe: React.FC<BaseFormProps> = ({ resumeData, setResumeData }) => (
  <section>
    <TextAreaField
      value={resumeData[ResumeField.ABOUT_ME]}
      onChange={(e) =>
        setResumeData({ ...resumeData, [ResumeField.ABOUT_ME]: e.target.value })
      }
    />
  </section>
);

export default AboutMe;

import { ResumeData } from '../../types';

export interface BaseFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

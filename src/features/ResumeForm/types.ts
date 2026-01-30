import { ResumeData } from '../../types';

export interface BaseFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

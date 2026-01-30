import { ResumeData, ResumeField } from '../../../types';

export const useFormArray = <T>(
  resumeData: ResumeData,
  setResumeData: (data: ResumeData) => void,
  field: ResumeField,
) => {
  const items = (resumeData[field] || []) as T[];

  const addItem = (newItem: T) => {
    setResumeData({
      ...resumeData,
      [field]: [...items, newItem],
    });
  };

  const removeItem = (index: number) => {
    setResumeData({
      ...resumeData,
      [field]: items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, updates: Partial<T>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    setResumeData({ ...resumeData, [field]: newData });
  };

  return { items, addItem, removeItem, updateItem };
};

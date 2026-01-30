import { ResumeField } from '../../../types';
import { BaseFormProps } from '../types';

import React from 'react';
import { ToolForm } from '../common/TagForm';

const Skill: React.FC<BaseFormProps> = (props) => {
  return <ToolForm {...props} name={ResumeField.SKILLS} />;
};

export default Skill;

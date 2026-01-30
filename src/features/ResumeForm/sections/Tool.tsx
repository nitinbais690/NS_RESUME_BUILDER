import { ResumeField } from '../../../types';
import { BaseFormProps } from '../types';

import React from 'react';
import { ToolForm } from '../common/TagForm';

const Tools: React.FC<BaseFormProps> = (props) => {
  return <ToolForm {...props} name={ResumeField.TOOLS} />;
};

export default Tools;

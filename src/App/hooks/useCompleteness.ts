import { useMemo } from 'react';

import { useResumeStore } from '../../store/useResumeStore';
import { getChecklist, scoreOf } from '../../lib/completeness';

export const useCompleteness = () => {
  const data = useResumeStore((s) => s.resumeData);
  return useMemo(() => {
    const items = getChecklist(data);
    return { score: scoreOf(items), items };
  }, [data]);
};

import { createElement } from 'react';

import { ContactInfo, ResumeData, ResumeField, ResumeStyle } from '../../types';
import { slugify } from '../../lib/resumeIO';

/**
 * Renders the ATS resume with react-pdf and downloads it. react-pdf and the
 * document are imported on demand (~1 MB) so they never slow the first load.
 */
export const exportAtsPdf = async (data: ResumeData, style: ResumeStyle) => {
  const [{ pdf }, { AtsDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./AtsDocument'),
  ]);
  // react-pdf's pdf() is typed for <Document> elements; AtsDocument renders one.
  const element = createElement(AtsDocument, { data, style }) as unknown as Parameters<typeof pdf>[0];
  const blob = await pdf(element).toBlob();

  const name = data[ResumeField.CONTACT][ContactInfo.NAME];
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(name || 'resume')}-resume.pdf`;
  a.click();
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

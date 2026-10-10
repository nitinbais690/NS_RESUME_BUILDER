// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToBuffer } from '@react-pdf/renderer';

import { AtsDocument } from './AtsDocument';
import dummyResumeData from '../../data';
import { DEFAULT_STYLE, createEmptyResumeData } from '../../constants/factories';
import { ResumeField } from '../../types';

const pageCount = (pdf: Buffer) => (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;

describe('AtsDocument (react-pdf)', () => {
  it('renders the sample resume to a valid A4 PDF', async () => {
    const pdf = await renderToBuffer(<AtsDocument data={dummyResumeData} style={{ ...DEFAULT_STYLE, layout: 'ats' }} />);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pageCount(pdf)).toBeGreaterThanOrEqual(1);
    // A4 = 595.28 x 841.89 pt
    expect(pdf.toString('latin1')).toMatch(/MediaBox\s*\[\s*0 0 595\.2\d* 841\.8\d*/);
  }, 30_000);

  it('handles an empty resume without crashing', async () => {
    const pdf = await renderToBuffer(<AtsDocument data={createEmptyResumeData()} style={DEFAULT_STYLE} />);
    expect(pageCount(pdf)).toBe(1);
  }, 30_000);

  it('breaks long content onto more pages instead of clipping it', async () => {
    const data = structuredClone(dummyResumeData);
    data[ResumeField.EXPERIENCE] = Array.from({ length: 12 }, (_, i) => ({
      ...dummyResumeData[ResumeField.EXPERIENCE][0],
      id: `e${i}`,
    }));
    const pdf = await renderToBuffer(<AtsDocument data={data} style={DEFAULT_STYLE} />);
    expect(pageCount(pdf)).toBeGreaterThan(1);
  }, 30_000);
});

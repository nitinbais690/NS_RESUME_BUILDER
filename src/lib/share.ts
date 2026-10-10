import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

import { ResumeData, ResumeStyle } from '../types';
import { normalizeResumeData, normalizeStyle } from './resumeIO';

export const SHARE_PATH = '/view';

export interface SharedResume {
  data: ResumeData;
  style: ResumeStyle;
}

/**
 * Builds a read-only link with the whole resume compressed into the #hash.
 * The hash is never sent to the server, so the data stays between the sender
 * and whoever opens the link. It's a snapshot: later edits need a new link.
 */
export const buildShareUrl = (
  shared: SharedResume,
  origin = window.location.origin,
): string => {
  const payload = compressToEncodedURIComponent(
    JSON.stringify({ v: 1, d: shared.data, s: shared.style }),
  );
  return `${origin}${SHARE_PATH}#${payload}`;
};

/** Returns null for a missing, truncated or tampered hash. */
export const parseShareHash = (hash: string): SharedResume | null => {
  const raw = hash.replace(/^#/, '');
  if (!raw) return null;
  try {
    const json = decompressFromEncodedURIComponent(raw);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (parsed?.v !== 1) return null;
    return {
      data: normalizeResumeData(parsed.d),
      style: normalizeStyle(parsed.s),
    };
  } catch {
    return null;
  }
};

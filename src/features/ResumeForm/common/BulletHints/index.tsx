import React, { useDeferredValue, useMemo } from 'react';
import { Lightbulb } from 'lucide-react';

import { lintBullet, lintLines } from '../../../../lib/bulletLint';

interface Props {
  text: string;
  /** 'single' = one bullet (Key Impact row); 'lines' = one bullet per line. */
  mode: 'single' | 'lines';
}

/** Inline writing tips under a bullet or description. Renders nothing when clean. */
const BulletHints: React.FC<Props> = ({ text, mode }) => {
  // Deferred so typing never waits on linting.
  const deferred = useDeferredValue(text);
  const rows = useMemo(
    () =>
      mode === 'single'
        ? lintBullet(deferred).map((i) => ({ key: i.code, prefix: '', message: i.message }))
        : lintLines(deferred).flatMap((l) =>
            l.issues.map((i) => ({ key: `${l.line}-${i.code}`, prefix: `Line ${l.line}: `, message: i.message })),
          ),
    [deferred, mode],
  );

  if (rows.length === 0) return null;

  return (
    <ul className="bullet-hints" aria-live="polite">
      {rows.slice(0, 4).map((r) => (
        <li key={r.key}>
          <Lightbulb size={12} aria-hidden="true" />
          <span>
            {r.prefix && <strong>{r.prefix}</strong>}
            {r.message}
          </span>
        </li>
      ))}
      {rows.length > 4 && <li className="bullet-hints__more">+{rows.length - 4} more tips</li>}
    </ul>
  );
};

export default BulletHints;

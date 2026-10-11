import React, { useRef, useState } from 'react';
import { Download, FileJson, ClipboardPaste } from 'lucide-react';

import Modal from '../Modal';
import { useResumeStore } from '../../../store/useResumeStore';
import { downloadText, parseResumeFile, toResumeFile } from '../../../lib/resumeIO';
import { DEFAULT_STYLE } from '../../../constants/factories';
import dummyResumeData from '../../../data';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** What each top-level key holds; shown so people can hand-write a file. */
const FIELDS: Array<[string, string]> = [
  ['Contact', '{ Name, Position, Phone, Email, LinkedIn, GitHub, Location }'],
  ['About Me', 'text'],
  ['Key Impact', '["bullet", …]'],
  ['Skills', '["skill", …]'],
  ['Tools', '["tool", …]'],
  ['Experience', '[{ title, company, start: "2022-01", end: "present", desc, technologies: [] }]'],
  ['Projects', '[{ name, link, desc, technologies: [] }]'],
  ['Education', '[{ degree, school, year, score }]'],
  ['Certifications', '[{ name, issuer, date, link }]'],
  ['Languages', '[{ name, level: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic" }]'],
  ['Awards', '[{ title, issuer, date, desc }]'],
  ['Volunteering', '[{ role, org, start, end, desc }]'],
];

const SKELETON = `{
  "Contact": { "Name": "Your Name", "Position": "Your Role", "Email": "you@mail.com" },
  "About Me": "Two or three lines about you.",
  "Skills": ["TypeScript", "React"],
  "Experience": [
    {
      "title": "Engineer",
      "company": "Acme",
      "start": "2022-01",
      "end": "present",
      "desc": "• Shipped X, improving Y by 30%\\n• Led Z"
    }
  ]
}`;

/**
 * Import a resume from JSON: explains the format, offers a sample file, and
 * accepts either a file or pasted text (Android pickers often grey out .json
 * files, and people copy JSON from chat tools).
 */
const ImportDialog: React.FC<Props> = ({ open, onClose }) => {
  const importResume = useResumeStore((s) => s.importResume);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState('');

  const close = () => {
    setError(null);
    setPasted('');
    onClose();
  };

  const load = (text: string) => {
    try {
      importResume(parseResumeFile(text));
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (file) load(await file.text());
  };

  const downloadSample = () => {
    const sample = toResumeFile({
      id: 'sample',
      name: 'Sample resume',
      updatedAt: 0,
      data: dummyResumeData,
      style: DEFAULT_STYLE,
    });
    downloadText('sample-resume.json', JSON.stringify(sample, null, 2), 'application/json');
  };

  return (
    <Modal open={open} onClose={close} title="Import from JSON" wide>
      <p className="import__intro">
        Import a file you exported from NS Studio, or write your own. A file only
        needs the sections you have. Everything else is left empty and every
        field can be edited after import.
      </p>

      <div className="import__actions">
        <button type="button" className="btn btn--primary" onClick={() => fileRef.current?.click()}>
          <FileJson size={16} /> Choose JSON file
        </button>
        <button type="button" className="btn" onClick={downloadSample}>
          <Download size={16} /> Download sample file
        </button>
      </div>

      {error && (
        <p className="import__error" role="alert">
          {error}
        </p>
      )}

      <details className="import__details">
        <summary>Paste JSON instead</summary>
        <textarea
          className="form-textarea import__paste"
          aria-label="Resume JSON"
          placeholder={SKELETON}
          spellCheck={false}
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
        />
        <button
          type="button"
          className="btn"
          disabled={!pasted.trim()}
          onClick={() => load(pasted)}
        >
          <ClipboardPaste size={16} /> Import pasted JSON
        </button>
      </details>

      <details className="import__details">
        <summary>JSON format</summary>
        <p className="import__hint">
          Use the top-level keys below, spelled exactly as shown. Dates are{' '}
          <code>YYYY-MM</code>, and <code>"present"</code> marks a current role.
          Start each bullet in <code>desc</code> on a new line (<code>\n</code>).
        </p>
        <dl className="import__fields">
          {FIELDS.map(([key, shape]) => (
            <React.Fragment key={key}>
              <dt>{key}</dt>
              <dd>
                <code>{shape}</code>
              </dd>
            </React.Fragment>
          ))}
        </dl>
        <p className="import__hint">Smallest valid file:</p>
        <pre className="import__code">{SKELETON}</pre>
      </details>

      {/* No `accept` filter: Android maps .json to an unknown MIME type and
          greys the files out. Content is validated on import instead. */}
      <input ref={fileRef} type="file" hidden onChange={onFile} />
    </Modal>
  );
};

export default ImportDialog;

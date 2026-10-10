import React, { useRef, useState } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  FilePlus2,
  FileText,
  Link2,
  Pencil,
  Trash2,
  Upload,
  Check,
} from 'lucide-react';

import { useResumeStore } from '../../../store/useResumeStore';
import { usePopover } from '../../hooks/usePopover';
import {
  downloadText,
  parseResumeFile,
  slugify,
  toResumeFile,
} from '../../../lib/resumeIO';
import ShareDialog from '../ShareDialog';

const timeAgo = (ts: number) => {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return new Date(ts).toLocaleDateString();
};

/**
 * App-bar menu for resume versions: switch, create, duplicate, rename, delete,
 * plus JSON import/export and the share link.
 */
const ResumeMenu: React.FC = () => {
  const { open, setOpen, ref } = usePopover();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resumes = useResumeStore((s) => s.resumes);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const editedAt = useResumeStore((s) => s.editedAt);
  const {
    switchResume,
    createResume,
    renameResume,
    deleteResume,
    importResume,
    getActiveResume,
  } = useResumeStore.getState();

  const activeName = resumes[activeId]?.name ?? 'My Resume';
  const list = Object.values(resumes).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const startRename = (id: string, name: string) => {
    setRenamingId(id);
    setDraftName(name);
  };

  const commitRename = () => {
    if (renamingId) renameResume(renamingId, draftName);
    setRenamingId(null);
  };

  const onCreate = (mode: 'blank' | 'duplicate') => {
    const name = mode === 'blank' ? 'Untitled resume' : `${activeName} (copy)`;
    const id = createResume(name, mode);
    startRename(id, name);
  };

  const onDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This can't be undone.`)) {
      deleteResume(id);
    }
  };

  const onExport = () => {
    const resume = getActiveResume();
    downloadText(
      `${slugify(resume.name)}.json`,
      JSON.stringify(toResumeFile(resume), null, 2),
      'application/json',
    );
    setOpen(false);
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (!file) return;
    try {
      importResume(parseResumeFile(await file.text()));
      setImportError(null);
      setOpen(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  return (
    <div className="resume-menu" ref={ref}>
      <button
        type="button"
        className={`resume-menu__trigger ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        title="Switch, create or share resumes"
      >
        <FileText size={15} />
        <span className="resume-menu__name">{activeName}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="resume-menu__popover" role="menu" aria-label="Resumes">
          <p className="appbar__popover-title">Your resumes</p>

          <ul className="resume-menu__list">
            {list.map((r) => {
              const isActive = r.id === activeId;
              const updated = isActive ? editedAt : r.updatedAt;
              return (
                <li key={r.id} className={`resume-menu__item ${isActive ? 'is-active' : ''}`}>
                  {renamingId === r.id ? (
                    <form
                      className="resume-menu__rename"
                      onSubmit={(e) => {
                        e.preventDefault();
                        commitRename();
                      }}
                    >
                      <input
                        className="form-input"
                        aria-label="Resume name"
                        value={draftName}
                        autoFocus
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => setDraftName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            e.stopPropagation();
                            setRenamingId(null);
                          }
                        }}
                      />
                      <button type="submit" className="resume-menu__icon-btn" aria-label="Save name">
                        <Check size={14} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        className="resume-menu__select"
                        onClick={() => {
                          switchResume(r.id);
                          setOpen(false);
                        }}
                      >
                        <span className="resume-menu__item-name">{r.name}</span>
                        <span className="resume-menu__item-meta">
                          Edited {timeAgo(updated)}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="resume-menu__icon-btn"
                        aria-label={`Rename ${r.name}`}
                        onClick={() => startRename(r.id, r.name)}
                      >
                        <Pencil size={13} />
                      </button>
                      {list.length > 1 && (
                        <button
                          type="button"
                          className="resume-menu__icon-btn resume-menu__icon-btn--danger"
                          aria-label={`Delete ${r.name}`}
                          onClick={() => onDelete(r.id, r.name)}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="resume-menu__actions">
            <button type="button" role="menuitem" onClick={() => onCreate('blank')}>
              <FilePlus2 size={15} /> New blank
            </button>
            <button type="button" role="menuitem" onClick={() => onCreate('duplicate')}>
              <Copy size={15} /> Duplicate this
            </button>
          </div>

          <hr className="compact-divider" />

          <div className="resume-menu__actions resume-menu__actions--stack">
            <button type="button" role="menuitem" onClick={() => fileRef.current?.click()}>
              <Upload size={15} /> Import from JSON…
            </button>
            <button type="button" role="menuitem" onClick={onExport}>
              <Download size={15} /> Export as JSON
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setShareOpen(true);
                setOpen(false);
              }}
            >
              <Link2 size={15} /> Share read-only link…
            </button>
          </div>

          {importError && (
            <p className="resume-menu__error" role="alert">
              {importError}
            </p>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={onImportFile}
      />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
};

export default ResumeMenu;

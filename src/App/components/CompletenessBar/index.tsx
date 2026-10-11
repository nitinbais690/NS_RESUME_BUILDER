import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, X } from 'lucide-react';

import { usePopover } from '../../hooks/usePopover';
import { usePaneMode } from '../../hooks/usePaneMode';
import { ChecklistItem } from '../../../lib/completeness';

const RADIUS = 13;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CompletenessBarProps {
  score: number;
  items: ChecklistItem[];
}

/** Completeness ring; click it for a checklist of what to do next. */
const CompletenessBar: React.FC<CompletenessBarProps> = ({ score, items }) => {
  const { open, setOpen, ref } = usePopover();
  const navigate = useNavigate();
  const [, setPane] = usePaneMode();
  const color =
    score > 80 ? '#16a34a' : score >= 50 ? '#d97706' : 'var(--color-border-medium)';
  const offset = CIRCUMFERENCE * (1 - score / 100);
  // Biggest wins first, then what's already done.
  const todo = items.filter((i) => !i.done).sort((a, b) => b.points - a.points);
  const done = items.filter((i) => i.done);

  const go = (step: string) => {
    setPane('edit');
    navigate('/' + step);
    setOpen(false);
  };

  return (
    <div className="completeness" ref={ref}>
      <button
        type="button"
        className="completeness-bar"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Resume ${score}% complete. Show checklist`}
        title={`Resume ${score}% complete`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <circle cx="17" cy="17" r={RADIUS} fill="none" stroke="var(--color-border-light)" strokeWidth="2.5" />
          <circle
            cx="17"
            cy="17"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 17 17)"
            style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.35s ease' }}
          />
        </svg>
        <span className="completeness-bar__label" style={{ color }}>
          {score}%
        </span>
      </button>

      {open && (
        <div className="completeness__popover" role="dialog" aria-label="Completeness checklist">
          <div className="appbar__popover-head">
            <p className="appbar__popover-title">
              {todo.length === 0 ? 'All done. Nice work!' : 'Next steps'}
            </p>
            <button
              type="button"
              className="appbar__popover-close"
              onClick={() => setOpen(false)}
              aria-label="Close checklist"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="checklist">
            {todo.map((item) => (
              <li key={item.id}>
                <button type="button" className="checklist__item" onClick={() => go(item.step)}>
                  <Circle size={15} aria-hidden="true" />
                  <span className="checklist__label">{item.label}</span>
                  <span className="checklist__points">+{item.points}%</span>
                </button>
              </li>
            ))}
            {done.map((item) => (
              <li key={item.id}>
                <button type="button" className="checklist__item is-done" onClick={() => go(item.step)}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span className="checklist__label">{doneLabel(item)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Done items read as facts, not instructions.
const doneLabel = (item: ChecklistItem) =>
  ({
    name: 'Name',
    position: 'Job title',
    email: 'Email',
    phone: 'Phone',
    about: 'Summary',
    education: 'Education',
    cert: 'Certification',
    experience: 'Experience described',
    project: 'Project described',
  })[item.id] ?? item.label;

export default CompletenessBar;

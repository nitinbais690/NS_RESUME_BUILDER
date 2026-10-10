import React, { useDeferredValue, useMemo } from 'react';
import { Check, Plus } from 'lucide-react';

import Modal from '../Modal';
import { useResumeStore } from '../../../store/useResumeStore';
import { displayTerm, matchJob } from '../../../lib/jobMatch';
import { ResumeField } from '../../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Paste a job ad → match score, matched/missing keywords and tips. Runs fully
 * in the browser (keyword extraction), so nothing is sent anywhere.
 */
const JobMatchDialog: React.FC<Props> = ({ open, onClose }) => {
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const resumeData = useResumeStore((s) => s.resumeData);
  const updateListField = useResumeStore((s) => s.updateListField);
  const deferredJob = useDeferredValue(jobDescription);

  const result = useMemo(
    () => (deferredJob.trim().length > 40 ? matchJob(deferredJob, resumeData) : null),
    [deferredJob, resumeData],
  );

  const skills = resumeData[ResumeField.SKILLS];
  const addSkill = (term: string) => {
    if (!skills.some((s) => s.toLowerCase() === term.toLowerCase())) updateListField(ResumeField.SKILLS, [...skills, term]);
  };

  const tone = !result ? '' : result.score >= 70 ? 'good' : result.score >= 40 ? 'ok' : 'low';

  return (
    <Modal open={open} onClose={onClose} title="Match a job description" wide>
      <label className="form-label" htmlFor="job-text">
        Paste the job ad
      </label>
      <textarea
        id="job-text"
        className="form-textarea job-match__input"
        placeholder="Paste the full job description here: title, responsibilities, requirements…"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <p className="job-match__privacy">Checked on your device. The text isn't uploaded anywhere.</p>

      {result && (
        <div className="job-match__result" aria-live="polite">
          <div className={`job-match__score job-match__score--${tone}`}>
            <span className="job-match__score-value">{result.score}%</span>
            <span>
              keyword match
              <small>
                {result.matched.length} of {result.matched.length + result.missing.length} key terms found
              </small>
            </span>
          </div>

          {result.missing.length > 0 && (
            <section>
              <h3 className="job-match__heading">Missing from your resume</h3>
              <ul className="job-match__chips">
                {result.missing.map((k) => (
                  <li key={k.term} className="chip chip--missing">
                    {displayTerm(k.term)}
                    <button
                      type="button"
                      className="chip__action"
                      onClick={() => addSkill(displayTerm(k.term))}
                      aria-label={`Add ${displayTerm(k.term)} to Skills`}
                      title="Add to Skills"
                    >
                      <Plus size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.matched.length > 0 && (
            <section>
              <h3 className="job-match__heading">Already covered</h3>
              <ul className="job-match__chips">
                {result.matched.map((k) => (
                  <li key={k.term} className="chip chip--matched">
                    <Check size={12} aria-hidden="true" /> {displayTerm(k.term)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="job-match__heading">Suggestions</h3>
            <ul className="job-match__tips">
              {result.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default JobMatchDialog;

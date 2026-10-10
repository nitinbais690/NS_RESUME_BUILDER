import React from 'react';

const RADIUS = 13;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CompletenessBarProps {
  score: number;
}

const CompletenessBar: React.FC<CompletenessBarProps> = ({ score }) => {
  const color =
    score > 80 ? '#16a34a' : score >= 50 ? '#d97706' : 'var(--color-border-medium)';
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="completeness-bar" title={`Resume ${score}% complete`} aria-label={`Resume ${score}% complete`}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle
          cx="17"
          cy="17"
          r={RADIUS}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth="2.5"
        />
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
      <span className="completeness-bar__label" style={{ color }}>{score}%</span>
    </div>
  );
};

export default CompletenessBar;

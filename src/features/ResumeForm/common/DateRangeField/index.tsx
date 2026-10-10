import React from 'react';

import { PRESENT, formatRange } from '../../../../lib/dates';

export interface DateRangeValue {
  start?: string;
  end?: string;
  /** Display string kept in sync for the resume ("Jan 2022 – Present"). */
  date: string;
}

interface Props {
  idPrefix: string;
  start?: string;
  end?: string;
  /** Legacy free-text date, shown as a hint until real dates are picked. */
  legacyText?: string;
  onChange: (value: DateRangeValue) => void;
}

/** Start/end month pickers with a "Present" switch for ongoing roles. */
const DateRangeField: React.FC<Props> = ({ idPrefix, start, end, legacyText, onChange }) => {
  const isPresent = end === PRESENT;

  const emit = (nextStart?: string, nextEnd?: string) =>
    onChange({
      start: nextStart || undefined,
      end: nextEnd || undefined,
      // Without a start date there's nothing to format; keep the old text.
      date: nextStart ? formatRange(nextStart, nextEnd) : (legacyText ?? ''),
    });

  return (
    <div className="date-range">
      <div className="date-range__fields">
        <div className="form-input-group">
          <label className="form-label" htmlFor={`${idPrefix}-start`}>
            Start
          </label>
          <input
            id={`${idPrefix}-start`}
            type="month"
            className="form-input"
            value={start ?? ''}
            max={end && !isPresent ? end : undefined}
            onChange={(e) => emit(e.target.value, end)}
          />
        </div>
        <div className="form-input-group">
          <label className="form-label" htmlFor={`${idPrefix}-end`}>
            End
          </label>
          <input
            id={`${idPrefix}-end`}
            type="month"
            className="form-input"
            value={isPresent ? '' : (end ?? '')}
            min={start}
            disabled={isPresent}
            onChange={(e) => emit(start, e.target.value)}
          />
        </div>
      </div>
      <label className="date-range__present">
        <input
          type="checkbox"
          checked={isPresent}
          onChange={(e) => emit(start, e.target.checked ? PRESENT : undefined)}
        />
        I currently work here
      </label>
      {!start && legacyText && (
        <p className="date-range__legacy">
          Currently shows "{legacyText}". Pick a start month to enable sorting.
        </p>
      )}
    </div>
  );
};

export default DateRangeField;

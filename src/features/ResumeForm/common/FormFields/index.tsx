// components/common/FormFields.tsx
import { useLayoutEffect, useRef } from 'react';

interface InputFieldProps {
  label?: string;
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Exact match
  placeholder?: string;
  className?: string;
  type?: string;
  required?: boolean;
}

// Separate props for TextArea
interface TextAreaProps {
  label?: string;
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Exact match
  placeholder?: string;
  maxChars?: number;
}

export const FormField = ({
  label,
  type = 'text',
  className,
  ...props
}: InputFieldProps) => (
  <div className="form-input-group">
    {label && <label className="form-label">{label}</label>}
    <input
      {...props}
      type={type}
      className={`form-input ${className || ''}`}
    />
  </div>
);

/**
 * Textarea that grows to fit its content, so long bullets never hide behind an
 * inner scrollbar (especially painful on phones). CSS min-height still applies.
 */
export const AutoGrowTextarea = ({
  className,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    // scrollHeight excludes borders; add them back for border-box sizing.
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
  }, [value]);

  return (
    <textarea
      {...props}
      ref={ref}
      value={value}
      className={`form-textarea form-textarea--auto ${className || ''}`}
    />
  );
};

export const TextAreaField = ({ label, maxChars, value, ...props }: TextAreaProps) => (
  <div className="form-input-group full-width">
    {label && <label className="form-label">{label}</label>}
    <AutoGrowTextarea {...props} value={value} className="form-textarea--tall" />
    {maxChars && (
      <span className="form-char-count">{value?.length ?? 0} / {maxChars}</span>
    )}
  </div>
);

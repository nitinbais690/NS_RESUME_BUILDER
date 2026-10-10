// components/common/FormFields.tsx
import { useId, useLayoutEffect, useRef } from 'react';

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
}: InputFieldProps) => {
  const id = useId();
  return (
    <div className="form-input-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        type={type}
        className={`form-input ${className || ''}`}
      />
    </div>
  );
};

/**
 * Textarea that grows to fit its content, so long bullets never hide behind an
 * inner scrollbar (especially painful on phones). CSS min-height still applies.
 */
export const AutoGrowTextarea = ({
  className,
  value,
  ref: externalRef,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: React.Ref<HTMLTextAreaElement>;
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

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
      ref={(el) => {
        ref.current = el;
        if (typeof externalRef === 'function') externalRef(el);
        else if (externalRef) externalRef.current = el;
      }}
      value={value}
      className={`form-textarea form-textarea--auto ${className || ''}`}
    />
  );
};

export const TextAreaField = ({
  label,
  maxChars,
  value,
  ...props
}: TextAreaProps) => {
  const id = useId();
  return (
    <div className="form-input-group full-width">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <AutoGrowTextarea
        {...props}
        id={id}
        value={value}
        className="form-textarea--tall"
      />
      {maxChars && (
        <span className="form-char-count">
          {value?.length ?? 0} / {maxChars}
        </span>
      )}
    </div>
  );
};

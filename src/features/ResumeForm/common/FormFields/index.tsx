// components/common/FormFields.tsx

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

export const TextAreaField = ({ label, maxChars, value, ...props }: TextAreaProps) => (
  <div className="form-input-group full-width">
    {label && <label className="form-label">{label}</label>}
    <textarea {...props} value={value} className="form-textarea form-textarea--tall" />
    {maxChars && (
      <span className="form-char-count">{value?.length ?? 0} / {maxChars}</span>
    )}
  </div>
);

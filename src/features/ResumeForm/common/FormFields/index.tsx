// components/common/FormFields.tsx

interface InputFieldProps {
  label?: string;
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Exact match
  placeholder?: string;
  className?: string;
  type?: string;
}

// Separate props for TextArea
interface TextAreaProps {
  label?: string;
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Exact match
  placeholder?: string;
}

export const FormField = ({
  label,
  type = 'text',
  ...props
}: InputFieldProps) => (
  <div className="form-input-group">
    {label && <label className="form-label">{label}</label>}
    <input
      {...props}
      type={type}
      className={`form-input form-input-underline ${props.className || ''}`}
    />
  </div>
);

export const TextAreaField = ({ label, ...props }: TextAreaProps) => (
  <div className="form-input-group full-width">
    {label && <label className="form-label">{label}</label>}
    <textarea
      {...props}
      className="form-textarea"
      style={{ height: '120px' }}
    />
  </div>
);

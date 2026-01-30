import React from 'react';

interface ButtonProps {
  className?: string;
  onClick: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode; // ReactNode allows text, icons, or both
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  style,
}) => {
  return (
    <div className="btn-download-container">
      <button
        onClick={onClick}
        className={`btn-download ${className}`}
        style={style}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;

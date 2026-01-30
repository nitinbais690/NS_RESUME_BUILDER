import React from 'react';

export interface ContactItemProps {
  value?: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  color: string;
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'location';
}
export const ContactItem: React.FC<ContactItemProps> = ({
  value,
  Icon,
  color,
  type,
}) => {
  if (!value) return null;

  // Generate the correct link based on type
  let href = '';
  if (type === 'email') {
    href = `mailto:${value}`;
  } else if (type === 'phone') {
    href = `tel:${value}`;
  } else if (type === 'linkedin' || type === 'github') {
    // Ensure protocol exists
    href = value.startsWith('http') ? value : `https://${value}`;
  }

  const isLink = !!href;

  // Common props for the container (div or a)
  const containerProps = {
    className: 'template-contact-item',
  };

  const content = (
    <>
      <Icon size={14} color={color} />
      <span>{value}</span>
    </>
  );

  // If it's a link, render an anchor tag, otherwise a div
  if (isLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...containerProps}
      >
        {content}
      </a>
    );
  }

  return <div {...containerProps}>{content}</div>;
};

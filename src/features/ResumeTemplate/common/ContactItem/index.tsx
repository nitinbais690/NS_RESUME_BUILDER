import React from 'react';

import { profileHandle, withProtocol } from '../../../../lib/links';

const PROFILE_LABELS = { linkedin: 'LinkedIn', github: 'GitHub' } as const;

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
    href = withProtocol(value);
  }
  // Profiles show just the user name; the link still opens the full page.
  const isProfile = type === 'linkedin' || type === 'github';
  const text = isProfile ? profileHandle(value) : value;

  const isLink = !!href;

  // Common props for the container (div or a)
  const containerProps = {
    className: 'template-contact-item',
  };

  const content = (
    <>
      <Icon size={14} color={color} />
      {/* Stands in for the icon on layouts that hide icons (ATS-first). */}
      {isProfile && <span className="template-contact-item__label">{PROFILE_LABELS[type]}: </span>}
      <span>{text}</span>
    </>
  );

  // If it's a link, render an anchor tag, otherwise a div
  if (isLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isProfile ? `${PROFILE_LABELS[type]}: ${text}` : `${type}: ${value}`}
        title={isProfile ? href : undefined}
        {...containerProps}
      >
        {content}
      </a>
    );
  }

  return <div {...containerProps}>{content}</div>;
};

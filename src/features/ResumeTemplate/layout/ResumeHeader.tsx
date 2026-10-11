import { ContactInfo, ContactInfoType } from '../../../types';

import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, GithubIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { ContactItem } from '../common/ContactItem';

type ResumeHeaderProps = ContactInfoType & {
  accentColor: string;
  /** When set, a small QR code linking here is shown in the header. */
  qrUrl?: string;
  /** Leave contact details out (the layout shows them in a column instead). */
  hideContacts?: boolean;
  /** "split": profile links under the name, labelled email/phone on the right. */
  variant?: 'split';
};

const withProtocol = (v: string) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);

/** One labelled contact line, e.g. "Email:  alex@example.com". */
const LabelledContact: React.FC<{ label: string; value?: string; href?: string }> = ({ label, value, href }) =>
  value?.trim() ? (
    <div className="template-split-contact">
      <span className="template-split-contact__label">{label}:</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {value.trim()}
        </a>
      ) : (
        <span>{value.trim()}</span>
      )}
    </div>
  ) : null;

const ResumeHeader: React.FC<ResumeHeaderProps> = (props) => {
  const iconColor = props.accentColor;
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (!props.qrUrl) {
      setQr(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(props.qrUrl, { margin: 0, width: 160 })
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setQr(null));
    return () => {
      cancelled = true;
    };
  }, [props.qrUrl]);

  const contactFields = useMemo(
    () => [
      { value: props[ContactInfo.EMAIL], Icon: Mail, type: 'email' as const },
      { value: props[ContactInfo.PHONE], Icon: Phone, type: 'phone' as const },
      {
        value: props[ContactInfo.LINKEDIN],
        Icon: Linkedin,
        type: 'linkedin' as const,
      },
      {
        value: props[ContactInfo.GITHUB],
        Icon: GithubIcon,
        type: 'github' as const,
      },
      {
        value: props[ContactInfo.LOCATION],
        Icon: MapPin,
        type: 'location' as const,
      },
    ],
    [
      props[ContactInfo.EMAIL],
      props[ContactInfo.PHONE],
      props[ContactInfo.LINKEDIN],
      props[ContactInfo.GITHUB],
      props[ContactInfo.LOCATION],
    ],
  );

  if (props.variant === 'split') {
    const linkedin = props[ContactInfo.LINKEDIN];
    const github = props[ContactInfo.GITHUB];
    return (
      <header className="template-resume-header template-resume-header--split" data-jump="Contact">
        <div className="template-header-left">
          <h1 className="template-header-name">{props[ContactInfo.NAME]}</h1>
          <p className="template-header-position">{props[ContactInfo.POSITION]}</p>
          <LabelledContact label="LinkedIn" value={linkedin} href={linkedin && withProtocol(linkedin)} />
          <LabelledContact label="GitHub" value={github} href={github && withProtocol(github)} />
        </div>
        <div className="template-header-right">
          <LabelledContact
            label="Email"
            value={props[ContactInfo.EMAIL]}
            href={`mailto:${props[ContactInfo.EMAIL]}`}
          />
          <LabelledContact label="Mobile" value={props[ContactInfo.PHONE]} href={`tel:${props[ContactInfo.PHONE]}`} />
          <LabelledContact label="Location" value={props[ContactInfo.LOCATION]} />
        </div>
      </header>
    );
  }

  return (
    <header className="template-resume-header" data-jump="Contact">
      <div className="template-header-left">
        <h1 className="template-header-name">{props[ContactInfo.NAME]}</h1>
        <p className="template-header-position">
          {props[ContactInfo.POSITION]}
        </p>
      </div>
      {!props.hideContacts && (
        <div className="template-header-right">
          {contactFields.map((field) => (
            <ContactItem
              key={field.type}
              value={field.value}
              Icon={field.Icon}
              color={iconColor}
              type={field.type}
            />
          ))}
        </div>
      )}
      {qr && (
        <img
          className="template-header-qr"
          src={qr}
          alt={`QR code: ${props.qrUrl}`}
          width={56}
          height={56}
        />
      )}
    </header>
  );
};

export default ResumeHeader;

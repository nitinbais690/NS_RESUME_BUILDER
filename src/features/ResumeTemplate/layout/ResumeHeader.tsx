import { ContactInfo, ContactInfoType } from '../../../types';

import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, GithubIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { ContactItem } from '../common/ContactItem';

type ResumeHeaderProps = ContactInfoType & {
  accentColor: string;
  /** When set, a small QR code linking here is shown in the header. */
  qrUrl?: string;
};

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

  return (
    <header className="template-resume-header" data-jump="Contact">
      <div className="template-header-left">
        <h1 className="template-header-name">{props[ContactInfo.NAME]}</h1>
        <p className="template-header-position">
          {props[ContactInfo.POSITION]}
        </p>
      </div>
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

import { ContactInfo, ContactInfoType } from '../../../types';

import React, { useMemo } from 'react';
import { Mail, Phone, Linkedin, MapPin, GithubIcon } from 'lucide-react';
import themes from '../../../constants/themes';
import { ContactItem } from '../common/ContactItem';

type ResumeHeaderProps = ContactInfoType & { currentTheme: string };

const ResumeHeader: React.FC<ResumeHeaderProps> = (props) => {
  const iconColor = useMemo(() => {
    const themeObj = themes.find((t) => t.name === props.currentTheme);
    return themeObj ? themeObj.color : themes[0].color;
  }, [props.currentTheme]);

  const contactFields = [
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
  ];

  return (
    <header className="template-resume-header">
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
    </header>
  );
};

export default ResumeHeader;

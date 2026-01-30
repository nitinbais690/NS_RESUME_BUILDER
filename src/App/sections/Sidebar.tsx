
import React from 'react';
import { Layout as LogoIcon } from 'lucide-react';
import CVCustomizer from './CVCustomizer';
const SidebarHeader: React.FC = () => {
  return (
    <header className="sidebar-config-header">
      <div className="main-app-header__branding">
        <div className="main-logo-icon-wrapper">
          <LogoIcon size={24} strokeWidth={2.5} />
        </div>
        <h1 className="main-app-title">
          NS <span>CV</span>
        </h1>
      </div>

      <CVCustomizer />
    </header>
  );
};

export default SidebarHeader;

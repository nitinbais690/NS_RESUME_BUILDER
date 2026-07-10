import { FontFamily } from '../../types';

import React from 'react';
import { Check, Type, Layout as LayoutIcon, Palette, ChevronDown } from 'lucide-react';
import themes, { fontFamilies, layouts } from '../../constants/themes';

import { useResumeStore } from '../../store/useResumeStore';

const CVCustomizer: React.FC = () => {
  const currentLayout = useResumeStore((s) => s.layout);
  const currentTheme = useResumeStore((s) => s.theme);
  const currentFontFamily = useResumeStore((s) => s.fontFamily);
  const setLayout = useResumeStore((s) => s.setLayout);
  const setTheme = useResumeStore((s) => s.setTheme);
  const onFontFamilyChange = useResumeStore((s) => s.setFontFamily);

  return (
    <div className="cv-customizer compact">
      {/* Layout Row — card grid replaces overflow-prone segmented control */}
      <div className="compact-row">
        <div className="control-label-wrapper">
          <LayoutIcon size={12} />
          <span className="control-label">Layout</span>
        </div>
        <div className="layout-card-grid">
          {layouts.map((layout) => (
            <button
              key={layout}
              onClick={() => setLayout(layout)}
              className={`layout-card-btn ${currentLayout === layout ? 'active' : ''}`}
              title={layout}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      <hr className="compact-divider" />

      {/* Font Row */}
      <div className="compact-row">
        <div className="control-label-wrapper">
          <Type size={12} />
          <span className="control-label">Font</span>
        </div>
        <div className="mini-select-wrapper">
          <select
            className="mini-select"
            aria-label="Font family"
            value={currentFontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value as FontFamily)}
            style={{ fontFamily: currentFontFamily }}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
          <ChevronDown className="mini-select-chevron" size={14} />
        </div>
      </div>

      <hr className="compact-divider" />

      {/* Theme Row */}
      <div className="compact-row">
        <div className="control-label-wrapper">
          <Palette size={12} />
          <span className="control-label">Theme</span>
        </div>
        <div className="swatch-grid mini">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setTheme(theme.name)}
              className={`swatch-btn mini ${currentTheme === theme.name ? 'active' : ''}`}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
              aria-label={`${theme.name} theme`}
            >
              {currentTheme === theme.name && <Check size={14} color="white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVCustomizer;

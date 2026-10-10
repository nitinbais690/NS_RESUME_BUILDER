import { FontFamily, QrTarget } from '../../types';

import React from 'react';
import {
  Check,
  Type,
  Layout as LayoutIcon,
  Palette,
  ChevronDown,
  QrCode,
  Pipette,
} from 'lucide-react';
import themes, { fontFamilies, layouts, layoutLabels } from '../../constants/themes';

import { useResumeStore } from '../../store/useResumeStore';

const CVCustomizer: React.FC = () => {
  const currentLayout = useResumeStore((s) => s.layout);
  const currentTheme = useResumeStore((s) => s.theme);
  const currentFontFamily = useResumeStore((s) => s.fontFamily);
  const setLayout = useResumeStore((s) => s.setLayout);
  const setTheme = useResumeStore((s) => s.setTheme);
  const onFontFamilyChange = useResumeStore((s) => s.setFontFamily);
  const accentColor = useResumeStore((s) => s.accentColor);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const fontScale = useResumeStore((s) => s.fontScale);
  const setFontScale = useResumeStore((s) => s.setFontScale);
  const qrTarget = useResumeStore((s) => s.qrTarget);
  const setQrTarget = useResumeStore((s) => s.setQrTarget);
  const themeColor = (themes.find((t) => t.name === currentTheme) ?? themes[0]).color;

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
              aria-pressed={currentLayout === layout}
              title={
                layout === 'ats'
                  ? 'Plain single column that applicant tracking systems read reliably'
                  : layoutLabels[layout]
              }
            >
              {layoutLabels[layout]}
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

      <div className="compact-row">
        <label className="control-label-wrapper" htmlFor="font-scale">
          <Type size={12} />
          <span className="control-label">Size</span>
        </label>
        <div className="range-control">
          <input
            id="font-scale"
            type="range"
            min={0.8}
            max={1.25}
            step={0.05}
            value={fontScale}
            onChange={(e) => setFontScale(Number(e.target.value))}
            aria-valuetext={`${Math.round(fontScale * 100)}%`}
          />
          <button
            type="button"
            className="range-control__value"
            onClick={() => setFontScale(1)}
            title="Reset to 100%"
          >
            {Math.round(fontScale * 100)}%
          </button>
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
              aria-pressed={currentTheme === theme.name && !accentColor}
            >
              {currentTheme === theme.name && !accentColor && (
                <Check size={14} color="white" />
              )}
            </button>
          ))}
          <label
            className={`swatch-btn mini swatch-btn--custom ${accentColor ? 'active' : ''}`}
            style={accentColor ? { backgroundColor: accentColor } : undefined}
            title="Custom color"
          >
            {accentColor ? <Check size={14} color="white" /> : <Pipette size={13} />}
            <input
              type="color"
              className="visually-hidden"
              aria-label="Custom accent color"
              value={accentColor ?? themeColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
          </label>
        </div>
      </div>

      <hr className="compact-divider" />

      <div className="compact-row">
        <label className="control-label-wrapper" htmlFor="qr-target">
          <QrCode size={12} />
          <span className="control-label">QR code</span>
        </label>
        <div className="mini-select-wrapper">
          <select
            id="qr-target"
            className="mini-select"
            value={qrTarget}
            onChange={(e) => setQrTarget(e.target.value as QrTarget)}
          >
            <option value="none">None</option>
            <option value="linkedin">LinkedIn profile</option>
            <option value="github">GitHub profile</option>
          </select>
          <ChevronDown className="mini-select-chevron" size={14} />
        </div>
      </div>
    </div>
  );
};

export default CVCustomizer;

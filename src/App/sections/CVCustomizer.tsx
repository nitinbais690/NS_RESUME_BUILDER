import { DateFormat, FontFamily, GapKey, QrTarget } from '../../types';

import React, { useState } from 'react';
import {
  Check,
  Type,
  Layout as LayoutIcon,
  Palette,
  ChevronDown,
  QrCode,
  CalendarDays,
  Pipette,
  MoveVertical,
  Bookmark,
  Plus,
  X,
  ListOrdered,
  type LucideIcon,
} from 'lucide-react';
import themes, {
  ATS_LAYOUTS,
  fontFamilies,
  layoutHints,
  layoutLabels,
  layouts,
} from '../../constants/themes';

import { useResumeStore } from '../../store/useResumeStore';
import { GAP_MAX, GAP_MIN } from '../../lib/resumeIO';
import SectionOrganizer from './SectionOrganizer';

const GAP_ROWS: Array<{ key: GapKey; label: string; hint: string }> = [
  { key: 'section', label: 'Sections', hint: 'Space between one section and the next' },
  { key: 'heading', label: 'Headings', hint: 'Space between a section heading and its content' },
  { key: 'entry', label: 'Entries', hint: 'Space between jobs, projects, degrees and other entries' },
];

interface RangeRowProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  title?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  resetTitle: string;
}

/** Labelled slider with a percentage button that resets it to 100%. */
const RangeRow: React.FC<RangeRowProps> = ({ id, label, icon, title, min, max, value, onChange, resetTitle }) => (
  <div className="compact-row" title={title}>
    <label className="control-label-wrapper" htmlFor={id}>
      {icon}
      <span className="control-label">{label}</span>
    </label>
    <div className="range-control">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${Math.round(value * 100)}%`}
      />
      <button type="button" className="range-control__value" onClick={() => onChange(1)} title={resetTitle}>
        {Math.round(value * 100)}%
      </button>
    </div>
  </div>
);

type TabId = 'layout' | 'sections' | 'text' | 'style';

/** One short screen each, so nothing needs a long scroll (especially on phones). */
const TABS: Array<{ id: TabId; label: string; Icon: LucideIcon }> = [
  { id: 'layout', label: 'Layout', Icon: LayoutIcon },
  { id: 'sections', label: 'Sections', Icon: ListOrdered },
  { id: 'text', label: 'Text', Icon: Type },
  { id: 'style', label: 'Style', Icon: Palette },
];

// Reopening Customize returns to the tab used last (this session).
let lastTab: TabId = 'layout';

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
  const spacingScale = useResumeStore((s) => s.spacingScale);
  const setSpacingScale = useResumeStore((s) => s.setSpacingScale);
  const gaps = useResumeStore((s) => s.gaps);
  const setGap = useResumeStore((s) => s.setGap);
  const resetGaps = useResumeStore((s) => s.resetGaps);
  const qrTarget = useResumeStore((s) => s.qrTarget);
  const setQrTarget = useResumeStore((s) => s.setQrTarget);
  const dateFormat = useResumeStore((s) => s.dateFormat);
  const setDateFormat = useResumeStore((s) => s.setDateFormat);
  const themeColor = (themes.find((t) => t.name === currentTheme) ?? themes[0]).color;
  const customTemplates = useResumeStore((s) => s.customTemplates);
  const saveTemplate = useResumeStore((s) => s.saveTemplate);
  const applyTemplate = useResumeStore((s) => s.applyTemplate);
  const deleteTemplate = useResumeStore((s) => s.deleteTemplate);
  const [naming, setNaming] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const commitTemplate = () => {
    saveTemplate(templateName || `${layoutLabels[currentLayout]} (custom)`);
    setTemplateName('');
    setNaming(false);
  };

  const layoutGroups = [
    { label: 'ATS-friendly', items: layouts.filter((l) => ATS_LAYOUTS.has(l)) },
    { label: 'Designed', items: layouts.filter((l) => !ATS_LAYOUTS.has(l)) },
  ];

  const [tab, setTab] = useState<TabId>(lastTab);
  const selectTab = (id: TabId) => {
    lastTab = id;
    setTab(id);
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next =
      e.key === 'ArrowRight' ? (i + 1) % TABS.length
      : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TABS.length - 1
      : -1;
    if (next === -1) return;
    e.preventDefault();
    selectTab(TABS[next].id);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const layoutPanel = (
    <>
      <div className="layout-picker">
        {layoutGroups.map((group) => (
          <div key={group.label} role="group" aria-label={group.label}>
            <p className="layout-picker__group">{group.label}</p>
            <div className="layout-card-grid">
              {group.items.map((layout) => (
                <button
                  key={layout}
                  onClick={() => setLayout(layout)}
                  className={`layout-card-btn ${currentLayout === layout ? 'active' : ''}`}
                  aria-pressed={currentLayout === layout}
                  title={layoutHints[layout]}
                >
                  {layoutLabels[layout]}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="layout-picker__hint">{layoutHints[currentLayout]}</p>
      </div>

      {/* My templates — save the current look by name, reapply anywhere */}
      <div className="customizer-group">
        <p className="customizer-group__title">
          <Bookmark size={12} /> My templates
        </p>
        <div className="my-templates">
          {customTemplates.map((t) => (
            <span key={t.id} className="my-templates__chip">
              <button
                type="button"
                className="my-templates__apply"
                onClick={() => applyTemplate(t.id)}
                title={`Apply "${t.name}" (${layoutLabels[t.style.layout]})`}
              >
                {t.name}
              </button>
              <button
                type="button"
                className="my-templates__delete"
                onClick={() => deleteTemplate(t.id)}
                aria-label={`Delete template ${t.name}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {naming ? (
            <form
              className="my-templates__form"
              onSubmit={(e) => {
                e.preventDefault();
                commitTemplate();
              }}
            >
              <input
                className="form-input"
                aria-label="Template name"
                placeholder={`${layoutLabels[currentLayout]} (custom)`}
                value={templateName}
                autoFocus
                maxLength={40}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation();
                    setNaming(false);
                  }
                }}
              />
              <button type="submit" className="layout-card-btn active">
                Save
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="layout-card-btn my-templates__add"
              onClick={() => setNaming(true)}
              title="Save layout, font, size, spacing, color and sections as your own template"
            >
              <Plus size={12} /> Save current style
            </button>
          )}
        </div>
      </div>
    </>
  );

  const textPanel = (
    <>
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

      <RangeRow
        id="font-scale"
        icon={<Type size={12} />}
        label="Size"
        min={0.8}
        max={1.25}
        value={fontScale}
        onChange={setFontScale}
        resetTitle="Reset to 100%"
      />

      <RangeRow
        id="spacing-scale"
        icon={<MoveVertical size={12} />}
        label="Spacing"
        min={0.7}
        max={1.4}
        value={spacingScale}
        onChange={setSpacingScale}
        resetTitle="Reset to 100%"
      />

      {/* Section spacing — each gap on its own slider, 0% (none) to 200% */}
      <div className="section-spacing">
        <div className="section-spacing__head">
          <span className="control-label">Section spacing</span>
          <button
            type="button"
            className="section-spacing__reset"
            onClick={resetGaps}
            disabled={GAP_ROWS.every((r) => gaps[r.key] === 1)}
          >
            Reset
          </button>
        </div>
        {GAP_ROWS.map((row) => (
          <RangeRow
            key={row.key}
            id={`gap-${row.key}`}
            label={row.label}
            title={row.hint}
            min={GAP_MIN}
            max={GAP_MAX}
            value={gaps[row.key]}
            onChange={(v) => setGap(row.key, v)}
            resetTitle="Reset to layout default"
          />
        ))}
      </div>
    </>
  );

  const stylePanel = (
    <>
      <div className="compact-row">
        <div className="control-label-wrapper">
          <Palette size={12} />
          <span className="control-label">Color</span>
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

      <div className="compact-row">
        <label className="control-label-wrapper" htmlFor="date-format">
          <CalendarDays size={12} />
          <span className="control-label">Dates</span>
        </label>
        <div className="mini-select-wrapper">
          <select
            id="date-format"
            className="mini-select"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as DateFormat)}
          >
            <option value="short">Jul 2022</option>
            <option value="numeric">07/2022</option>
          </select>
          <ChevronDown className="mini-select-chevron" size={14} />
        </div>
      </div>
    </>
  );

  const panels: Record<TabId, React.ReactNode> = {
    layout: layoutPanel,
    sections: <SectionOrganizer />,
    text: textPanel,
    style: stylePanel,
  };

  return (
    <div className="cv-customizer compact">
      <div className="customizer-tabs" role="tablist" aria-label="Customize" onKeyDown={onTabKeyDown}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`customize-tab-${id}`}
            aria-selected={tab === id}
            aria-controls="customize-panel"
            tabIndex={tab === id ? 0 : -1}
            className={`customizer-tabs__tab ${tab === id ? 'is-active' : ''}`}
            onClick={() => selectTab(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div
        id="customize-panel"
        role="tabpanel"
        aria-labelledby={`customize-tab-${tab}`}
        className="customizer-panel"
        tabIndex={0}
      >
        {panels[tab]}
      </div>
    </div>
  );
};

export default CVCustomizer;

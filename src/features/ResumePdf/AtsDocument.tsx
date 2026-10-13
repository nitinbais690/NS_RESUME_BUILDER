import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { ContactInfo, ResumeData, ResumeField, ResumeStyle, SpacingGaps } from '../../types';
import { stripBulletMarker } from '../../lib/bulletLint';
import { splitEmphasis, splitSkillLabel } from '../../lib/emphasis';
import { displayRange } from '../../lib/dates';
import { profileHandle, withProtocol } from '../../lib/links';
import { LAYOUT_CONFIG, orderSections, sectionTitle } from '../ResumeTemplate/layoutConfig';

/**
 * ATS-safe resume as a real PDF: selectable text in reading order, standard
 * Helvetica, single column, and entries that never split across pages.
 * Follows LAYOUT_CONFIG.ats in the user's section order and headings.
 */
const makeStyles = (scale: number, spacing: number, gaps: SpacingGaps) => {
  const fs = (n: number) => n * scale;
  const sp = (n: number) => n * spacing;
  return StyleSheet.create({
    page: {
      paddingVertical: sp(28),
      paddingHorizontal: sp(28),
      fontFamily: 'Helvetica',
      fontSize: fs(9),
      lineHeight: 1.3,
      color: '#111111',
    },
    // Name and title share one line: "Alex Johnson | Senior Engineer".
    name: { fontSize: fs(16), fontFamily: 'Helvetica-Bold', lineHeight: 1.15 },
    position: { fontSize: fs(10.5), fontFamily: 'Helvetica' },
    separator: { color: '#888888' },
    contact: { marginTop: 2, fontSize: fs(9) },
    sectionTitle: {
      marginTop: sp(7) * gaps.section,
      marginBottom: sp(3) * gaps.heading,
      paddingBottom: 1,
      fontSize: fs(10),
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 0.75,
      borderBottomColor: '#111111',
    },
    entry: { marginBottom: sp(4) * gaps.entry },
    entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
    entryTitle: { fontFamily: 'Helvetica-Bold', flexShrink: 1, paddingRight: 8 },
    entrySubInline: { fontFamily: 'Helvetica-Oblique' },
    entryDate: {},
    bullet: { flexDirection: 'row' },
    bulletDot: { width: 10 },
    bulletText: { flex: 1 },
    tech: { marginTop: 2, color: '#333333' },
    link: { color: '#111111', textDecoration: 'none' },
    bold: { fontFamily: 'Helvetica-Bold' },
  });
};

type Styles = ReturnType<typeof makeStyles>;

const lines = (text: string) =>
  text
    .split('\n')
    .map(stripBulletMarker)
    .filter(Boolean);

/** Text runs with "**bold**" set in Helvetica-Bold. */
const Rich: React.FC<{ text: string; s: Styles }> = ({ text, s }) => (
  <>
    {splitEmphasis(text).map((part, i) =>
      part.bold ? (
        <Text key={i} style={s.bold}>
          {part.text}
        </Text>
      ) : (
        part.text
      ),
    )}
  </>
);

const Bullets: React.FC<{ items: string[]; s: Styles }> = ({ items, s }) => (
  <>
    {items.map((t, i) => (
      <View key={i} style={s.bullet}>
        <Text style={s.bulletDot}>•</Text>
        <Text style={s.bulletText}>
          <Rich text={t} s={s} />
        </Text>
      </View>
    ))}
  </>
);

/**
 * A titled section. The heading is glued to its first entry in an unbreakable
 * block, so a heading is never stranded alone at the bottom of a page.
 */
const Section: React.FC<{ title: string; s: Styles; children: React.ReactNode }> = ({ title, s, children }) => {
  const [first, ...rest] = React.Children.toArray(children);
  return (
    <View>
      <View wrap={false}>
        <Text style={s.sectionTitle}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
};

export const AtsDocument: React.FC<{ data: ResumeData; style: ResumeStyle }> = ({ data, style }) => {
  const s = makeStyles(style.fontScale, style.spacingScale, style.gaps);
  const c = data[ResumeField.CONTACT];
  // Profiles show just the user name ("LinkedIn: alex-j") and link to the page.
  const profile = (label: string, v?: string) =>
    v?.trim() ? (
      <Link src={withProtocol(v)} style={s.link}>
        {label}: {profileHandle(v)}
      </Link>
    ) : null;
  const contact = [
    c[ContactInfo.EMAIL]?.trim(),
    c[ContactInfo.PHONE]?.trim(),
    profile('LinkedIn', c[ContactInfo.LINKEDIN]),
    profile('GitHub', c[ContactInfo.GITHUB]),
    c[ContactInfo.LOCATION]?.trim(),
  ].filter(Boolean);
  const impacts = data[ResumeField.KEY_IMPACT].filter((t) => t.trim());
  const skills = data[ResumeField.SKILLS].filter((t) => t.trim());
  const tools = data[ResumeField.TOOLS].filter((t) => t.trim());
  const languages = data[ResumeField.LANGUAGES].filter((l) => l.name.trim());
  // Sections switched off in the editor are left out of the PDF too.
  const show = (field: ResumeField) => !style.hiddenSections.includes(field);
  // Same headings as the ATS layout on screen, including the user's renames.
  const title = (field: ResumeField) => sectionTitle(LAYOUT_CONFIG.ats, style, field);

  const sections: Partial<Record<ResumeField, React.ReactNode>> = {
    [ResumeField.ABOUT_ME]: !!data[ResumeField.ABOUT_ME].trim() && (
      <Section title={title(ResumeField.ABOUT_ME)} s={s}>
        <Text>
          <Rich text={data[ResumeField.ABOUT_ME].trim()} s={s} />
        </Text>
      </Section>
    ),
    [ResumeField.KEY_IMPACT]: impacts.length > 0 && (
      <Section title={title(ResumeField.KEY_IMPACT)} s={s}>
        <Bullets items={impacts} s={s} />
      </Section>
    ),
    [ResumeField.EXPERIENCE]: data[ResumeField.EXPERIENCE].length > 0 && (
      <Section title={title(ResumeField.EXPERIENCE)} s={s}>
        {data[ResumeField.EXPERIENCE].map((e) => (
          <View key={e.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>
                {e.title}
                {!!e.company && <Text style={s.entrySubInline}> — {e.company}</Text>}
              </Text>
              <Text style={s.entryDate}>{displayRange(e, style.dateFormat)}</Text>
            </View>
            <Bullets items={lines(e.desc)} s={s} />
            {e.technologies.length > 0 && (
              <Text style={s.tech}>Technologies: {e.technologies.join(', ')}</Text>
            )}
          </View>
        ))}
      </Section>
    ),
    [ResumeField.PROJECTS]: data[ResumeField.PROJECTS].length > 0 && (
      <Section title={title(ResumeField.PROJECTS)} s={s}>
        {data[ResumeField.PROJECTS].map((p) => (
          <View key={p.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>{p.name}</Text>
              {!!p.link && (
                <Link src={p.link.startsWith('http') ? p.link : `https://${p.link}`} style={s.link}>
                  {p.link.replace(/^https?:\/\//, '')}
                </Link>
              )}
            </View>
            <Bullets items={lines(p.desc)} s={s} />
            {p.technologies.length > 0 && (
              <Text style={s.tech}>Technologies: {p.technologies.join(', ')}</Text>
            )}
          </View>
        ))}
      </Section>
    ),
    [ResumeField.VOLUNTEERING]: data[ResumeField.VOLUNTEERING].length > 0 && (
      <Section title={title(ResumeField.VOLUNTEERING)} s={s}>
        {data[ResumeField.VOLUNTEERING].map((v) => (
          <View key={v.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>
                {v.role}
                {!!v.org && <Text style={s.entrySubInline}> — {v.org}</Text>}
              </Text>
              <Text style={s.entryDate}>{displayRange(v, style.dateFormat)}</Text>
            </View>
            <Bullets items={lines(v.desc)} s={s} />
          </View>
        ))}
      </Section>
    ),
    [ResumeField.SKILLS]: skills.length > 0 && (
      <Section title={title(ResumeField.SKILLS)} s={s}>
        {skills.some(splitSkillLabel) ? (
          skills.map((skill, i) => {
            const row = splitSkillLabel(skill);
            return (
              <Text key={i}>
                {row ? (
                  <>
                    <Text style={s.bold}>{row.label}: </Text>
                    {row.items}
                  </>
                ) : (
                  skill
                )}
              </Text>
            );
          })
        ) : (
          <Text>{skills.join(', ')}</Text>
        )}
      </Section>
    ),
    [ResumeField.TOOLS]: tools.length > 0 && (
      <Section title={title(ResumeField.TOOLS)} s={s}>
        <Text>{tools.join(', ')}</Text>
      </Section>
    ),
    [ResumeField.EDUCATION]: data[ResumeField.EDUCATION].length > 0 && (
      <Section title={title(ResumeField.EDUCATION)} s={s}>
        {data[ResumeField.EDUCATION].map((e) => (
          <View key={e.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>
                {e.degree}
                {!!e.school && <Text style={s.entrySubInline}>, {e.school}</Text>}
              </Text>
              <Text style={s.entryDate}>{[e.score, e.year].filter(Boolean).join('  ')}</Text>
            </View>
          </View>
        ))}
      </Section>
    ),
    [ResumeField.CERTIFICATIONS]: data[ResumeField.CERTIFICATIONS].length > 0 && (
      <Section title={title(ResumeField.CERTIFICATIONS)} s={s}>
        {data[ResumeField.CERTIFICATIONS].map((x) => (
          <View key={x.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>
                {x.name}
                {!!x.issuer && <Text style={s.entrySubInline}>, {x.issuer}</Text>}
              </Text>
              <Text style={s.entryDate}>{x.date}</Text>
            </View>
            {!!x.desc && <Text>{x.desc}</Text>}
          </View>
        ))}
      </Section>
    ),
    [ResumeField.AWARDS]: data[ResumeField.AWARDS].length > 0 && (
      <Section title={title(ResumeField.AWARDS)} s={s}>
        {data[ResumeField.AWARDS].map((a) => (
          <View key={a.id} style={s.entry} wrap={false}>
            <View style={s.entryHead}>
              <Text style={s.entryTitle}>
                {a.title}
                {!!a.issuer && <Text style={s.entrySubInline}>, {a.issuer}</Text>}
              </Text>
              <Text style={s.entryDate}>{a.date}</Text>
            </View>
            {!!a.desc && <Text>{a.desc}</Text>}
          </View>
        ))}
      </Section>
    ),
    [ResumeField.LANGUAGES]: languages.length > 0 && (
      <Section title={title(ResumeField.LANGUAGES)} s={s}>
        <Text>{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</Text>
      </Section>
    ),
  };

  return (
    <Document title={`${c[ContactInfo.NAME] || 'Resume'} — Resume`} author={c[ContactInfo.NAME]} creator="NS Studio">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>
          {c[ContactInfo.NAME]}
          {!!c[ContactInfo.POSITION] && (
            <Text style={s.position}>
              <Text style={s.separator}>{'  |  '}</Text>
              {c[ContactInfo.POSITION]}
            </Text>
          )}
        </Text>
        {contact.length > 0 && (
          <Text style={s.contact}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && '  |  '}
                {item}
              </React.Fragment>
            ))}
          </Text>
        )}

        {orderSections(LAYOUT_CONFIG.ats.right, style.sectionOrder)
          .filter(show)
          .map((field) => sections[field] && <React.Fragment key={field}>{sections[field]}</React.Fragment>)}
      </Page>
    </Document>
  );
};

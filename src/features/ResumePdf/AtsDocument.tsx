import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { ContactInfo, ResumeData, ResumeField, ResumeStyle } from '../../types';
import { stripBulletMarker } from '../../lib/bulletLint';

/**
 * ATS-safe resume as a real PDF: selectable text in reading order, standard
 * Helvetica, single column, and entries that never split across pages.
 * Mirrors LAYOUT_CONFIG.ats section order.
 */
const makeStyles = (scale: number, spacing: number) => {
  const fs = (n: number) => n * scale;
  const sp = (n: number) => n * spacing;
  return StyleSheet.create({
    page: {
      paddingVertical: sp(30),
      paddingHorizontal: sp(38),
      fontFamily: 'Helvetica',
      fontSize: fs(9.5),
      lineHeight: 1.3,
      color: '#111111',
    },
    name: { fontSize: fs(19), fontFamily: 'Helvetica-Bold', lineHeight: 1.2 },
    position: { fontSize: fs(11.5), lineHeight: 1.3, marginTop: 4 },
    contact: { marginTop: sp(6), fontSize: fs(9.5), color: '#333333' },
    rule: { borderBottomWidth: 1, borderBottomColor: '#111111', marginTop: sp(8) },
    sectionTitle: {
      marginTop: sp(10),
      marginBottom: sp(4),
      paddingBottom: 2,
      fontSize: fs(11),
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 0.75,
      borderBottomColor: '#111111',
    },
    entry: { marginBottom: sp(6) },
    entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
    entryTitle: { fontFamily: 'Helvetica-Bold', flexShrink: 1, paddingRight: 8 },
    entryDate: { color: '#333333' },
    entrySub: { color: '#333333' },
    bullet: { flexDirection: 'row', marginTop: sp(1) },
    bulletDot: { width: 10 },
    bulletText: { flex: 1 },
    tech: { marginTop: 2, color: '#333333' },
    link: { color: '#111111', textDecoration: 'none' },
  });
};

type Styles = ReturnType<typeof makeStyles>;

const lines = (text: string) =>
  text
    .split('\n')
    .map(stripBulletMarker)
    .filter(Boolean);

const Bullets: React.FC<{ items: string[]; s: Styles }> = ({ items, s }) => (
  <>
    {items.map((t, i) => (
      <View key={i} style={s.bullet}>
        <Text style={s.bulletDot}>•</Text>
        <Text style={s.bulletText}>{t}</Text>
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
  const s = makeStyles(style.fontScale, style.spacingScale);
  const c = data[ResumeField.CONTACT];
  const contact = [
    c[ContactInfo.EMAIL],
    c[ContactInfo.PHONE],
    c[ContactInfo.LINKEDIN],
    c[ContactInfo.GITHUB],
    c[ContactInfo.LOCATION],
  ].filter((v) => v?.trim());
  const impacts = data[ResumeField.KEY_IMPACT].filter((t) => t.trim());
  const skills = data[ResumeField.SKILLS].filter((t) => t.trim());
  const tools = data[ResumeField.TOOLS].filter((t) => t.trim());
  const languages = data[ResumeField.LANGUAGES].filter((l) => l.name.trim());
  // Sections switched off in the editor are left out of the PDF too.
  const show = (field: ResumeField) => !style.hiddenSections.includes(field);

  return (
    <Document title={`${c[ContactInfo.NAME] || 'Resume'} — Resume`} author={c[ContactInfo.NAME]} creator="NS Studio">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{c[ContactInfo.NAME]}</Text>
        {!!c[ContactInfo.POSITION] && <Text style={s.position}>{c[ContactInfo.POSITION]}</Text>}
        {contact.length > 0 && <Text style={s.contact}>{contact.join('  |  ')}</Text>}
        <View style={s.rule} />

        {show(ResumeField.ABOUT_ME) && !!data[ResumeField.ABOUT_ME].trim() && (
          <Section title="Summary" s={s}>
            <Text>{data[ResumeField.ABOUT_ME].trim()}</Text>
          </Section>
        )}

        {show(ResumeField.KEY_IMPACT) && impacts.length > 0 && (
          <Section title="Key Impact" s={s}>
            <Bullets items={impacts} s={s} />
          </Section>
        )}

        {show(ResumeField.EXPERIENCE) && data[ResumeField.EXPERIENCE].length > 0 && (
          <Section title="Experience" s={s}>
            {data[ResumeField.EXPERIENCE].map((e) => (
              <View key={e.id} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{e.title}</Text>
                  <Text style={s.entryDate}>{e.date}</Text>
                </View>
                {!!e.company && <Text style={s.entrySub}>{e.company}</Text>}
                <Bullets items={lines(e.desc)} s={s} />
                {e.technologies.length > 0 && (
                  <Text style={s.tech}>Technologies: {e.technologies.join(', ')}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {show(ResumeField.PROJECTS) && data[ResumeField.PROJECTS].length > 0 && (
          <Section title="Projects" s={s}>
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
        )}

        {show(ResumeField.VOLUNTEERING) && data[ResumeField.VOLUNTEERING].length > 0 && (
          <Section title="Volunteering" s={s}>
            {data[ResumeField.VOLUNTEERING].map((v) => (
              <View key={v.id} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{v.role}</Text>
                  <Text style={s.entryDate}>{v.date}</Text>
                </View>
                {!!v.org && <Text style={s.entrySub}>{v.org}</Text>}
                <Bullets items={lines(v.desc)} s={s} />
              </View>
            ))}
          </Section>
        )}

        {show(ResumeField.SKILLS) && skills.length > 0 && (
          <Section title="Skills" s={s}>
            <Text>{skills.join(', ')}</Text>
          </Section>
        )}

        {show(ResumeField.TOOLS) && tools.length > 0 && (
          <Section title="Tools" s={s}>
            <Text>{tools.join(', ')}</Text>
          </Section>
        )}

        {show(ResumeField.EDUCATION) && data[ResumeField.EDUCATION].length > 0 && (
          <Section title="Education" s={s}>
            {data[ResumeField.EDUCATION].map((e) => (
              <View key={e.id} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{e.degree}</Text>
                  <Text style={s.entryDate}>{e.year}</Text>
                </View>
                <Text style={s.entrySub}>
                  {[e.school, e.score].filter(Boolean).join(' · ')}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {show(ResumeField.CERTIFICATIONS) && data[ResumeField.CERTIFICATIONS].length > 0 && (
          <Section title="Certifications" s={s}>
            {data[ResumeField.CERTIFICATIONS].map((x) => (
              <View key={x.id} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{x.name}</Text>
                  <Text style={s.entryDate}>{x.date}</Text>
                </View>
                {!!x.issuer && <Text style={s.entrySub}>{x.issuer}</Text>}
              </View>
            ))}
          </Section>
        )}
        {show(ResumeField.AWARDS) && data[ResumeField.AWARDS].length > 0 && (
          <Section title="Awards" s={s}>
            {data[ResumeField.AWARDS].map((a) => (
              <View key={a.id} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{a.title}</Text>
                  <Text style={s.entryDate}>{a.date}</Text>
                </View>
                {!!a.issuer && <Text style={s.entrySub}>{a.issuer}</Text>}
                {!!a.desc && <Text>{a.desc}</Text>}
              </View>
            ))}
          </Section>
        )}

        {show(ResumeField.LANGUAGES) && languages.length > 0 && (
          <Section title="Languages" s={s}>
            <Text>{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</Text>
          </Section>
        )}
      </Page>
    </Document>
  );
};

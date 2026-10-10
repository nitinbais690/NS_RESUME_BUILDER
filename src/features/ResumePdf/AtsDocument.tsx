import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { ContactInfo, ResumeData, ResumeField, ResumeStyle } from '../../types';
import { stripBulletMarker } from '../../lib/bulletLint';

/**
 * ATS-safe resume as a real PDF: selectable text in reading order, standard
 * Helvetica, single column, and entries that never split across pages.
 * Mirrors LAYOUT_CONFIG.ats section order.
 */
const makeStyles = (scale: number) => {
  const fs = (n: number) => n * scale;
  return StyleSheet.create({
    page: {
      paddingVertical: 30,
      paddingHorizontal: 38,
      fontFamily: 'Helvetica',
      fontSize: fs(9.5),
      lineHeight: 1.3,
      color: '#111111',
    },
    name: { fontSize: fs(19), fontFamily: 'Helvetica-Bold', lineHeight: 1.2 },
    position: { fontSize: fs(11.5), lineHeight: 1.3, marginTop: 4 },
    contact: { marginTop: 6, fontSize: fs(9.5), color: '#333333' },
    rule: { borderBottomWidth: 1, borderBottomColor: '#111111', marginTop: 8 },
    sectionTitle: {
      marginTop: 10,
      marginBottom: 4,
      paddingBottom: 2,
      fontSize: fs(11),
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 0.75,
      borderBottomColor: '#111111',
    },
    entry: { marginBottom: 6 },
    entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
    entryTitle: { fontFamily: 'Helvetica-Bold', flexShrink: 1, paddingRight: 8 },
    entryDate: { color: '#333333' },
    entrySub: { color: '#333333' },
    bullet: { flexDirection: 'row', marginTop: 1 },
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
  const s = makeStyles(style.fontScale);
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

  return (
    <Document title={`${c[ContactInfo.NAME] || 'Resume'} — Resume`} author={c[ContactInfo.NAME]} creator="NS Studio">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{c[ContactInfo.NAME]}</Text>
        {!!c[ContactInfo.POSITION] && <Text style={s.position}>{c[ContactInfo.POSITION]}</Text>}
        {contact.length > 0 && <Text style={s.contact}>{contact.join('  |  ')}</Text>}
        <View style={s.rule} />

        {!!data[ResumeField.ABOUT_ME].trim() && (
          <Section title="Summary" s={s}>
            <Text>{data[ResumeField.ABOUT_ME].trim()}</Text>
          </Section>
        )}

        {impacts.length > 0 && (
          <Section title="Key Impact" s={s}>
            <Bullets items={impacts} s={s} />
          </Section>
        )}

        {data[ResumeField.EXPERIENCE].length > 0 && (
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

        {data[ResumeField.PROJECTS].length > 0 && (
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

        {skills.length > 0 && (
          <Section title="Skills" s={s}>
            <Text>{skills.join(', ')}</Text>
          </Section>
        )}

        {tools.length > 0 && (
          <Section title="Tools" s={s}>
            <Text>{tools.join(', ')}</Text>
          </Section>
        )}

        {data[ResumeField.EDUCATION].length > 0 && (
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

        {data[ResumeField.CERTIFICATIONS].length > 0 && (
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
      </Page>
    </Document>
  );
};

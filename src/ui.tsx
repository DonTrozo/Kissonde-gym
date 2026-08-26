import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from './theme';

export function ScreenTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <View style={{ gap: 6, marginBottom: 18 }}>
    {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Text style={styles.sectionAction}>{action}</Text> : null}</View>;
}

export function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'danger' | 'info' }) {
  const bg = tone === 'success' ? '#173721' : tone === 'danger' ? '#3A1D1D' : tone === 'info' ? '#172A42' : '#2A261D';
  const fg = tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : tone === 'info' ? colors.info : colors.accent;
  return <View style={[styles.pill, { backgroundColor: bg }]}><Text style={[styles.pillText, { color: fg }]}>{children}</Text></View>;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primary, disabled && { opacity: .45 }, pressed && !disabled && { opacity: .82 }]}><Text style={styles.primaryText}>{label}</Text></Pressable>;
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.secondary, pressed && { opacity: .75 }]}><Text style={styles.secondaryText}>{label}</Text></Pressable>;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

export const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 120 },
  text: { color: colors.text },
  muted: { color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
});

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11, fontWeight: '800' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionAction: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  pillText: { fontSize: 11, fontWeight: '800' },
  primary: { backgroundColor: colors.accent, minHeight: 46, paddingHorizontal: 16, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#17120A', fontSize: 14, fontWeight: '900' },
  secondary: { minHeight: 44, paddingHorizontal: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  metric: { flex: 1, minWidth: 90, gap: 4 },
  metricValue: { color: colors.text, fontSize: 21, fontWeight: '900' },
  metricLabel: { color: colors.muted, fontSize: 11, lineHeight: 15 },
});

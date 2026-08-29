import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from './theme';

export function ScreenTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <View style={styles.titleWrap}>
    {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
  </View>;
}

export function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const palette = {
    default: { bg: colors.panel2, fg: colors.text },
    success: { bg: colors.successSoft, fg: colors.success },
    warning: { bg: colors.warningSoft, fg: colors.warning },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    info: { bg: colors.accentSoft, fg: colors.accentDark },
  }[tone];
  return <View style={[styles.pill, { backgroundColor: palette.bg }]}><Text style={[styles.pillText, { color: palette.fg }]}>{children}</Text></View>;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primary, disabled && styles.disabled, pressed && !disabled && styles.primaryPressed]}><Text style={styles.primaryText}>{label}</Text></Pressable>;
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}><Text style={styles.secondaryText}>{label}</Text></Pressable>;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

export const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 124 },
  text: { color: colors.text },
  muted: { color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
});

const styles = StyleSheet.create({
  titleWrap: { gap: 7, marginBottom: 20, maxWidth: 560 },
  eyebrow: { color: colors.accent, textTransform: 'uppercase', letterSpacing: 1.35, fontSize: 11, fontWeight: '900' },
  title: { color: colors.text, fontSize: 31, lineHeight: 35, fontWeight: '900', letterSpacing: -1.05 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, maxWidth: 520 },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: '#E5EBF0',
    borderRadius: radius.lg,
    padding: 17,
    shadowColor: '#2F4D66',
    shadowOpacity: .055,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 11, minHeight: 24 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900', letterSpacing: -.25 },
  sectionAction: { color: colors.accent, fontSize: 12, fontWeight: '800' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  pillText: { fontSize: 11, fontWeight: '900', letterSpacing: .1 },
  primary: { backgroundColor: colors.accent, minHeight: 50, paddingHorizontal: 18, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', shadowColor: colors.accentDark, shadowOpacity: .16, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  primaryPressed: { backgroundColor: colors.accentDark, transform: [{ scale: .995 }] },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: '900', letterSpacing: .1 },
  disabled: { opacity: .42, shadowOpacity: 0 },
  secondary: { minHeight: 48, paddingHorizontal: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  secondaryPressed: { backgroundColor: colors.panel2 },
  secondaryText: { color: colors.accentDark, fontSize: 14, fontWeight: '900' },
  metric: { flex: 1, minWidth: 82, gap: 4 },
  metricValue: { color: colors.text, fontSize: 22, lineHeight: 25, fontWeight: '900', letterSpacing: -.4 },
  metricLabel: { color: colors.muted, fontSize: 11, lineHeight: 15, fontWeight: '600' },
});

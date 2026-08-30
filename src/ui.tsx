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
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  text: { color: colors.text },
  muted: { color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
});

const styles = StyleSheet.create({
  titleWrap: { gap: 5, marginBottom: 16, maxWidth: 560 },
  eyebrow: { color: colors.accent, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 10, lineHeight: 14, fontWeight: '900' },
  title: { color: colors.text, fontSize: 29, lineHeight: 33, fontWeight: '900', letterSpacing: -.9 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, maxWidth: 520 },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: '#E5EBF0',
    borderRadius: radius.lg,
    padding: 15,
    shadowColor: '#2F4D66',
    shadowOpacity: .045,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 9, minHeight: 22 },
  sectionTitle: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900', letterSpacing: -.2 },
  sectionAction: { color: colors.accent, fontSize: 11, lineHeight: 16, fontWeight: '800' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  pillText: { fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: .05 },
  primary: { backgroundColor: colors.accent, minHeight: 48, paddingHorizontal: 16, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', shadowColor: colors.accentDark, shadowOpacity: .13, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  primaryPressed: { backgroundColor: colors.accentDark, transform: [{ scale: .995 }] },
  primaryText: { color: colors.white, fontSize: 13, lineHeight: 18, fontWeight: '900', letterSpacing: .05 },
  disabled: { opacity: .42, shadowOpacity: 0 },
  secondary: { minHeight: 46, paddingHorizontal: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  secondaryPressed: { backgroundColor: colors.panel2 },
  secondaryText: { color: colors.accentDark, fontSize: 13, lineHeight: 18, fontWeight: '900' },
  metric: { flex: 1, minWidth: 76, gap: 3 },
  metricValue: { color: colors.text, fontSize: 20, lineHeight: 23, fontWeight: '900', letterSpacing: -.35 },
  metricLabel: { color: colors.muted, fontSize: 10, lineHeight: 14, fontWeight: '600' },
});

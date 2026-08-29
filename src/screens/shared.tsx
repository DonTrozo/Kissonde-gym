import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseStyles } from '../ui';
import { colors, radius } from '../theme';

export function Shell({ children }: { children: React.ReactNode }) {
  return <SafeAreaView edges={['top']} style={baseStyles.screen}>
    <ScrollView contentContainerStyle={baseStyles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView>
  </SafeAreaView>;
}

export const screenStyles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, minHeight: 48 },
  avatar: { width: 44, height: 44, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center', shadowColor: '#31536F', shadowOpacity: .06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardTitle: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900', letterSpacing: -.25 },
  muted: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  label: { color: colors.slateDark, fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: .65, textTransform: 'uppercase' },
  accentLabel: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.05, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.border },
  metricsRow: { flexDirection: 'row', gap: 14, marginTop: 10 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 15, fontSize: 15 },
  inputSmall: { minHeight: 44, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, borderRadius: radius.sm, color: colors.text, paddingHorizontal: 12, fontSize: 14 },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: '#DCE7F0', overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  empty: { paddingVertical: 28, paddingHorizontal: 12, alignItems: 'center', gap: 7 },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <View style={screenStyles.empty}><Text style={screenStyles.emptyTitle}>{title}</Text><Text style={screenStyles.emptyText}>{text}</Text></View>;
}

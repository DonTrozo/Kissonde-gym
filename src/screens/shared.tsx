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
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardTitle: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 2 },
  label: { color: colors.muted, fontSize: 12, lineHeight: 16, fontWeight: '700' },
  accentLabel: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: .8 },
  divider: { height: 1, backgroundColor: colors.border },
  metricsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 14, fontSize: 15 },
  inputSmall: { minHeight: 44, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 12, fontSize: 14 },
  progressTrack: { height: 8, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  empty: { paddingVertical: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  emptyText: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <View style={screenStyles.empty}><Text style={screenStyles.emptyTitle}>{title}</Text><Text style={screenStyles.emptyText}>{text}</Text></View>;
}

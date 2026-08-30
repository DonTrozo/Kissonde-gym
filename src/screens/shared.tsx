import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseStyles } from '../ui';
import { colors, radius } from '../theme';

export function Shell({ children }: { children: React.ReactNode }) {
  return <SafeAreaView edges={['top']} style={baseStyles.screen}>
    <ScrollView
      contentContainerStyle={baseStyles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
    >{children}</ScrollView>
  </SafeAreaView>;
}

export const screenStyles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, minHeight: 44 },
  avatar: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center', shadowColor: '#31536F', shadowOpacity: .05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardTitle: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: '900', letterSpacing: -.2 },
  muted: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 2 },
  label: { color: colors.slateDark, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: .6, textTransform: 'uppercase' },
  accentLabel: { color: colors.accent, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: .95, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.border },
  metricsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 14, fontSize: 14 },
  inputSmall: { minHeight: 42, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, borderRadius: radius.sm, color: colors.text, paddingHorizontal: 11, fontSize: 13 },
  progressTrack: { height: 6, borderRadius: 99, backgroundColor: '#DCE7F0', overflow: 'hidden', marginTop: 13 },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  empty: { paddingVertical: 22, paddingHorizontal: 10, alignItems: 'center', gap: 5 },
  emptyTitle: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900' },
  emptyText: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
});

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <View style={screenStyles.empty}><Text style={screenStyles.emptyTitle}>{title}</Text><Text style={screenStyles.emptyText}>{text}</Text></View>;
}

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from './theme';

export function LoadingState({ label = 'A carregar…' }: { label?: string }) {
  return <View style={styles.state}><ActivityIndicator color={colors.accent} /><Text style={styles.title}>{label}</Text><Text style={styles.text}>Mantém esta página aberta enquanto atualizamos a informação.</Text></View>;
}

export function ErrorState({ title = 'Não foi possível atualizar', text = 'Tenta novamente. Se o problema continuar, o pedido pode ser acompanhado pelo suporte.', onRetry }: { title?: string; text?: string; onRetry?: () => void }) {
  return <View style={styles.state}><View style={styles.errorIcon}><Ionicons name="alert-circle-outline" size={22} color={colors.danger} /></View><Text style={styles.title}>{title}</Text><Text style={styles.text}>{text}</Text>{onRetry ? <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Tentar novamente</Text></Pressable> : null}</View>;
}

export function OfflineNotice({ text = 'Estás offline. O cartão de acesso e dados já guardados continuam disponíveis.' }: { text?: string }) {
  return <View style={styles.offline}><Ionicons name="cloud-offline-outline" size={17} color={colors.warning} /><Text style={styles.offlineText}>{text}</Text></View>;
}

export function EmptyCollection({ icon = 'file-tray-outline', title, text }: { icon?: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return <View style={styles.state}><View style={styles.emptyIcon}><Ionicons name={icon} size={22} color={colors.accentDark} /></View><Text style={styles.title}>{title}</Text><Text style={styles.text}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  state: { minHeight: 190, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg },
  title: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 10, textAlign: 'center' },
  text: { color: colors.muted, fontSize: 9, lineHeight: 15, textAlign: 'center', maxWidth: 320, marginTop: 4 },
  errorIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  retry: { minHeight: 40, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, marginTop: 13 },
  retryText: { color: colors.white, fontSize: 9, fontWeight: '900' },
  offline: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.warningSoft, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 10 },
  offlineText: { flex: 1, color: colors.warning, fontSize: 9, lineHeight: 14, fontWeight: '800' },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { demoNotifications } from '../product';
import { useAppState } from '../state';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { Shell } from './shared';

export function NotificationsScreen() {
  const { readNotificationIds, markNotificationRead, markAllNotificationsRead } = useAppState();
  const unread = demoNotifications.filter(item => !readNotificationIds.includes(item.id)).length;

  return <Shell>
    <ScreenTitle eyebrow="Centro de atividade" title="Notificações" subtitle="Aulas, treino, recompensas, suporte e estado da adesão num único histórico." />
    <View style={styles.summary}><View><Text style={styles.summaryValue}>{unread}</Text><Text style={styles.summaryLabel}>por ler</Text></View>{unread > 0 ? <Pressable accessibilityRole="button" onPress={() => markAllNotificationsRead(demoNotifications.map(item => item.id))} style={styles.readAll}><Ionicons name="checkmark-done" size={16} color={colors.accentDark} /><Text style={styles.readAllText}>Marcar tudo como lido</Text></Pressable> : <Pill tone="success">Em dia</Pill>}</View>
    <SectionHeader title="Atividade recente" />
    <Card style={styles.list}>
      {demoNotifications.map((item, index) => {
        const read = readNotificationIds.includes(item.id);
        return <Pressable key={item.id} accessibilityRole="button" onPress={() => markNotificationRead(item.id)} style={[styles.row, index > 0 && styles.rowBorder]}>
          <View style={[styles.iconWrap, { backgroundColor: iconPalette(item.category).bg }]}><Ionicons name={iconPalette(item.category).icon} size={18} color={iconPalette(item.category).fg} /></View>
          <View style={{ flex: 1, minWidth: 0 }}><View style={styles.titleRow}><Text style={[styles.title, read && styles.titleRead]}>{item.title}</Text>{!read ? <View style={styles.unreadDot} /> : null}</View><Text style={styles.body}>{item.body}</Text><Text style={styles.time}>{item.time}</Text></View>
        </Pressable>;
      })}
    </Card>
  </Shell>;
}

function iconPalette(category: string): { icon: keyof typeof Ionicons.glyphMap; bg: string; fg: string } {
  if (category === 'class') return { icon: 'calendar-outline', bg: colors.accentSoft, fg: colors.accentDark };
  if (category === 'reward') return { icon: 'gift-outline', bg: '#F3ECFF', fg: '#6B4BB3' };
  if (category === 'membership') return { icon: 'card-outline', bg: colors.successSoft, fg: colors.success };
  if (category === 'support') return { icon: 'chatbubble-ellipses-outline', bg: colors.warningSoft, fg: colors.warning };
  return { icon: 'barbell-outline', bg: colors.panel2, fg: colors.slateDark };
}

const styles = StyleSheet.create({
  summary: { minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, backgroundColor: colors.accentDeep, borderRadius: radius.lg, paddingHorizontal: 17, paddingVertical: 14 },
  summaryValue: { color: colors.white, fontSize: 24, lineHeight: 28, fontWeight: '900' },
  summaryLabel: { color: '#A9D0E9', fontSize: 9, fontWeight: '800', marginTop: 2 },
  readAll: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 11, paddingVertical: 9 },
  readAllText: { color: colors.accentDark, fontSize: 9, fontWeight: '900' },
  list: { paddingVertical: 2 },
  row: { minHeight: 88, flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { color: colors.text, fontSize: 12, lineHeight: 17, fontWeight: '900', flexShrink: 1 },
  titleRead: { color: colors.muted },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  body: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 3 },
  time: { color: colors.slateDark, fontSize: 8, fontWeight: '800', marginTop: 6 },
});

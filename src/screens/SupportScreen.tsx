import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { member } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { EmptyState, Shell } from './shared';

const categories: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Não consigo entrar no ginásio', icon: 'key-outline' },
  { label: 'Pagamento ou mensalidade', icon: 'card-outline' },
  { label: 'Visita em falta', icon: 'scan-outline' },
  { label: 'Pontos/recompensa em falta', icon: 'diamond-outline' },
  { label: 'Problema com uma aula', icon: 'calendar-outline' },
  { label: 'Problema técnico na app', icon: 'phone-portrait-outline' },
];

export function SupportScreen() {
  const { supportTickets, createSupportTicket } = useAppState();

  const create = (category: string) => {
    const id = createSupportTicket(category);
    Alert.alert('Pedido criado', `Referência ${id}. O estado fica disponível nesta página.`);
  };

  return <Shell>
    <ScreenTitle eyebrow="Suporte" title="Ajuda sem perder o contexto." subtitle="Escolhe o problema e recebe uma referência para acompanhar o pedido até à resolução." />

    <View style={styles.supportHero}>
      <View style={styles.heroIcon}><Ionicons name="headset-outline" size={25} color={colors.accentDark} /></View>
      <View style={{ flex: 1 }}><Text style={styles.heroTitle}>Suporte associado à tua conta</Text><Text style={styles.heroText}>Membro {member.id} · {member.branch}</Text></View>
    </View>

    <SectionHeader title="Como podemos ajudar?" />
    <View style={styles.categoryGrid}>
      {categories.map(category => <Pressable accessibilityRole="button" key={category.label} onPress={() => create(category.label)} style={({ pressed }) => [styles.option, pressed && { opacity: .72 }]}>
        <View style={styles.optionIcon}><Ionicons name={category.icon} size={20} color={colors.accentDark} /></View>
        <Text style={styles.optionText}>{category.label}</Text>
        <Ionicons name="arrow-forward" size={17} color={colors.slate} />
      </Pressable>)}
    </View>

    <SectionHeader title="Os meus pedidos" action={supportTickets.length ? `${supportTickets.length}` : undefined} />
    {supportTickets.length === 0 ? <Card><EmptyState title="Nenhum pedido de suporte" text="Os pedidos criados ficam visíveis aqui com a referência e o respetivo estado." /></Card> : <Card style={styles.ticketCard}>
      {supportTickets.map((ticket, index) => <View key={ticket.id} style={[styles.ticketRow, index === supportTickets.length - 1 && { borderBottomWidth: 0 }]}>
        <View style={styles.ticketIcon}><Ionicons name="document-text-outline" size={17} color={colors.accentDark} /></View>
        <View style={{ flex: 1 }}><Text style={styles.ticketTitle}>{ticket.category}</Text><Text style={styles.ticketMeta}>{ticket.id} · Membro {member.id}</Text></View>
        <Pill tone={ticket.status === 'resolved' ? 'success' : ticket.status === 'in_review' ? 'info' : 'warning'}>{ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_review' ? 'Em análise' : 'Resolvido'}</Pill>
      </View>)}
    </Card>}
  </Shell>;
}

const styles = StyleSheet.create({
  supportHero: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.accentSoft, borderRadius: radius.lg, padding: 15, borderWidth: 1, borderColor: '#D7E8F4' },
  heroIcon: { width: 47, height: 47, borderRadius: 15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  heroText: { color: colors.muted, fontSize: 10, marginTop: 4 },
  categoryGrid: { gap: 8 },
  option: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 17, shadowColor: '#31536F', shadowOpacity: .035, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  optionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  optionText: { color: colors.text, fontSize: 12, fontWeight: '800', flex: 1 },
  ticketCard: { paddingVertical: 3 },
  ticketRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  ticketIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  ticketTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  ticketMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
});

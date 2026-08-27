import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { member } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { EmptyState, Shell, screenStyles as s } from './shared';

const categories = [
  'Não consigo entrar no ginásio',
  'Pagamento ou mensalidade',
  'Visita em falta',
  'Pontos/recompensa em falta',
  'Problema com uma aula',
  'Problema técnico na app',
];

export function SupportScreen() {
  const { supportTickets, createSupportTicket } = useAppState();

  const create = (category: string) => {
    const id = createSupportTicket(category);
    Alert.alert('Pedido criado', `Referência ${id}. O estado fica disponível nesta página.`);
  };

  return <Shell>
    <ScreenTitle eyebrow="Suporte" title="Ajuda com referência e estado." subtitle="Cada pedido fica associado ao teu número de membro para poderes acompanhar o que acontece." />

    <SectionHeader title="Criar pedido" />
    {categories.map(category => <Pressable accessibilityRole="button" key={category} onPress={() => create(category)} style={styles.option}><Text style={styles.optionText}>{category}</Text><Ionicons name="chevron-forward" size={20} color={colors.slate} /></Pressable>)}

    <SectionHeader title="Os meus pedidos" />
    {supportTickets.length === 0 ? <Card><EmptyState title="Nenhum pedido de suporte" text="Os pedidos criados ficam visíveis aqui com uma referência e estado." /></Card> : supportTickets.map(ticket => <Card key={ticket.id} style={{ marginBottom: 10 }}>
      <View style={s.between}>
        <View style={{ flex: 1 }}><Text style={s.cardTitle}>{ticket.category}</Text><Text style={s.muted}>{ticket.id} · Membro {member.id}</Text></View>
        <Pill tone={ticket.status === 'resolved' ? 'success' : ticket.status === 'in_review' ? 'info' : 'warning'}>{ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_review' ? 'Em análise' : 'Resolvido'}</Pill>
      </View>
    </Card>)}
  </Shell>;
}

const styles = StyleSheet.create({
  option: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, marginBottom: 8, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  optionText: { color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
});

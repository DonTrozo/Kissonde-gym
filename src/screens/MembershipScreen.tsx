import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { member } from '../domain';
import { colors, radius } from '../theme';
import { useAppState } from '../state';
import { Card, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { Shell } from './shared';

const invoices = [
  { id: 'INV-0826', month: 'Agosto 2026', amount: 'Kz 28 500', status: 'Pago' },
  { id: 'INV-0726', month: 'Julho 2026', amount: 'Kz 28 500', status: 'Pago' },
  { id: 'INV-0626', month: 'Junho 2026', amount: 'Kz 28 500', status: 'Pago' },
];

export function MembershipScreen() {
  const { membershipRequests, requestMembershipAction } = useAppState();

  const request = (type: 'freeze' | 'upgrade' | 'renewal' | 'invoice', title: string) => {
    const id = requestMembershipAction(type);
    Alert.alert(title, `Pedido ${id} criado localmente para a demonstração. Na versão ligada ao sistema Kissonde, este fluxo seguirá as regras reais da adesão.`);
  };

  return <Shell>
    <ScreenTitle eyebrow="Adesão & pagamentos" title="A tua mensalidade" subtitle="Plano, validade, histórico de cobrança e pedidos de alteração com estado visível." />

    <View style={styles.hero}><View style={styles.heroTop}><View><Text style={styles.heroEyebrow}>PLANO ATUAL</Text><Text style={styles.heroTitle}>{member.membership}</Text></View><Pill tone="success">{member.status}</Pill></View><Text style={styles.heroMeta}>Kissonde Viana · válido até {member.expiry}</Text><View style={styles.priceRow}><Text style={styles.price}>Kz 28 500</Text><Text style={styles.priceLabel}>/ mês · valor demonstrativo</Text></View></View>

    <SectionHeader title="Gestão da adesão" />
    <View style={styles.actionGrid}>
      <Action icon="snow-outline" title="Congelar" text="Pedir pausa temporária" onPress={() => request('freeze', 'Pedido de congelamento')} />
      <Action icon="arrow-up-circle-outline" title="Upgrade" text="Explorar plano superior" onPress={() => request('upgrade', 'Pedido de upgrade')} />
      <Action icon="refresh-outline" title="Renovar" text="Preparar renovação" onPress={() => request('renewal', 'Pedido de renovação')} />
      <Action icon="document-text-outline" title="Fatura" text="Pedir comprovativo" onPress={() => request('invoice', 'Pedido de fatura')} />
    </View>

    <SectionHeader title="Método de pagamento" />
    <Card style={styles.paymentCard}><View style={styles.paymentIcon}><Ionicons name="card-outline" size={20} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.paymentTitle}>Pagamento configurável</Text><Text style={styles.paymentMeta}>O fluxo visual está pronto. O método real será definido com Kissonde antes de ativar cobranças.</Text></View><Pill tone="info">Preparado</Pill></Card>

    <SectionHeader title="Histórico" />
    <Card style={styles.invoiceList}>{invoices.map((invoice, index) => <Pressable key={invoice.id} accessibilityRole="button" onPress={() => Alert.alert(invoice.month, `${invoice.amount} · ${invoice.status} · ${invoice.id}`)} style={[styles.invoiceRow, index > 0 && styles.rowBorder]}><View style={styles.invoiceIcon}><Ionicons name="receipt-outline" size={17} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.invoiceMonth}>{invoice.month}</Text><Text style={styles.invoiceId}>{invoice.id}</Text></View><View style={styles.invoiceRight}><Text style={styles.invoiceAmount}>{invoice.amount}</Text><Text style={styles.invoiceStatus}>{invoice.status}</Text></View></Pressable>)}</Card>

    {membershipRequests.length > 0 ? <><SectionHeader title="Pedidos recentes" /><Card style={styles.requestList}>{membershipRequests.slice(0, 4).map((item, index) => <View key={item.id} style={[styles.requestRow, index > 0 && styles.rowBorder]}><View style={styles.requestIcon}><Ionicons name="time-outline" size={16} color={colors.warning} /></View><View style={{ flex: 1 }}><Text style={styles.requestTitle}>{requestLabel(item.type)}</Text><Text style={styles.requestMeta}>{item.id}</Text></View><Pill tone="warning">Submetido</Pill></View>)}</Card></> : null}

    <View style={{ height: 18 }} /><SecondaryButton label="Contactar suporte sobre a adesão" onPress={() => request('invoice', 'Pedido de apoio')} />
  </Shell>;
}

function Action({ icon, title, text, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: .72 }]}><View style={styles.actionIcon}><Ionicons name={icon} size={19} color={colors.accentDark} /></View><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionText}>{text}</Text></Pressable>;
}

function requestLabel(type: string) {
  if (type === 'freeze') return 'Congelamento de adesão';
  if (type === 'upgrade') return 'Upgrade de plano';
  if (type === 'renewal') return 'Renovação';
  return 'Fatura / comprovativo';
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 19, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  heroEyebrow: { color: '#94BFDD', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 26, lineHeight: 30, fontWeight: '900', marginTop: 4 },
  heroMeta: { color: '#D0E5F3', fontSize: 10, marginTop: 7 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 22 },
  price: { color: colors.white, fontSize: 20, fontWeight: '900' },
  priceLabel: { color: '#9FC8E3', fontSize: 8, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  action: { flexGrow: 1, flexBasis: '46%', minHeight: 122, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 14 },
  actionIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: colors.text, fontSize: 12, fontWeight: '900', marginTop: 12 },
  actionText: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  paymentIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  paymentTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  paymentMeta: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
  invoiceList: { paddingVertical: 2 },
  invoiceRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  invoiceIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  invoiceMonth: { color: colors.text, fontSize: 11, fontWeight: '900' },
  invoiceId: { color: colors.slateDark, fontSize: 8, fontWeight: '700', marginTop: 2 },
  invoiceRight: { alignItems: 'flex-end' },
  invoiceAmount: { color: colors.text, fontSize: 10, fontWeight: '900' },
  invoiceStatus: { color: colors.success, fontSize: 8, fontWeight: '900', marginTop: 2 },
  requestList: { paddingVertical: 2 },
  requestRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  requestIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center' },
  requestTitle: { color: colors.text, fontSize: 10, fontWeight: '900' },
  requestMeta: { color: colors.muted, fontSize: 8, marginTop: 2 },
});

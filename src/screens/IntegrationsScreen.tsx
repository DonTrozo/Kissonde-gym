import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { integrationProviders } from '../product';
import { colors, radius } from '../theme';
import { useAppState } from '../state';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { Shell } from './shared';

export function IntegrationsScreen() {
  const { connectedIntegrations, toggleIntegration } = useAppState();
  const health = integrationProviders.filter(item => item.kind !== 'wallet');
  const wallet = integrationProviders.filter(item => item.kind === 'wallet');

  return <Shell>
    <ScreenTitle eyebrow="Ecossistema fitness" title="Apps e dispositivos" subtitle="A experiência está preparada para reconhecer atividade dentro e fora do ginásio. Nesta demonstração, as ligações são simuladas localmente; as credenciais reais serão configuradas no lançamento." />
    <View style={styles.demoNotice}><Ionicons name="information-circle-outline" size={18} color={colors.accentDark} /><Text style={styles.demoText}>Modo de demonstração: nenhum dado externo é transmitido.</Text><Pill tone="info">Demo</Pill></View>

    <SectionHeader title="Saúde e atividade" />
    <View style={styles.list}>{health.map(item => <IntegrationCard key={item.id} item={item} active={connectedIntegrations.includes(item.id)} onToggle={() => toggleIntegration(item.id)} />)}</View>

    <SectionHeader title="Cartão e relógio" />
    <View style={styles.list}>{wallet.map(item => <IntegrationCard key={item.id} item={item} active={connectedIntegrations.includes(item.id)} onToggle={() => toggleIntegration(item.id)} />)}</View>

    <SectionHeader title="Como entra nos objetivos" />
    <Card style={styles.ruleCard}>
      <Rule icon="business-outline" title="Visita Kissonde" text="Check-in verificado no clube continua a ser a referência principal." />
      <Rule icon="walk-outline" title="Atividade externa" text="Corrida, caminhada, ciclismo e treinos compatíveis podem contribuir para metas de atividade." />
      <Rule icon="shield-checkmark-outline" title="Só dados verificados" text="A arquitetura prevê origem, data e fornecedor de cada atividade para evitar pontos sem rastreabilidade." last />
    </Card>
  </Shell>;
}

function IntegrationCard({ item, active, onToggle }: { item: (typeof integrationProviders)[number]; active: boolean; onToggle: () => void }) {
  const perform = () => {
    onToggle();
    Alert.alert(active ? 'Demonstração desligada' : 'Demonstração ligada', active ? `${item.name} foi removido da pré-visualização.` : `${item.name} aparece agora como ligado apenas neste dispositivo de demonstração.`);
  };
  return <Card style={styles.card}>
    <View style={styles.cardTop}><View style={styles.icon}><Ionicons name={providerIcon(item.id)} size={21} color={colors.accentDark} /></View><View style={{ flex: 1, minWidth: 0 }}><Text style={styles.name}>{item.name}</Text><Text style={styles.platforms}>{item.platforms.join(' · ')}</Text></View><Pill tone={active ? 'success' : 'default'}>{active ? 'Ligado · demo' : 'Disponível'}</Pill></View>
    <Text style={styles.description}>{item.description}</Text>
    <Pressable accessibilityRole="button" onPress={perform} style={[styles.action, active && styles.actionActive]}><Ionicons name={active ? 'checkmark-circle' : 'link-outline'} size={16} color={active ? colors.success : colors.accentDark} /><Text style={[styles.actionText, active && { color: colors.success }]}>{active ? 'Desligar pré-visualização' : 'Pré-visualizar ligação'}</Text></Pressable>
  </Card>;
}

function Rule({ icon, title, text, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string; last?: boolean }) {
  return <View style={[styles.rule, last && { borderBottomWidth: 0 }]}><View style={styles.ruleIcon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.ruleTitle}>{title}</Text><Text style={styles.ruleText}>{text}</Text></View></View>;
}

function providerIcon(id: string): keyof typeof Ionicons.glyphMap {
  if (id.includes('wallet')) return 'wallet-outline';
  if (id === 'strava') return 'navigate-outline';
  if (id === 'garmin') return 'watch-outline';
  if (id === 'samsung-health') return 'heart-circle-outline';
  return 'fitness-outline';
}

const styles = StyleSheet.create({
  demoNotice: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.accentSoft, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 11 },
  demoText: { flex: 1, color: colors.accentDark, fontSize: 9, lineHeight: 14, fontWeight: '700' },
  list: { gap: 10 },
  card: { padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 13, fontWeight: '900' },
  platforms: { color: colors.slateDark, fontSize: 8, fontWeight: '800', marginTop: 3 },
  description: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 12 },
  action: { minHeight: 42, marginTop: 13, borderRadius: 12, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.panel },
  actionActive: { backgroundColor: colors.successSoft, borderColor: '#BEDDCB' },
  actionText: { color: colors.accentDark, fontSize: 10, fontWeight: '900' },
  ruleCard: { paddingVertical: 2 },
  rule: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12 },
  ruleIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  ruleTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  ruleText: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
});

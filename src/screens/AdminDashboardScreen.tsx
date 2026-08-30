import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminDemo } from '../product';
import { colors, radius } from '../theme';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { Shell } from './shared';

export function AdminDashboardScreen() {
  return <Shell>
    <ScreenTitle eyebrow="Kissonde Gestão" title="Visão operacional" subtitle="Demonstração executiva de como a mesma plataforma pode transformar atividade de membros em decisões para a gestão." />
    <View style={styles.demo}><Ionicons name="analytics-outline" size={18} color={colors.accentDark} /><Text style={styles.demoText}>Dados demonstrativos para apresentação. A ligação ao sistema real fica para a fase de backend.</Text><Pill tone="info">Demo</Pill></View>

    <View style={styles.hero}>
      <View style={styles.heroTop}><View><Text style={styles.heroEyebrow}>AGORA · KISSONDE VIANA</Text><Text style={styles.heroValue}>{adminDemo.insideNow}</Text><Text style={styles.heroLabel}>membros dentro do clube</Text></View><View style={styles.occupancy}><Text style={styles.occupancyValue}>{adminDemo.occupancy}%</Text><Text style={styles.occupancyLabel}>ocupação</Text></View></View>
      <View style={styles.heroTrack}><View style={[styles.heroFill, { width: `${adminDemo.occupancy}%` as any }]} /></View>
    </View>

    <SectionHeader title="Indicadores principais" />
    <View style={styles.metricGrid}>
      <Metric icon="people-outline" value={adminDemo.activeMembers.toLocaleString('pt-PT')} label="Membros ativos" />
      <Metric icon="enter-outline" value={adminDemo.visitsToday.toLocaleString('pt-PT')} label="Visitas hoje" />
      <Metric icon="repeat-outline" value={`${adminDemo.retention}%`} label="Retenção" />
      <Metric icon="gift-outline" value={adminDemo.rewardRedemptions.toLocaleString('pt-PT')} label="Prémios/mês" />
    </View>

    <SectionHeader title="Performance das aulas" action="Últimos 30 dias" />
    <Card style={styles.performanceCard}>{adminDemo.classPerformance.map((item, index) => <View key={item.name} style={[styles.performanceRow, index > 0 && styles.rowBorder]}><View style={styles.performanceTop}><Text style={styles.performanceName}>{item.name}</Text><Text style={styles.performanceValue}>{item.fill}% · {item.sessions} sessões</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${item.fill}%` as any }]} /></View></View>)}</Card>

    <SectionHeader title="Membros que precisam de atenção" />
    <Card style={styles.riskCard}>{adminDemo.riskSegments.map((item, index) => <View key={item.label} style={[styles.riskRow, index > 0 && styles.rowBorder]}><View style={styles.riskNumber}><Text style={styles.riskNumberText}>{item.members}</Text></View><View style={{ flex: 1 }}><Text style={styles.riskTitle}>{item.label}</Text><Text style={styles.riskAction}>{item.action}</Text></View><Ionicons name="chevron-forward" size={17} color={colors.slate} /></View>)}</Card>

    <SectionHeader title="Operações" />
    <View style={styles.operations}>
      <Operation icon="chatbubble-ellipses-outline" value={`${adminDemo.openSupport}`} title="Casos de suporte" tone="warning" />
      <Operation icon="alert-circle-outline" value={`${adminDemo.visitDisputes}`} title="Visitas em disputa" tone="danger" />
      <Operation icon="fitness-outline" value={`${adminDemo.ptBookings}`} title="Reservas de PT" tone="info" />
      <Operation icon="calendar-outline" value={adminDemo.visitsMonth.toLocaleString('pt-PT')} title="Visitas no mês" tone="success" />
    </View>

    <SectionHeader title="O que esta camada permite" />
    <Card style={styles.capabilityCard}>
      <Capability icon="pulse-outline" title="Operação em tempo real" text="Ocupação, entradas, aulas e filas de espera numa visão única." />
      <Capability icon="person-remove-outline" title="Prevenção de churn" text="Identificar membros inativos antes da desistência e criar ações de reativação." />
      <Capability icon="stats-chart-outline" title="Decisões com dados" text="Medir procura por aula, treinador, horário, recompensas e utilização do clube." last />
    </Card>
  </Shell>;
}

function Metric({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return <View style={styles.metric}><View style={styles.metricIcon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

function Operation({ icon, value, title, tone }: { icon: keyof typeof Ionicons.glyphMap; value: string; title: string; tone: 'warning' | 'danger' | 'info' | 'success' }) {
  return <View style={styles.operation}><View style={styles.operationTop}><Ionicons name={icon} size={18} color={operationColor(tone)} /><Text style={[styles.operationValue, { color: operationColor(tone) }]}>{value}</Text></View><Text style={styles.operationTitle}>{title}</Text></View>;
}

function Capability({ icon, title, text, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string; last?: boolean }) {
  return <View style={[styles.capability, last && { borderBottomWidth: 0 }]}><View style={styles.capabilityIcon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.capabilityTitle}>{title}</Text><Text style={styles.capabilityText}>{text}</Text></View></View>;
}

function operationColor(tone: string) {
  if (tone === 'warning') return colors.warning;
  if (tone === 'danger') return colors.danger;
  if (tone === 'success') return colors.success;
  return colors.accentDark;
}

const styles = StyleSheet.create({
  demo: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: colors.accentSoft, borderRadius: radius.md, marginBottom: 12 },
  demoText: { flex: 1, color: colors.accentDark, fontSize: 9, lineHeight: 14, fontWeight: '700' },
  hero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 19, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  heroEyebrow: { color: '#94C0DE', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  heroValue: { color: colors.white, fontSize: 36, lineHeight: 39, fontWeight: '900', letterSpacing: -1, marginTop: 5 },
  heroLabel: { color: '#CFE4F2', fontSize: 10, marginTop: 2 },
  occupancy: { width: 84, height: 84, borderRadius: 27, backgroundColor: '#12507D', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#36769F' },
  occupancyValue: { color: colors.white, fontSize: 19, fontWeight: '900' },
  occupancyLabel: { color: '#8DBDDD', fontSize: 8, fontWeight: '800', marginTop: 2 },
  heroTrack: { height: 6, borderRadius: 99, backgroundColor: '#285F86', overflow: 'hidden', marginTop: 18 },
  heroFill: { height: '100%', backgroundColor: '#78BCE9', borderRadius: 99 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  metric: { flexGrow: 1, flexBasis: '46%', minHeight: 116, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 14 },
  metricIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '900', letterSpacing: -.6, marginTop: 11 },
  metricLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', marginTop: 2 },
  performanceCard: { paddingVertical: 3 },
  performanceRow: { paddingVertical: 13 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  performanceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  performanceName: { color: colors.text, fontSize: 11, fontWeight: '900' },
  performanceValue: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  track: { height: 6, backgroundColor: colors.panel2, borderRadius: 99, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  riskCard: { paddingVertical: 2 },
  riskRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  riskNumber: { minWidth: 44, height: 38, borderRadius: 12, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  riskNumberText: { color: colors.warning, fontSize: 12, fontWeight: '900' },
  riskTitle: { color: colors.text, fontSize: 10, fontWeight: '900' },
  riskAction: { color: colors.muted, fontSize: 8, lineHeight: 12, marginTop: 3 },
  operations: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  operation: { flexGrow: 1, flexBasis: '46%', minHeight: 92, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 13 },
  operationTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  operationValue: { fontSize: 18, fontWeight: '900' },
  operationTitle: { color: colors.text, fontSize: 9, lineHeight: 13, fontWeight: '800', marginTop: 13 },
  capabilityCard: { paddingVertical: 2 },
  capability: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12 },
  capabilityIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  capabilityTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  capabilityText: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
});

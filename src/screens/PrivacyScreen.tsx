import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Card, Pill, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { Shell } from './shared';

export function PrivacyScreen() {
  const [healthData, setHealthData] = useState(true);
  const [personalisation, setPersonalisation] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  return <Shell>
    <ScreenTitle eyebrow="Privacidade & segurança" title="Controla os teus dados" subtitle="Consentimentos, integrações e pedidos de dados apresentados de forma explícita antes da ligação ao backend." />

    <Card style={styles.hero}><View style={styles.heroIcon}><Ionicons name="shield-checkmark-outline" size={24} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.heroTitle}>Privacidade por desenho</Text><Text style={styles.heroText}>A experiência separa dados de adesão, treino, saúde e analytics para que o membro saiba o que está a autorizar.</Text></View><Pill tone="success">Preparado</Pill></Card>

    <SectionHeader title="Consentimentos" />
    <Card style={styles.list}>
      <Setting icon="heart-outline" label="Dados de saúde e atividade" text="Permitir uso de atividade conectada para objetivos e progresso." value={healthData} onChange={setHealthData} />
      <Setting icon="sparkles-outline" label="Personalização" text="Usar objetivo e histórico de treino para adaptar recomendações." value={personalisation} onChange={setPersonalisation} />
      <Setting icon="analytics-outline" label="Analytics de produto" text="Ajudar a Kissonde a melhorar funcionalidades e experiência." value={analytics} onChange={setAnalytics} last />
    </Card>

    <SectionHeader title="Controlo de dados" />
    <Card style={styles.list}>
      <Action icon="download-outline" label="Exportar os meus dados" text="Preparar pedido de cópia dos dados associados à conta." onPress={() => Alert.alert('Pedido preparado', 'Na produção, este pedido será registado com referência e prazo de resposta.')} />
      <Action icon="trash-outline" label="Pedir eliminação da conta" text="Fluxo protegido com confirmação reforçada e regras de retenção." onPress={() => Alert.alert('Fluxo protegido', 'A eliminação real só será ativada depois de aprovadas as regras legais e de retenção da Kissonde.')} last />
    </Card>

    <SectionHeader title="Segurança" />
    <Card style={styles.security}><View style={styles.securityIcon}><Ionicons name="key-outline" size={19} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.securityTitle}>Sessões e dispositivos</Text><Text style={styles.securityText}>A arquitetura prevê tokens seguros, expiração de sessão e opção para terminar sessões noutros dispositivos quando o backend for ligado.</Text></View></Card>
    <View style={{ height: 16 }} /><SecondaryButton label="Terminar sessões noutros dispositivos" onPress={() => Alert.alert('Preparado para produção', 'Esta ação será ligada ao serviço real de autenticação.')} />
  </Shell>;
}

function Setting({ icon, label, text, value, onChange, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; text: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <View style={[styles.row, last && { borderBottomWidth: 0 }]}><View style={styles.icon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.text}>{text}</Text></View><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#8CBCE0' }} thumbColor={value ? colors.accent : colors.white} /></View>;
}

function Action({ icon, label, text, onPress, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; text: string; onPress: () => void; last?: boolean }) {
  return <View style={[styles.row, last && { borderBottomWidth: 0 }]}><View style={styles.icon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.text}>{text}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.slate} onPress={onPress} /></View>;
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.accentSoft, borderColor: '#BED8EA' },
  heroIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.accentDark, fontSize: 12, fontWeight: '900' },
  heroText: { color: colors.slateDark, fontSize: 9, lineHeight: 14, marginTop: 3 },
  list: { paddingVertical: 2 },
  row: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 11 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.text, fontSize: 10, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 8, lineHeight: 13, marginTop: 3 },
  security: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  securityIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  securityTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  securityText: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
});

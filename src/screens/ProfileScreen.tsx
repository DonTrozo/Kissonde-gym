import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BrandLogo } from '../brand';
import { member } from '../domain';
import { colors } from '../theme';
import { Card, Pill, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell, screenStyles as s } from './shared';

export function ProfileScreen() {
  const { signOut, supportTickets, visitReports } = useAppState();
  const [classAlerts, setClassAlerts] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const navigation = useNavigation<any>();
  const openCases = supportTickets.filter(item => item.status !== 'resolved').length + visitReports.filter(item => item.status !== 'resolved').length;

  return <Shell>
    <View style={styles.brand}><BrandLogo width={112} /></View>
    <ScreenTitle eyebrow="Perfil" title={member.name} subtitle={`${member.membership} · ${member.id}`} />

    <Card><Info label="Estado da adesão" value={member.status} /><Info label="Clube principal" value={member.branch} /><Info label="Validade" value={member.expiry} /><Info label="Idioma" value="Português" last /></Card>

    <SectionHeader title="Notificações" />
    <Card><Setting label="Aulas e lista de espera" value={classAlerts} onChange={setClassAlerts} /><Setting label="Objetivos e sequência semanal" value={streakAlerts} onChange={setStreakAlerts} last /></Card>

    <SectionHeader title="Conta" />
    <Card><Info label="Plano" value="Premium" /><Info label="Pagamento" value="Em dia" /><Info label="Próxima renovação" value="31 Dez 2026" last /></Card>

    <SectionHeader title="Ajuda" action={openCases > 0 ? `${openCases} aberto${openCases > 1 ? 's' : ''}` : undefined} />
    <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Support')} style={styles.supportRow}><Ionicons name="help-circle-outline" size={22} color={colors.accent} /><View style={{ flex: 1 }}><Text style={s.cardTitle}>Ajuda e suporte</Text><Text style={s.muted}>Cria e acompanha pedidos de suporte.</Text></View>{openCases > 0 ? <Pill tone="warning">{openCases}</Pill> : <Ionicons name="chevron-forward" size={20} color={colors.slate} />}</Pressable>

    <View style={{ height: 14 }} /><SecondaryButton label="Terminar sessão" onPress={signOut} />
  </Shell>;
}

function Info({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={s.muted}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function Setting({ label, value, onChange, last = false }: { label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.infoValue}>{label}</Text><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#8CBCE0' }} thumbColor={value ? colors.accent : '#FFFFFF'} /></View>;
}

const styles = StyleSheet.create({
  brand: { alignItems: 'flex-start', marginBottom: 18 },
  infoRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoValue: { color: colors.text, fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  supportRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
});

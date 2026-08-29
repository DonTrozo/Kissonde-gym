import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BrandLogo } from '../brand';
import { member } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, SecondaryButton, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell } from './shared';

export function ProfileScreen() {
  const { signOut, supportTickets, visitReports } = useAppState();
  const [classAlerts, setClassAlerts] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const navigation = useNavigation<any>();
  const openCases = supportTickets.filter(item => item.status !== 'resolved').length + visitReports.filter(item => item.status !== 'resolved').length;

  return <Shell>
    <View style={styles.brandRow}><BrandLogo width={108} /><Pill tone="success">{member.status}</Pill></View>

    <View style={styles.profileHero}>
      <View style={styles.heroOrb} />
      <View style={styles.avatar}><Ionicons name="person" size={29} color={colors.white} /></View>
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberMeta}>{member.membership} · {member.id}</Text>
      <View style={styles.heroStats}><ProfileStat label="CLUBE" value="Viana" /><View style={styles.heroDivider} /><ProfileStat label="VALIDADE" value={member.expiry} /></View>
    </View>

    <SectionHeader title="Conta" />
    <Card style={styles.settingsCard}>
      <Info icon="card-outline" label="Plano" value={member.membership} />
      <Info icon="location-outline" label="Clube principal" value={member.branch} />
      <Info icon="calendar-outline" label="Validade" value={member.expiry} />
      <Info icon="language-outline" label="Idioma" value="Português" last />
    </Card>

    <SectionHeader title="Notificações" />
    <Card style={styles.settingsCard}>
      <Setting icon="calendar-outline" label="Aulas e lista de espera" value={classAlerts} onChange={setClassAlerts} />
      <Setting icon="flame-outline" label="Objetivos e sequência semanal" value={streakAlerts} onChange={setStreakAlerts} last />
    </Card>

    <SectionHeader title="Ajuda" action={openCases > 0 ? `${openCases} aberto${openCases > 1 ? 's' : ''}` : undefined} />
    <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Support')} style={({ pressed }) => [styles.supportCard, pressed && { opacity: .75 }]}>
      <View style={styles.supportIcon}><Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.accentDark} /></View>
      <View style={{ flex: 1 }}><Text style={styles.supportTitle}>Ajuda e suporte</Text><Text style={styles.supportMeta}>Cria e acompanha pedidos com referência.</Text></View>
      {openCases > 0 ? <Pill tone="warning">{openCases}</Pill> : <Ionicons name="chevron-forward" size={20} color={colors.slate} />}
    </Pressable>

    <View style={{ height: 18 }} /><SecondaryButton label="Terminar sessão" onPress={signOut} />
  </Shell>;
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return <View style={styles.heroStat}><Text style={styles.heroStatLabel}>{label}</Text><Text style={styles.heroStatValue}>{value}</Text></View>;
}

function Info({ icon, label, value, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><View style={styles.infoIcon}><Ionicons name={icon} size={17} color={colors.accentDark} /></View><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function Setting({ icon, label, value, onChange, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><View style={styles.infoIcon}><Ionicons name={icon} size={17} color={colors.accentDark} /></View><Text style={styles.infoLabel}>{label}</Text><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#8CBCE0' }} thumbColor={value ? colors.accent : colors.white} /></View>;
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 },
  profileHero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 20, overflow: 'hidden', alignItems: 'center', shadowColor: colors.accentDark, shadowOpacity: .16, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  heroOrb: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#2878B0', right: -95, top: -105, opacity: .42 },
  avatar: { width: 68, height: 68, borderRadius: 23, backgroundColor: '#2675AC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4C8DB9' },
  memberName: { color: colors.white, fontSize: 22, fontWeight: '900', letterSpacing: -.55, marginTop: 13 },
  memberMeta: { color: '#CAE2F2', fontSize: 11, marginTop: 4 },
  heroStats: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#124A75', borderRadius: 14, paddingVertical: 12, marginTop: 18 },
  heroStat: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatLabel: { color: '#85B7D8', fontSize: 8, fontWeight: '900', letterSpacing: .75 },
  heroStatValue: { color: colors.white, fontSize: 11, fontWeight: '900' },
  heroDivider: { width: 1, height: 28, backgroundColor: '#39739A' },
  settingsCard: { paddingVertical: 3 },
  infoRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: colors.text, fontSize: 12, fontWeight: '800', flex: 1 },
  infoValue: { color: colors.muted, fontSize: 11, fontWeight: '800', maxWidth: 140, textAlign: 'right' },
  supportCard: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 15, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 18, shadowColor: '#31536F', shadowOpacity: .04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  supportIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  supportTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  supportMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
});

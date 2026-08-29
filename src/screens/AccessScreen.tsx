import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { member, visits } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { EmptyState, Shell, screenStyles as s } from './shared';

export function AccessScreen() {
  const { visitReports, reportVisit } = useAppState();
  const [description, setDescription] = useState('');

  const submitReport = () => {
    if (!description.trim()) {
      Alert.alert('Descrição necessária', 'Explica qual visita está em falta ou incorreta.');
      return;
    }
    const id = reportVisit(description.trim());
    setDescription('');
    Alert.alert('Pedido registado', `Referência ${id}. Podes acompanhar o estado nesta página.`);
  };

  return <Shell>
    <ScreenTitle eyebrow="Acesso" title="O teu cartão. Sempre pronto." subtitle="Consulta o teu estado de adesão e apresenta o código de acesso mesmo em situações de conectividade limitada." />

    <View style={styles.pass}>
      <View style={styles.passOrbOne} /><View style={styles.passOrbTwo} />
      <View style={styles.passHeader}>
        <View><Text style={styles.passEyebrow}>KISSONDE MEMBER</Text><Text style={styles.passName}>{member.name}</Text><Text style={styles.passMeta}>{member.membership} · {member.id}</Text></View>
        <View style={styles.offlineBadge}><Ionicons name="cloud-done-outline" size={14} color="#BFE1F5" /><Text style={styles.offlineText}>OFFLINE</Text></View>
      </View>
      <View style={styles.qrPlate}><QRCode value={`KISSONDE:${member.id}:ACTIVE`} size={184} backgroundColor="#FFFFFF" color="#111111" /></View>
      <View style={styles.passFooter}>
        <PassStat label="ESTADO" value={member.status} />
        <View style={styles.passDivider} />
        <PassStat label="CLUBE" value="Viana" />
        <View style={styles.passDivider} />
        <PassStat label="VALIDADE" value={member.expiry.replace('2026', '26')} />
      </View>
    </View>

    <SectionHeader title="Últimas visitas" />
    <Card style={styles.historyCard}>
      {visits.map((visit, index) => <View key={visit.id} style={[styles.visitRow, index === visits.length - 1 && { borderBottomWidth: 0 }]}> 
        <View style={[styles.visitDot, { backgroundColor: visit.status === 'verified' ? colors.success : visit.status === 'pending' ? colors.warning : colors.danger }]} />
        <View style={{ flex: 1 }}><Text style={styles.visitTitle}>{visit.date} · {visit.branch}</Text><Text style={styles.visitMeta}>{visit.enteredAt}{visit.exitedAt ? ` — ${visit.exitedAt}` : ''} · {visit.id}</Text></View>
        <Pill tone={visit.status === 'verified' ? 'success' : visit.status === 'pending' ? 'warning' : 'danger'}>{visit.status === 'verified' ? `+${visit.points}` : visit.status === 'pending' ? 'Pendente' : 'Disputa'}</Pill>
      </View>)}
    </Card>

    <SectionHeader title="Corrigir uma visita" />
    <Card style={styles.reportCard}>
      <View style={styles.reportIntro}><View style={styles.reportIcon}><Ionicons name="receipt-outline" size={20} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>Visita em falta ou incorreta?</Text><Text style={s.muted}>Cria um pedido com referência para acompanhamento.</Text></View></View>
      <Text style={[s.label, { marginTop: 17, marginBottom: 7 }]}>DESCRIÇÃO</Text>
      <TextInput accessibilityLabel="Descrição da visita em falta" multiline value={description} onChangeText={setDescription} placeholder="Ex.: Treinei ontem às 18:00 e a visita não aparece." placeholderTextColor={colors.slate} style={[s.input, styles.reportInput]} />
      <View style={{ height: 12 }} /><PrimaryButton label="Enviar pedido" onPress={submitReport} />
    </Card>

    <SectionHeader title="Pedidos de visita" />
    {visitReports.length === 0 ? <Card><EmptyState title="Nenhum pedido aberto" text="Os pedidos enviados aparecem aqui com a referência e o respetivo estado." /></Card> : visitReports.map(report => <Card key={report.id} style={{ marginBottom: 10 }}>
      <View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{report.id}</Text><Text style={s.muted}>{report.description}</Text></View><Pill tone={report.status === 'resolved' ? 'success' : 'warning'}>{report.status === 'open' ? 'Aberto' : report.status === 'in_review' ? 'Em análise' : 'Resolvido'}</Pill></View>
    </Card>)}
  </Shell>;
}

function PassStat({ label, value }: { label: string; value: string }) {
  return <View style={styles.passStat}><Text style={styles.passStatLabel}>{label}</Text><Text style={styles.passStatValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  pass: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 19, overflow: 'hidden', shadowColor: colors.accentDark, shadowOpacity: .18, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 4 },
  passOrbOne: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: '#2876AD', right: -90, top: -95, opacity: .48 },
  passOrbTwo: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 24, borderColor: '#2A75AA', left: -50, bottom: -74, opacity: .28 },
  passHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  passEyebrow: { color: '#9CC9E8', fontSize: 9, fontWeight: '900', letterSpacing: 1.25 },
  passName: { color: colors.white, fontSize: 20, fontWeight: '900', letterSpacing: -.45, marginTop: 4 },
  passMeta: { color: '#C8E0F0', fontSize: 11, fontWeight: '600', marginTop: 4 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#23618F', paddingHorizontal: 9, paddingVertical: 7, borderRadius: radius.pill },
  offlineText: { color: '#CDE7F7', fontSize: 8, fontWeight: '900', letterSpacing: .65 },
  qrPlate: { alignSelf: 'center', backgroundColor: colors.white, borderRadius: 22, padding: 15, marginVertical: 23, shadowColor: '#08253A', shadowOpacity: .24, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  passFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#124A75', borderRadius: 15, paddingVertical: 12, paddingHorizontal: 8 },
  passStat: { flex: 1, alignItems: 'center', gap: 3 },
  passStatLabel: { color: '#86B9DC', fontSize: 8, fontWeight: '900', letterSpacing: .8 },
  passStatValue: { color: colors.white, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  passDivider: { width: 1, height: 27, backgroundColor: '#39739A' },
  historyCard: { paddingVertical: 4 },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  visitDot: { width: 8, height: 8, borderRadius: 4 },
  visitTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  visitMeta: { color: colors.muted, fontSize: 10, marginTop: 4 },
  reportCard: { padding: 17 },
  reportIntro: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  reportInput: { minHeight: 98, textAlignVertical: 'top', paddingTop: 13 },
});

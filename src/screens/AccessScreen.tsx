import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { member, visits } from '../domain';
import { colors } from '../theme';
import { Card, Metric, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
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
    <ScreenTitle eyebrow="Acesso" title="Entrar sem fricção." subtitle="O cartão fica disponível mesmo quando a ligação à internet falha." />

    <Card style={styles.memberCard}>
      <View style={styles.qrWrap}><QRCode value={`KISSONDE:${member.id}:ACTIVE`} size={190} backgroundColor="#FFFFFF" color="#111111" /></View>
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={s.muted}>{member.id} · {member.membership}</Text>
      <Pill tone="success">DISPONÍVEL OFFLINE</Pill>
      <View style={[s.metricsRow, { width: '100%' }]}><Metric value={member.status} label="Estado" /><Metric value={member.branch} label="Clube" /><Metric value={member.expiry} label="Validade" /></View>
    </Card>

    <SectionHeader title="Histórico de visitas" />
    {visits.map(visit => <Card key={visit.id} style={{ marginBottom: 10 }}>
      <View style={s.between}>
        <View style={{ flex: 1 }}><Text style={s.cardTitle}>{visit.date} · {visit.branch}</Text><Text style={s.muted}>{visit.enteredAt}{visit.exitedAt ? ` — ${visit.exitedAt}` : ''} · ID {visit.id}</Text></View>
        <Pill tone={visit.status === 'verified' ? 'success' : visit.status === 'pending' ? 'warning' : 'danger'}>{visit.status === 'verified' ? `Verificada +${visit.points}` : visit.status === 'pending' ? 'Pendente' : 'Em disputa'}</Pill>
      </View>
    </Card>)}

    <SectionHeader title="Reportar visita em falta" />
    <Card>
      <Text style={s.label}>DESCRIÇÃO</Text>
      <TextInput accessibilityLabel="Descrição da visita em falta" multiline value={description} onChangeText={setDescription} placeholder="Ex.: Treinei ontem às 18:00 e a visita não aparece." placeholderTextColor={colors.slate} style={[s.input, styles.reportInput]} />
      <View style={{ height: 12 }} /><PrimaryButton label="Enviar pedido" onPress={submitReport} />
    </Card>

    <SectionHeader title="Pedidos de visita" />
    {visitReports.length === 0 ? <Card><EmptyState title="Nenhum pedido aberto" text="Quando reportares uma visita, a referência e o estado ficam visíveis aqui." /></Card> : visitReports.map(report => <Card key={report.id} style={{ marginBottom: 10 }}>
      <View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{report.id}</Text><Text style={s.muted}>{report.description}</Text></View><Pill tone={report.status === 'resolved' ? 'success' : 'warning'}>{report.status === 'open' ? 'Aberto' : report.status === 'in_review' ? 'Em análise' : 'Resolvido'}</Pill></View>
    </Card>)}
  </Shell>;
}

const styles = StyleSheet.create({
  memberCard: { alignItems: 'center', gap: 16 },
  qrWrap: { padding: 18, backgroundColor: '#FFF', borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  memberName: { color: colors.text, fontSize: 22, fontWeight: '900' },
  reportInput: { minHeight: 96, textAlignVertical: 'top', paddingTop: 13 },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { rewards } from '../domain';
import { colors } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell, screenStyles as s } from './shared';

export function RewardsScreen() {
  const { points, ledger, rewardRedemptions, redeem } = useAppState();

  return <Shell>
    <ScreenTitle eyebrow="Recompensas" title="Cada ponto tem uma origem." subtitle="O saldo, as trocas e o histórico são atualizados sempre que ganhas ou gastas pontos." />
    <Card style={styles.pointsHero}><Text style={s.accentLabel}>SALDO DISPONÍVEL</Text><Text style={styles.points}>{points.toLocaleString('pt-PT')}</Text><Text style={s.muted}>Pontos Kissonde</Text></Card>

    <SectionHeader title="Escolher recompensa" />
    {rewards.map(reward => {
      const issued = rewardRedemptions.filter(item => item.rewardId === reward.id && item.status === 'issued').length;
      const canAfford = points >= reward.points;
      return <Card key={reward.id} style={{ marginBottom: 10 }}>
        <View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{reward.title}</Text><Text style={s.muted}>{reward.subtitle}</Text></View><Text style={styles.rewardCost}>{reward.points}</Text></View>
        {issued > 0 ? <View style={{ marginTop: 10 }}><Pill tone="success">{issued} disponível{issued > 1 ? 'is' : ''}</Pill></View> : null}
        <View style={{ height: 12 }} /><PrimaryButton disabled={!canAfford} label={!canAfford ? `Faltam ${reward.points - points} pontos` : `Trocar por ${reward.points} pontos`} onPress={() => redeem(reward.id, reward.points)} />
      </Card>;
    })}

    {rewardRedemptions.length > 0 ? <>
      <SectionHeader title="Recompensas emitidas" />
      {rewardRedemptions.map(redemption => {
        const reward = rewards.find(item => item.id === redemption.rewardId);
        return <Card key={redemption.id} style={{ marginBottom: 10 }}><View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{reward?.title ?? 'Recompensa'}</Text><Text style={s.muted}>{redemption.id}</Text></View><Pill tone={redemption.status === 'issued' ? 'success' : redemption.status === 'used' ? 'info' : 'danger'}>{redemption.status === 'issued' ? 'Disponível' : redemption.status === 'used' ? 'Utilizada' : 'Cancelada'}</Pill></View></Card>;
      })}
    </> : null}

    <SectionHeader title="Histórico de pontos" />
    <Card>
      {ledger.map((item, index) => <View key={item.id} style={[styles.ledgerRow, index === ledger.length - 1 && { borderBottomWidth: 0 }]}>
        <View style={{ flex: 1 }}><Text style={styles.ledgerTitle}>{item.title}</Text><Text style={s.muted}>{item.date} · {item.id}</Text></View>
        <Text style={[styles.ledgerPoints, { color: item.points >= 0 ? colors.success : colors.danger }]}>{item.points >= 0 ? '+' : ''}{item.points}</Text>
      </View>)}
    </Card>
  </Shell>;
}

const styles = StyleSheet.create({
  pointsHero: { alignItems: 'center', paddingVertical: 26 },
  points: { color: colors.text, fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  rewardCost: { color: colors.accent, fontSize: 20, fontWeight: '900' },
  ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  ledgerTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  ledgerPoints: { fontSize: 15, fontWeight: '900' },
});

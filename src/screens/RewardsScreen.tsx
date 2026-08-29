import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rewards } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell } from './shared';

const rewardIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  shake: 'nutrition-outline',
  guest: 'people-outline',
  shirt: 'shirt-outline',
  pt: 'fitness-outline',
  membership: 'card-outline',
};

export function RewardsScreen() {
  const { points, ledger, rewardRedemptions, redeem } = useAppState();
  const nextReward = rewards.find(reward => reward.points > points);
  const progress = nextReward ? Math.min(100, Math.round((points / nextReward.points) * 100)) : 100;

  return <Shell>
    <ScreenTitle eyebrow="Recompensas" title="Consistência que devolve valor." subtitle="O saldo, as trocas e o histórico ficam visíveis para que cada ponto seja explicável." />

    <View style={styles.pointsHero}>
      <View style={styles.heroOrbOne} /><View style={styles.heroOrbTwo} />
      <Text style={styles.pointsEyebrow}>SALDO DISPONÍVEL</Text>
      <View style={styles.pointsRow}><Text style={styles.points}>{points.toLocaleString('pt-PT')}</Text><Text style={styles.pointsUnit}>PTS</Text></View>
      <Text style={styles.pointsNote}>Pontos Kissonde</Text>
      <View style={styles.nextRewardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nextRewardLabel}>{nextReward ? 'PRÓXIMO MARCO' : 'TODAS AS OPÇÕES'}</Text>
          <Text style={styles.nextRewardTitle}>{nextReward ? nextReward.title : 'Tens saldo para qualquer recompensa'}</Text>
        </View>
        <Text style={styles.nextRewardValue}>{nextReward ? `${nextReward.points} pts` : '100%'}</Text>
      </View>
      <View style={styles.heroProgress}><View style={[styles.heroProgressFill, { width: `${progress}%` as any }]} /></View>
    </View>

    <SectionHeader title="Trocar pontos" action={`${rewards.length} opções`} />
    {rewards.map(reward => {
      const issued = rewardRedemptions.filter(item => item.rewardId === reward.id && item.status === 'issued').length;
      const canAfford = points >= reward.points;
      const missing = Math.max(0, reward.points - points);
      return <Card key={reward.id} style={styles.rewardCard}>
        <View style={styles.rewardTop}>
          <View style={styles.rewardIcon}><Ionicons name={rewardIcons[reward.id] ?? 'gift-outline'} size={21} color={colors.accentDark} /></View>
          <View style={{ flex: 1 }}><Text style={styles.rewardTitle}>{reward.title}</Text><Text style={styles.rewardSubtitle}>{reward.subtitle}</Text></View>
          <View style={styles.costPill}><Text style={styles.costValue}>{reward.points}</Text><Text style={styles.costLabel}>PTS</Text></View>
        </View>
        {issued > 0 ? <View style={styles.issuedRow}><Ionicons name="checkmark-circle" size={17} color={colors.success} /><Text style={styles.issuedText}>{issued} recompensa{issued > 1 ? 's' : ''} {issued > 1 ? 'disponíveis' : 'disponível'}</Text></View> : null}
        {!canAfford ? <View style={styles.rewardProgress}><View style={[styles.rewardProgressFill, { width: `${Math.min(100, Math.round((points / reward.points) * 100))}%` as any }]} /></View> : null}
        <View style={{ height: 11 }} /><PrimaryButton disabled={!canAfford} label={!canAfford ? `Faltam ${missing} pontos` : 'Trocar recompensa'} onPress={() => redeem(reward.id, reward.points)} />
      </Card>;
    })}

    {rewardRedemptions.length > 0 ? <>
      <SectionHeader title="Recompensas emitidas" />
      <Card style={styles.issuedCard}>
        {rewardRedemptions.map((redemption, index) => {
          const reward = rewards.find(item => item.id === redemption.rewardId);
          return <View key={redemption.id} style={[styles.issuedItem, index === rewardRedemptions.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.issuedIcon}><Ionicons name={rewardIcons[redemption.rewardId] ?? 'gift-outline'} size={17} color={colors.accentDark} /></View>
            <View style={{ flex: 1 }}><Text style={styles.issuedTitle}>{reward?.title ?? 'Recompensa'}</Text><Text style={styles.issuedMeta}>{redemption.id}</Text></View>
            <Pill tone={redemption.status === 'issued' ? 'success' : redemption.status === 'used' ? 'info' : 'danger'}>{redemption.status === 'issued' ? 'Disponível' : redemption.status === 'used' ? 'Utilizada' : 'Cancelada'}</Pill>
          </View>;
        })}
      </Card>
    </> : null}

    <SectionHeader title="Movimentos" />
    <Card style={styles.ledgerCard}>
      {ledger.map((item, index) => <View key={item.id} style={[styles.ledgerRow, index === ledger.length - 1 && { borderBottomWidth: 0 }]}>
        <View style={[styles.ledgerDot, { backgroundColor: item.points >= 0 ? colors.successSoft : colors.dangerSoft }]}><Ionicons name={item.points >= 0 ? 'arrow-down' : 'arrow-up'} size={14} color={item.points >= 0 ? colors.success : colors.danger} /></View>
        <View style={{ flex: 1 }}><Text style={styles.ledgerTitle}>{item.title}</Text><Text style={styles.ledgerMeta}>{item.date} · {item.id}</Text></View>
        <Text style={[styles.ledgerPoints, { color: item.points >= 0 ? colors.success : colors.danger }]}>{item.points >= 0 ? '+' : ''}{item.points}</Text>
      </View>)}
    </Card>
  </Shell>;
}

const styles = StyleSheet.create({
  pointsHero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 20, overflow: 'hidden', shadowColor: colors.accentDark, shadowOpacity: .17, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroOrbOne: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: '#2878B0', right: -90, top: -90, opacity: .45 },
  heroOrbTwo: { position: 'absolute', width: 135, height: 135, borderRadius: 68, borderWidth: 25, borderColor: '#2B74A7', right: 20, bottom: -84, opacity: .25 },
  pointsEyebrow: { color: '#9EC9E7', fontSize: 9, fontWeight: '900', letterSpacing: 1.15 },
  pointsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 7 },
  points: { color: colors.white, fontSize: 49, lineHeight: 53, fontWeight: '900', letterSpacing: -2.2 },
  pointsUnit: { color: '#91C2E1', fontSize: 11, fontWeight: '900', paddingBottom: 8, letterSpacing: .9 },
  pointsNote: { color: '#CEE4F2', fontSize: 11, marginTop: 2 },
  nextRewardRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 22 },
  nextRewardLabel: { color: '#86B6D5', fontSize: 8, fontWeight: '900', letterSpacing: .8 },
  nextRewardTitle: { color: colors.white, fontSize: 12, fontWeight: '900', marginTop: 3 },
  nextRewardValue: { color: '#CBE3F2', fontSize: 10, fontWeight: '800' },
  heroProgress: { height: 6, borderRadius: 99, backgroundColor: '#2A638B', overflow: 'hidden', marginTop: 10 },
  heroProgressFill: { height: '100%', borderRadius: 99, backgroundColor: '#78BDE9' },
  rewardCard: { marginBottom: 11, padding: 15 },
  rewardTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  rewardIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  rewardTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  rewardSubtitle: { color: colors.muted, fontSize: 10, marginTop: 3 },
  costPill: { minWidth: 58, alignItems: 'center', backgroundColor: colors.panel2, borderRadius: 13, paddingVertical: 8, paddingHorizontal: 9 },
  costValue: { color: colors.accentDark, fontSize: 15, fontWeight: '900' },
  costLabel: { color: colors.slateDark, fontSize: 7, fontWeight: '900', letterSpacing: .7, marginTop: 1 },
  issuedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  issuedText: { color: colors.success, fontSize: 10, fontWeight: '800' },
  rewardProgress: { height: 5, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 12 },
  rewardProgressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.accent },
  issuedCard: { paddingVertical: 3 },
  issuedItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  issuedIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  issuedTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  issuedMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  ledgerCard: { paddingVertical: 3 },
  ledgerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  ledgerDot: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  ledgerTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  ledgerMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  ledgerPoints: { fontSize: 14, fontWeight: '900' },
});

import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { challenges } from '../product';
import { colors, radius } from '../theme';
import { useAppState } from '../state';
import { Card, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { Shell } from './shared';

export function ChallengesScreen() {
  const { joinedChallenges, joinChallenge, referralCode } = useAppState();

  return <Shell>
    <ScreenTitle eyebrow="Consistência & comunidade" title="Desafios" subtitle="Metas simples que transformam frequência, treino e atividade em progressão visível e recompensas." />
    <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="trophy" size={24} color={colors.white} /></View><Text style={styles.heroEyebrow}>DESAFIOS ATIVOS</Text><Text style={styles.heroTitle}>{joinedChallenges.length} de {challenges.length}</Text><Text style={styles.heroMeta}>Participa sem perder a transparência sobre a meta e a recompensa.</Text></View>

    <SectionHeader title="Disponíveis" />
    <View style={styles.list}>{challenges.map(challenge => {
      const joined = joinedChallenges.includes(challenge.id);
      const progress = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
      return <Card key={challenge.id} style={styles.card}>
        <View style={styles.cardTop}><View style={{ flex: 1 }}><Text style={styles.title}>{challenge.title}</Text><Text style={styles.description}>{challenge.description}</Text></View><Pill tone={joined ? 'success' : 'info'}>{joined ? 'Inscrito' : `+${challenge.rewardPoints} pts`}</Pill></View>
        <View style={styles.progressMeta}><Text style={styles.progressText}>{challenge.progress}/{challenge.target} {challenge.unit}</Text><Text style={styles.progressText}>{progress}%</Text></View>
        <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` as any }]} /></View>
        <View style={styles.ends}><Ionicons name="time-outline" size={14} color={colors.slateDark} /><Text style={styles.endsText}>Termina {challenge.ends}</Text></View>
        <View style={{ marginTop: 12 }}>{joined ? <SecondaryButton label="Ver progresso" onPress={() => Alert.alert('Progresso do desafio', `${challenge.progress} de ${challenge.target} ${challenge.unit}.`)} /> : <PrimaryButton label="Participar" onPress={() => joinChallenge(challenge.id)} />}</View>
      </Card>;
    })}</View>

    <SectionHeader title="Convida um amigo" />
    <Card style={styles.referralCard}>
      <View style={styles.referralIcon}><Ionicons name="people-outline" size={24} color={colors.accentDark} /></View>
      <Text style={styles.referralTitle}>Treinar é melhor acompanhado.</Text><Text style={styles.referralMeta}>Partilha o teu código. A versão de produção pode aplicar benefícios ao novo membro e pontos ao recomendador depois da adesão ser validada.</Text>
      <Pressable accessibilityRole="button" onPress={() => Alert.alert('Código de referência', referralCode)} style={styles.code}><Text style={styles.codeLabel}>TEU CÓDIGO</Text><Text style={styles.codeValue}>{referralCode}</Text><Ionicons name="share-social-outline" size={18} color={colors.accentDark} /></Pressable>
    </Card>
  </Shell>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 18, overflow: 'hidden' },
  heroIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#2678B4', alignItems: 'center', justifyContent: 'center' },
  heroEyebrow: { color: '#9BC6E2', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginTop: 16 },
  heroTitle: { color: colors.white, fontSize: 27, fontWeight: '900', letterSpacing: -.7, marginTop: 3 },
  heroMeta: { color: '#CFE3F2', fontSize: 10, lineHeight: 16, marginTop: 4, maxWidth: 430 },
  list: { gap: 10 },
  card: { padding: 15 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  title: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900' },
  description: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  progressText: { color: colors.slateDark, fontSize: 8, fontWeight: '900' },
  track: { height: 6, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 6 },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  ends: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  endsText: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  referralCard: { alignItems: 'stretch', padding: 17 },
  referralIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  referralTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 14 },
  referralMeta: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 5 },
  code: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 14, paddingHorizontal: 13, marginTop: 14 },
  codeLabel: { color: colors.slateDark, fontSize: 7, fontWeight: '900', letterSpacing: .8 },
  codeValue: { flex: 1, color: colors.accentDark, fontSize: 13, fontWeight: '900', textAlign: 'center' },
});

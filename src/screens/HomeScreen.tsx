import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BrandLogo } from '../brand';
import { classes, exercises, member } from '../domain';
import { colors, radius } from '../theme';
import { Card, Metric, Pill, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell, screenStyles as s } from './shared';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { points, workoutSets, reservations } = useAppState();
  const activeReservation = reservations.find(item => item.status === 'confirmed' || item.status === 'waitlisted');
  const nextClass = classes.find(item => item.id === activeReservation?.classId) ?? classes[0]!;
  const loggedExercises = new Set(workoutSets.map(set => set.exerciseId)).size;
  const workoutPercent = Math.round((loggedExercises / exercises.length) * 100);

  return <Shell>
    <View style={s.topbar}>
      <BrandLogo width={124} />
      <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" onPress={() => navigation.navigate('Profile')} style={s.avatar}><Ionicons name="person" size={19} color={colors.text} /></Pressable>
    </View>

    <ScreenTitle eyebrow="Hoje" title="O teu treino começa aqui." subtitle="Acesso, treino, progresso, aulas e recompensas num único lugar." />

    <Card style={styles.heroCard}>
      <View style={s.between}>
        <View style={{ flex: 1 }}><Text style={s.accentLabel}>ACESSO RÁPIDO</Text><Text style={s.cardTitle}>Cartão digital</Text><Text style={s.muted}>Adesão {member.status.toLowerCase()} · disponível offline</Text></View>
        <View style={styles.qrMini}><Ionicons name="qr-code" size={32} color="#FFFFFF" /></View>
      </View>
      <View style={s.divider} />
      <View style={s.metricsRow}><Metric value={points.toLocaleString('pt-PT')} label="Pontos Kissonde" /><Metric value={`${member.streak}x`} label="Treinos esta semana" /><Metric value="42%" label="Ocupação agora" /></View>
    </Card>

    <SectionHeader title="Treino de hoje" action={`${workoutPercent}% registado`} />
    <Card>
      <View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>Push Day</Text><Text style={s.muted}>12 semanas · Hipertrofia intermédia</Text></View><Pill tone={workoutPercent === 100 ? 'success' : 'info'}>{loggedExercises}/{exercises.length} exercícios</Pill></View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${workoutPercent}%` as any }]} /></View>
    </Card>

    <SectionHeader title="Próxima aula" />
    <Card>
      <View style={s.between}>
        <View style={{ flex: 1 }}><Text style={s.cardTitle}>{nextClass.name}</Text><Text style={s.muted}>{nextClass.instructor} · {nextClass.duration}</Text></View>
        <View style={styles.timeBox}><Text style={styles.time}>{nextClass.time}</Text></View>
      </View>
      {activeReservation ? <View style={{ marginTop: 12 }}><Pill tone={activeReservation.status === 'confirmed' ? 'success' : 'warning'}>{activeReservation.status === 'confirmed' ? 'Reserva confirmada' : `Lista de espera #${activeReservation.waitlistPosition}`}</Pill></View> : null}
    </Card>

    <SectionHeader title="Melhor hora para treinar" />
    <Card><Text style={s.cardTitle}>Kissonde Viana · 42% ocupado</Text><Text style={s.muted}>Movimento moderado agora. Normalmente mais tranquilo entre 10:00–15:00 e depois das 20:00.</Text><View style={styles.occupancyTrack}><View style={styles.occupancyFill} /></View></Card>
  </Shell>;
}

const styles = StyleSheet.create({
  heroCard: { gap: 16 },
  qrMini: { width: 58, height: 58, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  timeBox: { minWidth: 64, paddingVertical: 12, paddingHorizontal: 10, backgroundColor: colors.panel2, borderRadius: radius.md, alignItems: 'center' },
  time: { color: colors.text, fontSize: 16, fontWeight: '900' },
  occupancyTrack: { height: 8, backgroundColor: colors.panel2, borderRadius: 99, overflow: 'hidden', marginTop: 16 },
  occupancyFill: { height: '100%', width: '42%', backgroundColor: colors.accent },
});

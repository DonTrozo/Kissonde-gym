import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BrandLogo } from '../brand';
import { classes, exercises, member } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, SectionHeader } from '../ui';
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
      <BrandLogo width={118} />
      <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" onPress={() => navigation.navigate('Profile')} style={s.avatar}><Ionicons name="person-outline" size={20} color={colors.accentDark} /></Pressable>
    </View>

    <View style={styles.greetingRow}>
      <View><Text style={styles.eyebrow}>HOJE</Text><Text style={styles.greeting}>Pronto para continuar?</Text></View>
      <View style={styles.memberStatus}><View style={styles.statusDot} /><Text style={styles.memberStatusText}>{member.membership}</Text></View>
    </View>

    <View style={styles.trainingHero}>
      <View style={styles.heroOrbOne} /><View style={styles.heroOrbTwo} />
      <View style={styles.heroTopRow}><Text style={styles.heroEyebrow}>SEMANA 4 · PUSH DAY</Text><Text style={styles.heroPercent}>{workoutPercent}%</Text></View>
      <Text style={styles.heroTitle}>Treino de hoje</Text>
      <Text style={styles.heroSubtitle}>{loggedExercises === 0 ? 'Começa a sessão e regista cada série.' : `${loggedExercises} de ${exercises.length} exercícios já iniciados.`}</Text>
      <View style={styles.heroProgress}><View style={[styles.heroProgressFill, { width: `${workoutPercent}%` as any }]} /></View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Treinar')} style={styles.heroAction}>
        <Text style={styles.heroActionText}>{workoutPercent > 0 ? 'Continuar treino' : 'Começar treino'}</Text><Ionicons name="arrow-forward" size={17} color={colors.white} />
      </Pressable>
    </View>

    <View style={styles.quickGrid}>
      <QuickTile icon="qr-code-outline" label="Acesso" value="QR pronto" onPress={() => navigation.navigate('Acesso')} />
      <QuickTile icon="diamond-outline" label="Pontos" value={points.toLocaleString('pt-PT')} onPress={() => navigation.navigate('Prémios')} />
      <QuickTile icon="people-outline" label="Ocupação" value="42%" onPress={() => undefined} />
    </View>

    <SectionHeader title="Próxima aula" action={activeReservation ? 'Ver reserva' : 'Explorar aulas'} />
    <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Aulas')}>
      <Card style={styles.classCard}>
        <View style={styles.timeRail}><Text style={styles.time}>{nextClass.time}</Text><Text style={styles.duration}>{nextClass.duration}</Text></View>
        <View style={styles.classContent}>
          <View style={s.between}><View style={{ flex: 1 }}><Text style={styles.className}>{nextClass.name}</Text><Text style={s.muted}>{nextClass.instructor} · {nextClass.difficulty}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.slate} /></View>
          {activeReservation ? <View style={{ marginTop: 12 }}><Pill tone={activeReservation.status === 'confirmed' ? 'success' : 'warning'}>{activeReservation.status === 'confirmed' ? 'Reserva confirmada' : `Lista de espera #${activeReservation.waitlistPosition}`}</Pill></View> : <Text style={styles.availability}>{Math.max(0, nextClass.capacity - nextClass.booked)} vagas disponíveis</Text>}
        </View>
      </Card>
    </Pressable>

    <SectionHeader title="Movimento no clube" />
    <Card style={styles.occupancyCard}>
      <View style={styles.occupancyTop}><View><Text style={styles.occupancyLabel}>KISSONDE VIANA</Text><Text style={styles.occupancyValue}>Movimento moderado</Text></View><View style={styles.occupancyNumber}><Text style={styles.occupancyNumberText}>42%</Text></View></View>
      <View style={styles.occupancyTrack}><View style={styles.occupancyFill} /></View>
      <View style={styles.quietRow}><Ionicons name="time-outline" size={17} color={colors.accent} /><Text style={styles.quietText}>Mais tranquilo entre 10:00–15:00 e depois das 20:00.</Text></View>
    </Card>
  </Shell>;
}

function QuickTile({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickTile, pressed && { opacity: .72 }]}>
    <View style={styles.quickIcon}><Ionicons name={icon} size={19} color={colors.accentDark} /></View>
    <Text style={styles.quickLabel}>{label}</Text><Text style={styles.quickValue}>{value}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  greetingRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 17 },
  eyebrow: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  greeting: { color: colors.text, fontSize: 25, lineHeight: 30, fontWeight: '900', letterSpacing: -.75, marginTop: 3 },
  memberStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  memberStatusText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  trainingHero: { minHeight: 225, borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 20, overflow: 'hidden', shadowColor: colors.accentDark, shadowOpacity: .18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroOrbOne: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#2679B5', right: -55, top: -75, opacity: .52 },
  heroOrbTwo: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 24, borderColor: '#2C76AA', right: 16, bottom: -64, opacity: .34 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroEyebrow: { color: '#AED3ED', fontSize: 10, fontWeight: '900', letterSpacing: 1.15 },
  heroPercent: { color: colors.white, fontSize: 14, fontWeight: '900' },
  heroTitle: { color: colors.white, fontSize: 28, lineHeight: 32, fontWeight: '900', letterSpacing: -.9, marginTop: 17 },
  heroSubtitle: { color: '#D2E6F5', fontSize: 12, lineHeight: 18, marginTop: 5 },
  heroProgress: { height: 6, borderRadius: 99, backgroundColor: '#2A668F', marginTop: 18, overflow: 'hidden' },
  heroProgressFill: { height: '100%', borderRadius: 99, backgroundColor: '#74B8E8' },
  heroAction: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 19, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 13, backgroundColor: '#2678B4' },
  heroActionText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: 9, marginTop: 13 },
  quickTile: { flex: 1, minHeight: 104, backgroundColor: colors.panel, borderRadius: 18, borderWidth: 1, borderColor: '#E3EAF0', padding: 12, justifyContent: 'space-between', shadowColor: '#31536F', shadowOpacity: .04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  quickIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', marginTop: 8 },
  quickValue: { color: colors.text, fontSize: 14, fontWeight: '900' },
  classCard: { padding: 0, overflow: 'hidden', flexDirection: 'row' },
  timeRail: { width: 82, backgroundColor: colors.accentSoft, paddingHorizontal: 13, paddingVertical: 18, justifyContent: 'center' },
  time: { color: colors.accentDark, fontSize: 20, fontWeight: '900', letterSpacing: -.5 },
  duration: { color: colors.slateDark, fontSize: 10, fontWeight: '700', marginTop: 3 },
  classContent: { flex: 1, paddingHorizontal: 15, paddingVertical: 16 },
  className: { color: colors.text, fontSize: 17, fontWeight: '900' },
  availability: { color: colors.success, fontSize: 11, fontWeight: '800', marginTop: 11 },
  occupancyCard: { gap: 14 },
  occupancyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  occupancyLabel: { color: colors.slateDark, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  occupancyValue: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 4 },
  occupancyNumber: { width: 54, height: 54, borderRadius: 17, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  occupancyNumberText: { color: colors.accentDark, fontSize: 15, fontWeight: '900' },
  occupancyTrack: { height: 7, backgroundColor: colors.panel2, borderRadius: 99, overflow: 'hidden' },
  occupancyFill: { height: '100%', width: '42%', backgroundColor: colors.accent, borderRadius: 99 },
  quietRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 1 },
  quietText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
});

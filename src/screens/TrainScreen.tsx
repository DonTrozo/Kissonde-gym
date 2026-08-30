import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Exercise, exercises } from '../domain';
import { experienceLabels, exercisesForProgramme, programmeForGoal, programmes } from '../product';
import { colors, radius } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell, screenStyles as s } from './shared';

type TrainingTab = 'today' | 'programme' | 'progress';

export function TrainScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<TrainingTab>('today');
  const { workoutSets, workoutCompleted, completeWorkout, preferences } = useAppState();
  const programme = programmeForGoal(preferences.goal);
  const todayExercises = exercisesForProgramme(exercises, programme);
  const relevantSets = workoutSets.filter(set => programme.exerciseIds.includes(set.exerciseId));
  const loggedExercises = new Set(relevantSets.map(set => set.exerciseId)).size;
  const totalTargetSets = todayExercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completion = Math.min(100, Math.round((relevantSets.length / Math.max(1, totalTargetSets)) * 100));

  return <Shell>
    <ScreenTitle eyebrow="Treinar" title="Treino com intenção." subtitle="Programa, execução, carga e histórico ligados à mesma progressão." />

    <View style={styles.sessionHero}>
      <View style={styles.sessionOrb} />
      <View style={styles.sessionTop}><Text style={styles.sessionEyebrow}>SEMANA 4 · {programme.title.toUpperCase()}</Text><Pill tone={workoutCompleted ? 'success' : 'info'}>{workoutCompleted ? 'Concluído' : `${completion}%`}</Pill></View>
      <Text style={styles.sessionTitle}>{programme.dayTitle}</Text>
      <Text style={styles.sessionMeta}>{programme.focus} · {todayExercises.length} exercícios · {totalTargetSets} séries</Text>
      <View style={styles.sessionProgress}><View style={[styles.sessionProgressFill, { width: `${completion}%` as any }]} /></View>
      <View style={styles.sessionStats}><SessionStat value={`${relevantSets.length}`} label="SÉRIES" /><SessionStat value={`${loggedExercises}`} label="EXERCÍCIOS" /><SessionStat value={`${Math.max(0, totalTargetSets - relevantSets.length)}`} label="POR REGISTAR" /></View>
    </View>

    <View style={styles.tabs}>
      <TabButton active={tab === 'today'} label="Hoje" onPress={() => setTab('today')} />
      <TabButton active={tab === 'programme'} label="Programa" onPress={() => setTab('programme')} />
      <TabButton active={tab === 'progress'} label="Progresso" onPress={() => setTab('progress')} />
    </View>

    {tab === 'today' ? <>
      <SectionHeader title="Exercícios" action={`${relevantSets.length}/${totalTargetSets} séries`} />
      {todayExercises.map((exercise, index) => <ExerciseLogger key={exercise.id} exercise={exercise} order={index + 1} />)}
      <View style={styles.finishWrap}><PrimaryButton disabled={relevantSets.length === 0 || workoutCompleted} label={workoutCompleted ? 'Treino concluído' : 'Concluir treino · +20 pontos'} onPress={completeWorkout} /></View>
    </> : null}

    {tab === 'programme' ? <ProgrammeView programme={programme} experience={experienceLabels[preferences.experience]} /> : null}
    {tab === 'progress' ? <ProgressView onHistory={() => navigation.navigate('WorkoutHistory')} /> : null}
  </Shell>;
}

function SessionStat({ value, label }: { value: string; label: string }) {
  return <View style={styles.sessionStat}><Text style={styles.sessionStatValue}>{value}</Text><Text style={styles.sessionStatLabel}>{label}</Text></View>;
}

function ExerciseLogger({ exercise, order }: { exercise: Exercise; order: number }) {
  const navigation = useNavigation<any>();
  const { workoutSets, removeWorkoutSet } = useAppState();
  const sets = workoutSets.filter(set => set.exerciseId === exercise.id);
  const complete = sets.length >= exercise.sets;
  return <Card style={[styles.exerciseCard, complete && styles.exerciseCardComplete]}>
    <View style={styles.exerciseHeader}>
      <View style={[styles.exerciseIndex, complete && styles.exerciseIndexComplete]}><Text style={[styles.exerciseIndexText, complete && { color: colors.white }]}>{String(order).padStart(2, '0')}</Text></View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })} style={styles.exerciseHeading}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseMeta}>{exercise.target} · objetivo {exercise.sets} × {exercise.reps}</Text></Pressable>
      <View style={styles.headerRight}><Pill tone={complete ? 'success' : 'info'}>{sets.length}/{exercise.sets}</Pill><Pressable accessibilityRole="button" accessibilityLabel={`Abrir guia de ${exercise.name}`} onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })} style={styles.infoButton}><Ionicons name="information-circle-outline" size={18} color={colors.accentDark} /></Pressable></View>
    </View>

    <View style={styles.performanceStrip}>
      <View style={styles.performanceColumn}><Text style={styles.performanceLabel}>ÚLTIMA SESSÃO</Text><Text style={styles.performanceValue}>{exercise.previous ?? '—'}</Text></View>
      <View style={styles.performanceArrow}><Ionicons name="arrow-forward" size={15} color={colors.slate} /></View>
      <View style={styles.performanceColumn}><Text style={styles.performanceLabel}>ALVO DE HOJE</Text><Text style={styles.performanceValue}>{exercise.suggested ?? `${exercise.reps} reps`}</Text></View>
    </View>

    <View style={styles.setHeader}><Text style={[styles.setHeaderText, styles.setNumberColumn, styles.centerText]}>SET</Text><Text style={[styles.setHeaderText, styles.flexColumn, styles.centerText]}>PESO</Text><Text style={[styles.setHeaderText, styles.flexColumn, styles.centerText]}>REPS</Text><Text style={[styles.setHeaderText, styles.saveColumn, styles.centerText]}>OK</Text></View>
    {Array.from({ length: exercise.sets }).map((_, index) => <SetRow key={index + 1} exercise={exercise} setNumber={index + 1} />)}
    {sets.length > 0 ? <Pressable accessibilityRole="button" onPress={() => { const last = [...sets].sort((a, b) => b.setNumber - a.setNumber)[0]; if (last) removeWorkoutSet(last.id); }} style={styles.removeAction}><Ionicons name="arrow-undo-outline" size={14} color={colors.danger} /><Text style={styles.removeText}>Desfazer última série</Text></Pressable> : null}
  </Card>;
}

function SetRow({ exercise, setNumber }: { exercise: Exercise; setNumber: number }) {
  const { workoutSets, logWorkoutSet } = useAppState();
  const existing = workoutSets.find(set => set.exerciseId === exercise.id && set.setNumber === setNumber);
  const suggestedWeight = exercise.suggested?.match(/([\d.]+)\s*kg/)?.[1] ?? '';
  const suggestedReps = exercise.suggested?.match(/×\s*(\d+)/)?.[1] ?? exercise.reps.replace(/\D/g, '');
  const [weight, setWeight] = useState(existing ? String(existing.weightKg) : suggestedWeight);
  const [reps, setReps] = useState(existing ? String(existing.reps) : suggestedReps);

  const save = () => {
    const weightValue = Number(weight.replace(',', '.'));
    const repsValue = Number(reps);
    if (!Number.isFinite(weightValue) || !Number.isFinite(repsValue) || weightValue < 0 || repsValue <= 0) {
      Alert.alert('Série inválida', 'Confirma o peso e as repetições antes de guardar.');
      return;
    }
    logWorkoutSet(exercise.id, setNumber, weightValue, repsValue);
  };

  return <View style={[styles.setRow, existing && styles.setRowSaved]}>
    <View style={[styles.setNumber, styles.setNumberColumn]}><Text style={styles.setNumberText}>{setNumber}</Text></View>
    <TextInput accessibilityLabel={`Peso série ${setNumber}`} allowFontScaling={false} keyboardType="decimal-pad" maxLength={6} selectTextOnFocus value={weight} onChangeText={setWeight} placeholder="0" placeholderTextColor={colors.slate} style={[styles.directInput, styles.flexColumn]} />
    <TextInput accessibilityLabel={`Repetições série ${setNumber}`} allowFontScaling={false} keyboardType="number-pad" maxLength={3} selectTextOnFocus value={reps} onChangeText={setReps} placeholder="0" placeholderTextColor={colors.slate} style={[styles.directInput, styles.flexColumn]} />
    <Pressable accessibilityRole="button" accessibilityLabel={`Guardar série ${setNumber}`} onPress={save} style={[styles.saveSet, styles.saveColumn, existing && styles.savedSet]}><Ionicons name={existing ? 'checkmark' : 'add'} size={18} color={existing ? colors.white : colors.accentDark} /></Pressable>
  </View>;
}

function ProgrammeView({ programme, experience }: { programme: ReturnType<typeof programmeForGoal>; experience: string }) {
  const weekly = Array.from({ length: programme.sessionsPerWeek }).map((_, index) => ({
    day: `Sessão ${index + 1}`,
    name: index === 0 ? programme.dayTitle : index === 1 ? 'Sessão complementar' : index === 2 ? 'Progressão' : 'Volume & técnica',
    detail: index === 0 ? programme.focus : 'Estrutura adaptada ao objetivo e frequência semanal',
  }));
  return <>
    <SectionHeader title="Plano atual" />
    <View style={styles.programmeHero}><Text style={styles.programmeEyebrow}>{programme.durationWeeks} SEMANAS · {programme.title.toUpperCase()}</Text><Text style={styles.programmeTitle}>Semana 4 de {programme.durationWeeks}</Text><Text style={styles.programmeMeta}>{programme.sessionsPerWeek} sessões por semana · {experience}</Text><View style={styles.programmeProgress}><View style={[styles.programmeProgressFill, { width: `${Math.round((4 / programme.durationWeeks) * 100)}%` as any }]} /></View></View>
    <SectionHeader title="Estrutura semanal" />
    <Card style={styles.timelineCard}>{weekly.map((item, index) => <View key={item.day} style={[styles.timelineRow, index === weekly.length - 1 && { borderBottomWidth: 0 }]}><View style={styles.timelineMarker}><Text style={styles.timelineNumber}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.timelineTitle}>{item.day} · {item.name}</Text><Text style={styles.timelineMeta}>{item.detail}</Text></View>{index === 0 ? <Pill tone="info">Hoje</Pill> : null}</View>)}</Card>
    <SectionHeader title="Regra de progressão" />
    <Card style={styles.ruleCard}><View style={styles.ruleIcon}><Ionicons name="trending-up" size={20} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>Aumenta quando estiver sólido.</Text><Text style={s.muted}>Completa a meta com boa técnica. O histórico registado torna-se a referência para a próxima recomendação.</Text></View></Card>
    <SectionHeader title="Outros programas" />
    <View style={styles.programmeOptions}>{programmes.filter(item => item.id !== programme.id).slice(0, 3).map(item => <Card key={item.id} style={styles.programmeOption}><Text style={styles.optionEyebrow}>{item.durationWeeks} SEMANAS</Text><Text style={styles.optionTitle}>{item.title}</Text><Text style={styles.optionMeta}>{item.subtitle}</Text></Card>)}</View>
  </>;
}

function ProgressView({ onHistory }: { onHistory: () => void }) {
  const navigation = useNavigation<any>();
  const { workoutSets } = useAppState();
  const benchSets = workoutSets.filter(set => set.exerciseId === 'bench');
  const bestBench = benchSets.length ? Math.max(...benchSets.map(set => set.weightKg)) : 80;
  const totalVolume = useMemo(() => workoutSets.reduce((sum, set) => sum + (set.weightKg * set.reps), 0), [workoutSets]);
  return <>
    <SectionHeader title="Resumo de desempenho" />
    <View style={styles.progressGrid}><ProgressMetric value={`${bestBench} kg`} label="Melhor supino" icon="barbell-outline" /><ProgressMetric value={`${workoutSets.length}`} label="Séries hoje" icon="checkmark-done-outline" /><ProgressMetric value={`${Math.round(totalVolume).toLocaleString('pt-PT')} kg`} label="Volume" icon="stats-chart-outline" wide /></View>
    <Pressable accessibilityRole="button" onPress={onHistory} style={styles.historyLink}><View style={styles.historyIcon}><Ionicons name="time-outline" size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.historyTitle}>Histórico completo</Text><Text style={styles.historyMeta}>Sessões, volume e melhores marcas anteriores</Text></View><Ionicons name="chevron-forward" size={18} color={colors.slate} /></Pressable>
    <SectionHeader title="Volume · últimas semanas" />
    <Card style={styles.chartCard}><View style={styles.chartHeader}><View><Text style={styles.chartEyebrow}>TENDÊNCIA</Text><Text style={styles.chartTitle}>Carga total movimentada</Text></View><Pill tone="success">+8.4%</Pill></View><View style={styles.chart}>{[42, 55, 61, 58, 72, Math.max(30, Math.min(100, 50 + workoutSets.length * 3))].map((height, index) => <View key={index} style={styles.barSlot}><View style={[styles.bar, { height }]} /><Text style={styles.barLabel}>S{index + 1}</Text></View>)}</View></Card>
    <SectionHeader title="Biblioteca de exercícios" />
    {exercises.map(exercise => <Pressable key={`library-${exercise.id}`} accessibilityRole="button" onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })}><Card style={styles.libraryCard}><View style={styles.libraryIcon}><Ionicons name="play" size={15} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>{exercise.name}</Text><Text style={s.muted}>{exercise.target} · técnica, erros e alternativas</Text></View><Ionicons name="chevron-forward" size={17} color={colors.slate} /></Card></Pressable>)}
  </>;
}

function ProgressMetric({ value, label, icon, wide = false }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap; wide?: boolean }) {
  return <View style={[styles.progressMetric, wide && { flexBasis: '100%' }]}><View style={styles.metricIcon}><Ionicons name={icon} size={17} color={colors.accentDark} /></View><Text style={styles.progressMetricValue}>{value}</Text><Text style={styles.progressMetricLabel}>{label}</Text></View>;
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  sessionHero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 17, overflow: 'hidden', shadowColor: colors.accentDark, shadowOpacity: .14, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  sessionOrb: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: '#2474AC', right: -52, top: -68, opacity: .42 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  sessionEyebrow: { color: '#A9D1ED', fontSize: 8, lineHeight: 12, fontWeight: '900', letterSpacing: 1, flex: 1 },
  sessionTitle: { color: colors.white, fontSize: 26, lineHeight: 30, fontWeight: '900', letterSpacing: -.75, marginTop: 12 },
  sessionMeta: { color: '#D0E4F3', fontSize: 10, lineHeight: 15, marginTop: 3 },
  sessionProgress: { height: 5, borderRadius: 99, backgroundColor: '#285F86', overflow: 'hidden', marginTop: 14 },
  sessionProgressFill: { height: '100%', backgroundColor: '#7ABBE7', borderRadius: 99 },
  sessionStats: { flexDirection: 'row', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#326A92' },
  sessionStat: { flex: 1, gap: 1 },
  sessionStatValue: { color: colors.white, fontSize: 16, lineHeight: 20, fontWeight: '900' },
  sessionStatLabel: { color: '#8EBBD8', fontSize: 7, lineHeight: 10, fontWeight: '900', letterSpacing: .65 },
  tabs: { flexDirection: 'row', backgroundColor: colors.panel3, borderRadius: 15, padding: 4, marginTop: 12 },
  tab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  tabActive: { backgroundColor: colors.panel, shadowColor: '#31536F', shadowOpacity: .07, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  tabText: { color: colors.muted, fontSize: 11, lineHeight: 15, fontWeight: '800' },
  tabTextActive: { color: colors.accentDark },
  exerciseCard: { marginBottom: 10, padding: 14 },
  exerciseCardComplete: { borderColor: '#BFDCCB' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  exerciseHeading: { flex: 1, minWidth: 0 },
  headerRight: { alignItems: 'flex-end', gap: 5 },
  infoButton: { width: 30, height: 28, borderRadius: 9, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  exerciseIndex: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  exerciseIndexComplete: { backgroundColor: colors.success },
  exerciseIndexText: { color: colors.accentDark, fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: .3 },
  exerciseName: { color: colors.text, fontSize: 14, lineHeight: 18, fontWeight: '900' },
  exerciseMeta: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  performanceStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.bg, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, marginTop: 11 },
  performanceColumn: { flex: 1, minWidth: 0 },
  performanceArrow: { width: 22, alignItems: 'center', justifyContent: 'center' },
  performanceLabel: { color: colors.slateDark, fontSize: 7, lineHeight: 10, fontWeight: '900', letterSpacing: .55 },
  performanceValue: { color: colors.text, fontSize: 10, lineHeight: 14, fontWeight: '900', marginTop: 2 },
  setHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 1, marginTop: 11, marginBottom: 3 },
  setHeaderText: { color: colors.slateDark, fontSize: 7, lineHeight: 10, fontWeight: '900', letterSpacing: .55 },
  setNumberColumn: { width: 28 },
  saveColumn: { width: 40 },
  flexColumn: { flex: 1, minWidth: 0 },
  centerText: { textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingVertical: 2, paddingHorizontal: 1, borderRadius: 11 },
  setRowSaved: { backgroundColor: '#F2F8F5' },
  setNumber: { height: 28, borderRadius: 9, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  setNumberText: { color: colors.text, fontSize: 10, lineHeight: 14, fontWeight: '900', textAlign: 'center' },
  directInput: { height: 40, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.white, color: colors.text, textAlign: 'center', fontSize: 12, lineHeight: 16, fontWeight: '800', paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden' },
  saveSet: { height: 40, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  savedSet: { backgroundColor: colors.success },
  removeAction: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 6, paddingTop: 2 },
  removeText: { color: colors.danger, fontSize: 9, lineHeight: 13, fontWeight: '800' },
  finishWrap: { marginTop: 6, marginBottom: 4 },
  programmeHero: { borderRadius: radius.lg, backgroundColor: colors.accentSoft, padding: 16 },
  programmeEyebrow: { color: colors.accentDark, fontSize: 8, lineHeight: 12, fontWeight: '900', letterSpacing: .9 },
  programmeTitle: { color: colors.text, fontSize: 21, lineHeight: 25, fontWeight: '900', letterSpacing: -.5, marginTop: 6 },
  programmeMeta: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  programmeProgress: { height: 5, borderRadius: 99, backgroundColor: '#CEE0ED', marginTop: 13, overflow: 'hidden' },
  programmeProgressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  timelineCard: { paddingVertical: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  timelineMarker: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  timelineNumber: { color: colors.accentDark, fontSize: 11, lineHeight: 15, fontWeight: '900' },
  timelineTitle: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900' },
  timelineMeta: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  ruleCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  ruleIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  programmeOptions: { gap: 8 },
  programmeOption: { padding: 13 },
  optionEyebrow: { color: colors.accent, fontSize: 7, fontWeight: '900', letterSpacing: .7 },
  optionTitle: { color: colors.text, fontSize: 12, fontWeight: '900', marginTop: 4 },
  optionMeta: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 3 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  progressMetric: { flex: 1, minWidth: 136, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 17, padding: 14 },
  metricIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  progressMetricValue: { color: colors.text, fontSize: 19, lineHeight: 23, fontWeight: '900', letterSpacing: -.45, marginTop: 10 },
  progressMetricLabel: { color: colors.muted, fontSize: 9, lineHeight: 13, fontWeight: '700', marginTop: 2 },
  historyLink: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 12 },
  historyIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  historyMeta: { color: colors.muted, fontSize: 8, marginTop: 3 },
  chartCard: { padding: 15 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  chartEyebrow: { color: colors.slateDark, fontSize: 7, lineHeight: 10, fontWeight: '900', letterSpacing: .8 },
  chartTitle: { color: colors.text, fontSize: 14, lineHeight: 18, fontWeight: '900', marginTop: 2 },
  chart: { height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 14 },
  barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  bar: { width: '66%', backgroundColor: colors.accent, borderRadius: 5 },
  barLabel: { color: colors.muted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
  libraryCard: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  libraryIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
});

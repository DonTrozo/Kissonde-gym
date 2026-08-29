import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, exercises } from '../domain';
import { colors, radius } from '../theme';
import { Card, Metric, Pill, PrimaryButton, ScreenTitle, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { Shell, screenStyles as s } from './shared';

type TrainingTab = 'today' | 'programme' | 'progress';

export function TrainScreen() {
  const [tab, setTab] = useState<TrainingTab>('today');
  const { workoutSets, workoutCompleted, completeWorkout } = useAppState();
  const loggedExercises = new Set(workoutSets.map(set => set.exerciseId)).size;
  const totalTargetSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completion = Math.min(100, Math.round((workoutSets.length / totalTargetSets) * 100));

  return <Shell>
    <ScreenTitle eyebrow="Treinar" title="Treino com intenção." subtitle="Cada série fica registada para transformar esforço em progressão mensurável." />

    <View style={styles.sessionHero}>
      <View style={styles.sessionOrb} />
      <View style={styles.sessionTop}><Text style={styles.sessionEyebrow}>SESSÃO ATUAL · SEMANA 4</Text><Pill tone={workoutCompleted ? 'success' : 'info'}>{workoutCompleted ? 'Concluído' : `${completion}%`}</Pill></View>
      <Text style={styles.sessionTitle}>Push Day</Text>
      <Text style={styles.sessionMeta}>Hipertrofia intermédia · {exercises.length} exercícios · {totalTargetSets} séries</Text>
      <View style={styles.sessionProgress}><View style={[styles.sessionProgressFill, { width: `${completion}%` as any }]} /></View>
      <View style={styles.sessionStats}><SessionStat value={`${workoutSets.length}`} label="SÉRIES" /><SessionStat value={`${loggedExercises}`} label="EXERCÍCIOS" /><SessionStat value={`${totalTargetSets - workoutSets.length}`} label="POR REGISTAR" /></View>
    </View>

    <View style={styles.tabs}>
      <TabButton active={tab === 'today'} label="Hoje" onPress={() => setTab('today')} />
      <TabButton active={tab === 'programme'} label="Programa" onPress={() => setTab('programme')} />
      <TabButton active={tab === 'progress'} label="Progresso" onPress={() => setTab('progress')} />
    </View>

    {tab === 'today' ? <>
      <SectionHeader title="Exercícios" action={`${workoutSets.length}/${totalTargetSets} séries`} />
      {exercises.map((exercise, index) => <ExerciseLogger key={exercise.id} exercise={exercise} order={index + 1} />)}
      <View style={styles.finishWrap}><PrimaryButton disabled={workoutSets.length === 0 || workoutCompleted} label={workoutCompleted ? 'Treino concluído' : 'Concluir treino · +20 pontos'} onPress={completeWorkout} /></View>
    </> : null}

    {tab === 'programme' ? <ProgrammeView /> : null}
    {tab === 'progress' ? <ProgressView /> : null}
  </Shell>;
}

function SessionStat({ value, label }: { value: string; label: string }) {
  return <View style={styles.sessionStat}><Text style={styles.sessionStatValue}>{value}</Text><Text style={styles.sessionStatLabel}>{label}</Text></View>;
}

function ExerciseLogger({ exercise, order }: { exercise: Exercise; order: number }) {
  const { workoutSets, removeWorkoutSet } = useAppState();
  const sets = workoutSets.filter(set => set.exerciseId === exercise.id);
  const complete = sets.length >= exercise.sets;
  return <Card style={[styles.exerciseCard, complete && styles.exerciseCardComplete]}>
    <View style={styles.exerciseHeader}>
      <View style={[styles.exerciseIndex, complete && styles.exerciseIndexComplete]}><Text style={[styles.exerciseIndexText, complete && { color: colors.white }]}>{String(order).padStart(2, '0')}</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseMeta}>{exercise.target} · objetivo {exercise.sets} × {exercise.reps}</Text></View>
      <Pill tone={complete ? 'success' : 'info'}>{sets.length}/{exercise.sets}</Pill>
    </View>

    <View style={styles.performanceStrip}>
      <View style={{ flex: 1 }}><Text style={styles.performanceLabel}>ÚLTIMA SESSÃO</Text><Text style={styles.performanceValue}>{exercise.previous}</Text></View>
      <Ionicons name="arrow-forward" size={16} color={colors.slate} />
      <View style={{ flex: 1 }}><Text style={styles.performanceLabel}>ALVO DE HOJE</Text><Text style={styles.performanceValue}>{exercise.suggested}</Text></View>
    </View>

    <View style={styles.setHeader}><Text style={[styles.setHeaderText, { width: 30 }]}>SET</Text><Text style={[styles.setHeaderText, { flex: 1 }]}>PESO</Text><Text style={[styles.setHeaderText, { flex: 1 }]}>REPS</Text><Text style={[styles.setHeaderText, { width: 44, textAlign: 'center' }]}>OK</Text></View>
    {Array.from({ length: exercise.sets }).map((_, index) => <SetRow key={index + 1} exercise={exercise} setNumber={index + 1} />)}
    {sets.length > 0 ? <Pressable accessibilityRole="button" onPress={() => { const last = [...sets].sort((a, b) => b.setNumber - a.setNumber)[0]; if (last) removeWorkoutSet(last.id); }} style={styles.removeAction}><Ionicons name="arrow-undo-outline" size={15} color={colors.danger} /><Text style={styles.removeText}>Desfazer última série</Text></Pressable> : null}
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
    <View style={styles.setNumber}><Text style={styles.setNumberText}>{setNumber}</Text></View>
    <View style={styles.inputWrap}><TextInput accessibilityLabel={`Peso série ${setNumber}`} keyboardType="decimal-pad" value={weight} onChangeText={setWeight} placeholder="0" placeholderTextColor={colors.slate} style={styles.setInput} /><Text style={styles.inputUnit}>kg</Text></View>
    <View style={styles.inputWrap}><TextInput accessibilityLabel={`Repetições série ${setNumber}`} keyboardType="number-pad" value={reps} onChangeText={setReps} placeholder="0" placeholderTextColor={colors.slate} style={styles.setInput} /></View>
    <Pressable accessibilityRole="button" accessibilityLabel={`Guardar série ${setNumber}`} onPress={save} style={[styles.saveSet, existing && styles.savedSet]}><Ionicons name={existing ? 'checkmark' : 'add'} size={18} color={existing ? colors.white : colors.accentDark} /></Pressable>
  </View>;
}

function ProgrammeView() {
  const weeks = [
    { day: 'Dia 1', name: 'Push', detail: 'Peito · Ombros · Tríceps' },
    { day: 'Dia 2', name: 'Pull', detail: 'Costas · Bíceps · Posterior' },
    { day: 'Dia 3', name: 'Legs', detail: 'Quadríceps · Glúteos · Gémeos' },
    { day: 'Dia 4', name: 'Upper', detail: 'Volume superior e braços' },
  ];
  return <>
    <SectionHeader title="Plano atual" />
    <View style={styles.programmeHero}><Text style={styles.programmeEyebrow}>12 SEMANAS · HIPERTROFIA</Text><Text style={styles.programmeTitle}>Semana 4 de 12</Text><Text style={styles.programmeMeta}>4 sessões por semana · Nível intermédio</Text><View style={styles.programmeProgress}><View style={styles.programmeProgressFill} /></View></View>
    <SectionHeader title="Estrutura semanal" />
    <Card style={styles.timelineCard}>
      {weeks.map((item, index) => <View key={item.day} style={[styles.timelineRow, index === weeks.length - 1 && { borderBottomWidth: 0 }]}><View style={styles.timelineMarker}><Text style={styles.timelineNumber}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.timelineTitle}>{item.day} · {item.name}</Text><Text style={styles.timelineMeta}>{item.detail}</Text></View>{index === 0 ? <Pill tone="info">Hoje</Pill> : null}</View>)}
    </Card>
    <SectionHeader title="Regra de progressão" />
    <Card style={styles.ruleCard}><View style={styles.ruleIcon}><Ionicons name="trending-up" size={21} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>Aumenta quando estiver sólido.</Text><Text style={s.muted}>Completa a meta de repetições com boa técnica. O histórico registado passa a ser a referência para a próxima recomendação.</Text></View></Card>
  </>;
}

function ProgressView() {
  const { workoutSets } = useAppState();
  const benchSets = workoutSets.filter(set => set.exerciseId === 'bench');
  const bestBench = benchSets.length ? Math.max(...benchSets.map(set => set.weightKg)) : 80;
  const totalVolume = useMemo(() => workoutSets.reduce((sum, set) => sum + (set.weightKg * set.reps), 0), [workoutSets]);
  return <>
    <SectionHeader title="Resumo de desempenho" />
    <View style={styles.progressGrid}>
      <ProgressMetric value={`${bestBench} kg`} label="Melhor supino" icon="barbell-outline" />
      <ProgressMetric value={`${workoutSets.length}`} label="Séries hoje" icon="checkmark-done-outline" />
      <ProgressMetric value={`${Math.round(totalVolume).toLocaleString('pt-PT')} kg`} label="Volume" icon="stats-chart-outline" wide />
    </View>
    <SectionHeader title="Volume · últimas semanas" />
    <Card style={styles.chartCard}><View style={styles.chartHeader}><View><Text style={styles.chartEyebrow}>TENDÊNCIA</Text><Text style={styles.chartTitle}>Carga total movimentada</Text></View><Pill tone="success">+8.4%</Pill></View><View style={styles.chart}>{[42, 55, 61, 58, 72, Math.max(30, Math.min(100, 50 + workoutSets.length * 3))].map((height, index) => <View key={index} style={styles.barSlot}><View style={[styles.bar, { height }]} /><Text style={styles.barLabel}>S{index + 1}</Text></View>)}</View></Card>
    <SectionHeader title="Biblioteca" />
    {exercises.map(exercise => <Card key={`library-${exercise.id}`} style={styles.libraryCard}><View style={styles.libraryIcon}><Ionicons name="play" size={16} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>{exercise.name}</Text><Text style={s.muted}>{exercise.target} · técnica e alternativas</Text></View><Ionicons name="chevron-forward" size={18} color={colors.slate} /></Card>)}
  </>;
}

function ProgressMetric({ value, label, icon, wide = false }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap; wide?: boolean }) {
  return <View style={[styles.progressMetric, wide && { flexBasis: '100%' }]}><View style={styles.metricIcon}><Ionicons name={icon} size={18} color={colors.accentDark} /></View><Text style={styles.progressMetricValue}>{value}</Text><Text style={styles.progressMetricLabel}>{label}</Text></View>;
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  sessionHero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 19, overflow: 'hidden', shadowColor: colors.accentDark, shadowOpacity: .16, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  sessionOrb: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: '#2474AC', right: -55, top: -70, opacity: .42 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sessionEyebrow: { color: '#A9D1ED', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  sessionTitle: { color: colors.white, fontSize: 28, fontWeight: '900', letterSpacing: -.85, marginTop: 15 },
  sessionMeta: { color: '#D0E4F3', fontSize: 11, lineHeight: 17, marginTop: 4 },
  sessionProgress: { height: 6, borderRadius: 99, backgroundColor: '#285F86', overflow: 'hidden', marginTop: 17 },
  sessionProgressFill: { height: '100%', backgroundColor: '#7ABBE7', borderRadius: 99 },
  sessionStats: { flexDirection: 'row', marginTop: 18, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#326A92' },
  sessionStat: { flex: 1, gap: 2 },
  sessionStatValue: { color: colors.white, fontSize: 17, fontWeight: '900' },
  sessionStatLabel: { color: '#8EBBD8', fontSize: 8, fontWeight: '900', letterSpacing: .7 },
  tabs: { flexDirection: 'row', backgroundColor: colors.panel3, borderRadius: 16, padding: 4, marginTop: 14, marginBottom: 2 },
  tab: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: colors.panel, shadowColor: '#31536F', shadowOpacity: .08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.accentDark },
  exerciseCard: { marginBottom: 12, padding: 15 },
  exerciseCardComplete: { borderColor: '#BFDCCB' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  exerciseIndex: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  exerciseIndexComplete: { backgroundColor: colors.success },
  exerciseIndexText: { color: colors.accentDark, fontSize: 11, fontWeight: '900', letterSpacing: .3 },
  exerciseName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  exerciseMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
  performanceStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 13, padding: 11, marginTop: 14 },
  performanceLabel: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .6 },
  performanceValue: { color: colors.text, fontSize: 11, fontWeight: '900', marginTop: 3 },
  setHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 3, marginTop: 14, marginBottom: 5 },
  setHeaderText: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .6 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 48, paddingVertical: 4, paddingHorizontal: 3, borderRadius: 12 },
  setRowSaved: { backgroundColor: '#F2F8F5' },
  setNumber: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  setNumberText: { color: colors.text, fontSize: 11, fontWeight: '900' },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 40, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.white, paddingHorizontal: 7 },
  setInput: { flex: 1, color: colors.text, textAlign: 'center', fontSize: 13, fontWeight: '800', paddingVertical: 8 },
  inputUnit: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  saveSet: { width: 44, height: 40, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  savedSet: { backgroundColor: colors.success },
  removeAction: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5, marginTop: 8 },
  removeText: { color: colors.danger, fontSize: 10, fontWeight: '800' },
  finishWrap: { marginTop: 5 },
  programmeHero: { borderRadius: radius.lg, backgroundColor: colors.accentSoft, padding: 18 },
  programmeEyebrow: { color: colors.accentDark, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  programmeTitle: { color: colors.text, fontSize: 23, fontWeight: '900', letterSpacing: -.6, marginTop: 7 },
  programmeMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  programmeProgress: { height: 6, borderRadius: 99, backgroundColor: '#CEE0ED', marginTop: 16, overflow: 'hidden' },
  programmeProgressFill: { width: '33%', height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  timelineCard: { paddingVertical: 5 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  timelineMarker: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  timelineNumber: { color: colors.accentDark, fontSize: 12, fontWeight: '900' },
  timelineTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  timelineMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
  ruleCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ruleIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  progressMetric: { flex: 1, minWidth: 140, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#E3EAF0', borderRadius: 18, padding: 15 },
  metricIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  progressMetricValue: { color: colors.text, fontSize: 21, fontWeight: '900', letterSpacing: -.5, marginTop: 12 },
  progressMetricLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', marginTop: 3 },
  chartCard: { padding: 17 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  chartEyebrow: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .9 },
  chartTitle: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 3 },
  chart: { height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 18 },
  barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 7 },
  bar: { width: '66%', backgroundColor: colors.accent, borderRadius: 6 },
  barLabel: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  libraryCard: { marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13 },
  libraryIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
});

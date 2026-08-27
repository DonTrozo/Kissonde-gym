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
    <ScreenTitle eyebrow="Treinar" title="Programa, execução e progresso." subtitle="Regista cada série para que a progressão seja baseada no que realmente fizeste." />
    <View style={styles.tabs}>
      <TabButton active={tab === 'today'} label="Hoje" onPress={() => setTab('today')} />
      <TabButton active={tab === 'programme'} label="Programa" onPress={() => setTab('programme')} />
      <TabButton active={tab === 'progress'} label="Progresso" onPress={() => setTab('progress')} />
    </View>

    {tab === 'today' ? <>
      <Card style={{ gap: 8 }}><Text style={s.accentLabel}>SESSÃO ATUAL</Text><Text style={s.cardTitle}>Push Day · Semana 4</Text><Text style={s.muted}>Hipertrofia intermédia · 5 exercícios</Text><View style={s.metricsRow}><Metric value={`${workoutSets.length}/${totalTargetSets}`} label="Séries registadas" /><Metric value={`${loggedExercises}/5`} label="Exercícios iniciados" /><Metric value={`${completion}%`} label="Sessão" /></View><View style={s.progressTrack}><View style={[s.progressFill, { width: `${completion}%` as any }]} /></View></Card>
      <SectionHeader title="Exercícios" />
      {exercises.map(exercise => <ExerciseLogger key={exercise.id} exercise={exercise} />)}
      <PrimaryButton disabled={workoutSets.length === 0 || workoutCompleted} label={workoutCompleted ? 'Treino concluído' : 'Concluir treino · +20 pontos'} onPress={completeWorkout} />
    </> : null}

    {tab === 'programme' ? <ProgrammeView /> : null}
    {tab === 'progress' ? <ProgressView /> : null}
  </Shell>;
}

function ExerciseLogger({ exercise }: { exercise: Exercise }) {
  const { workoutSets, logWorkoutSet, removeWorkoutSet } = useAppState();
  const sets = workoutSets.filter(set => set.exerciseId === exercise.id);
  return <Card style={{ marginBottom: 12 }}>
    <View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{exercise.name}</Text><Text style={s.muted}>{exercise.target} · objetivo {exercise.sets} × {exercise.reps}</Text></View><Pill tone={sets.length >= exercise.sets ? 'success' : 'info'}>{sets.length}/{exercise.sets}</Pill></View>
    <View style={styles.compare}><View><Text style={s.label}>ÚLTIMA SESSÃO</Text><Text style={styles.compareValue}>{exercise.previous}</Text></View><Ionicons name="arrow-forward" size={18} color={colors.slate} /><View><Text style={s.label}>SUGERIDO</Text><Text style={styles.compareValue}>{exercise.suggested}</Text></View></View>
    <View style={{ height: 12 }} />
    {Array.from({ length: exercise.sets }).map((_, index) => <SetRow key={index + 1} exercise={exercise} setNumber={index + 1} />)}
    {sets.length > 0 ? <Pressable accessibilityRole="button" onPress={() => { const last = sets.sort((a, b) => b.setNumber - a.setNumber)[0]; if (last) removeWorkoutSet(last.id); }}><Text style={styles.removeText}>Remover última série</Text></Pressable> : null}
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

  return <View style={styles.setRow}>
    <View style={styles.setNumber}><Text style={styles.setNumberText}>{setNumber}</Text></View>
    <TextInput accessibilityLabel={`Peso série ${setNumber}`} keyboardType="decimal-pad" value={weight} onChangeText={setWeight} placeholder="kg" placeholderTextColor={colors.slate} style={[s.inputSmall, styles.setInput]} />
    <Text style={styles.unit}>kg</Text>
    <TextInput accessibilityLabel={`Repetições série ${setNumber}`} keyboardType="number-pad" value={reps} onChangeText={setReps} placeholder="reps" placeholderTextColor={colors.slate} style={[s.inputSmall, styles.setInput]} />
    <Pressable accessibilityRole="button" accessibilityLabel={`Guardar série ${setNumber}`} onPress={save} style={[styles.saveSet, existing && styles.savedSet]}><Ionicons name={existing ? 'checkmark' : 'save-outline'} size={18} color={existing ? '#FFFFFF' : colors.accent} /></Pressable>
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
    <Card><Text style={s.accentLabel}>PROGRAMA ATUAL</Text><Text style={[s.cardTitle, { marginTop: 6 }]}>12 Semanas · Hipertrofia</Text><Text style={s.muted}>Semana 4 de 12 · 4 sessões por semana · Intermédio</Text><View style={s.progressTrack}><View style={[s.progressFill, { width: '33%' }]} /></View></Card>
    <SectionHeader title="Estrutura semanal" />
    {weeks.map((item, index) => <Card key={item.day} style={{ marginBottom: 10 }}><View style={s.row}><View style={styles.dayBadge}><Text style={styles.dayBadgeText}>{index + 1}</Text></View><View><Text style={s.cardTitle}>{item.day} · {item.name}</Text><Text style={s.muted}>{item.detail}</Text></View></View></Card>)}
    <SectionHeader title="Regra de progressão" />
    <Card><Text style={s.cardTitle}>Progressão gradual de carga</Text><Text style={s.muted}>Quando completares todas as séries dentro da meta de repetições com boa técnica, aumenta a carga na sessão seguinte. O histórico registado passa a ser a referência para a recomendação seguinte.</Text></Card>
  </>;
}

function ProgressView() {
  const { workoutSets } = useAppState();
  const benchSets = workoutSets.filter(set => set.exerciseId === 'bench');
  const bestBench = benchSets.length ? Math.max(...benchSets.map(set => set.weightKg)) : 80;
  const totalVolume = useMemo(() => workoutSets.reduce((sum, set) => sum + (set.weightKg * set.reps), 0), [workoutSets]);
  return <>
    <Card><View style={s.metricsRow}><Metric value={`${bestBench} kg`} label="Melhor supino" /><Metric value={`${workoutSets.length}`} label="Séries hoje" /><Metric value={`${Math.round(totalVolume).toLocaleString('pt-PT')} kg`} label="Volume registado" /></View></Card>
    <SectionHeader title="Volume · últimas semanas" />
    <Card><View style={styles.chart}>{[42, 55, 61, 58, 72, Math.max(30, Math.min(100, 50 + workoutSets.length * 3))].map((height, index) => <View key={index} style={styles.barSlot}><View style={[styles.bar, { height }]} /><Text style={styles.barLabel}>S{index + 1}</Text></View>)}</View></Card>
    <SectionHeader title="Biblioteca de exercícios" />
    {exercises.map(exercise => <Card key={`library-${exercise.id}`} style={{ marginBottom: 10 }}><View style={s.between}><View style={{ flex: 1 }}><Text style={s.cardTitle}>{exercise.name}</Text><Text style={s.muted}>{exercise.target} · técnica, progressão e alternativas</Text></View><Ionicons name="play-circle-outline" size={28} color={colors.accent} /></View></Card>)}
  </>;
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', backgroundColor: colors.panel2, borderRadius: radius.md, padding: 4, marginBottom: 18 },
  tab: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border },
  tabText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.accent },
  compare: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  compareValue: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 4 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  setNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  setNumberText: { color: colors.text, fontSize: 12, fontWeight: '900' },
  setInput: { flex: 1, minWidth: 58, textAlign: 'center', paddingHorizontal: 6 },
  unit: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  saveSet: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  savedSet: { backgroundColor: colors.success, borderColor: colors.success },
  removeText: { color: colors.danger, fontSize: 12, fontWeight: '800', textAlign: 'right', marginTop: 4 },
  dayBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E7EFF7', alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { color: colors.accentDark, fontWeight: '900' },
  chart: { height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  bar: { width: '70%', backgroundColor: colors.accent, borderRadius: 6 },
  barLabel: { color: colors.muted, fontSize: 11 },
});

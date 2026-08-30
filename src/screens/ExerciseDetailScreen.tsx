import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { exercises } from '../domain';
import { guideForExercise } from '../product';
import { colors, radius } from '../theme';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { EmptyState, Shell } from './shared';

export function ExerciseDetailScreen() {
  const route = useRoute<any>();
  const exerciseId = route.params?.exerciseId as string | undefined;
  const exercise = exercises.find(item => item.id === exerciseId);
  const guide = exerciseId ? guideForExercise(exerciseId) : undefined;

  if (!exercise || !guide) return <Shell><Card><EmptyState title="Exercício indisponível" text="Não foi possível carregar o guia técnico deste exercício." /></Card></Shell>;

  return <Shell>
    <ScreenTitle eyebrow={exercise.target} title={exercise.name} subtitle={`${guide.equipment} · objetivo ${exercise.sets} × ${exercise.reps}`} />
    <View style={styles.videoCard}><View style={styles.videoIcon}><Ionicons name="play" size={25} color={colors.white} /></View><Text style={styles.videoTitle}>Demonstração do movimento</Text><Text style={styles.videoMeta}>{guide.videoLabel}</Text><Pill tone="info">Conteúdo preparado</Pill></View>

    <SectionHeader title="Músculos trabalhados" />
    <Card style={styles.muscles}><View style={styles.muscleBlock}><Text style={styles.muscleLabel}>PRINCIPAIS</Text><View style={styles.tags}>{guide.primaryMuscles.map(item => <Tag key={item} text={item} primary />)}</View></View>{guide.secondaryMuscles.length ? <View style={styles.muscleBlock}><Text style={styles.muscleLabel}>SECUNDÁRIOS</Text><View style={styles.tags}>{guide.secondaryMuscles.map(item => <Tag key={item} text={item} />)}</View></View> : null}</Card>

    <SectionHeader title="Preparação" />
    <Card style={styles.steps}>{guide.setup.map((item, index) => <Step key={item} index={index + 1} text={item} />)}</Card>

    <SectionHeader title="Execução" />
    <Card style={styles.steps}>{guide.execution.map((item, index) => <Step key={item} index={index + 1} text={item} />)}</Card>

    <SectionHeader title="Erros comuns" />
    <Card style={styles.warningCard}>{guide.mistakes.map(item => <View key={item} style={styles.warningRow}><Ionicons name="alert-circle-outline" size={17} color={colors.warning} /><Text style={styles.warningText}>{item}</Text></View>)}</Card>

    <SectionHeader title="Alternativas" />
    <View style={styles.alternatives}>{guide.alternatives.map(item => <Pressable key={item} style={styles.alternative}><View style={styles.altIcon}><Ionicons name="swap-horizontal-outline" size={17} color={colors.accentDark} /></View><Text style={styles.altText}>{item}</Text><Ionicons name="chevron-forward" size={16} color={colors.slate} /></Pressable>)}</View>
  </Shell>;
}

function Step({ index, text }: { index: number; text: string }) {
  return <View style={styles.step}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index}</Text></View><Text style={styles.stepText}>{text}</Text></View>;
}

function Tag({ text, primary = false }: { text: string; primary?: boolean }) {
  return <View style={[styles.tag, primary && styles.tagPrimary]}><Text style={[styles.tagText, primary && styles.tagTextPrimary]}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  videoCard: { minHeight: 180, borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 18, alignItems: 'flex-start', justifyContent: 'flex-end', overflow: 'hidden' },
  videoIcon: { position: 'absolute', top: 22, right: 22, width: 52, height: 52, borderRadius: 18, backgroundColor: '#287AB4', alignItems: 'center', justifyContent: 'center' },
  videoTitle: { color: colors.white, fontSize: 19, lineHeight: 24, fontWeight: '900' },
  videoMeta: { color: '#C9E1F1', fontSize: 10, marginTop: 4, marginBottom: 10 },
  muscles: { gap: 15 },
  muscleBlock: { gap: 8 },
  muscleLabel: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .9 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: { backgroundColor: colors.panel2, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 },
  tagPrimary: { backgroundColor: colors.accentSoft },
  tagText: { color: colors.slateDark, fontSize: 9, fontWeight: '800' },
  tagTextPrimary: { color: colors.accentDark },
  steps: { paddingVertical: 3 },
  step: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10 },
  stepNumber: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: colors.accentDark, fontSize: 10, fontWeight: '900' },
  stepText: { flex: 1, color: colors.text, fontSize: 10, lineHeight: 16, fontWeight: '700' },
  warningCard: { gap: 10, backgroundColor: '#FFFDF8', borderColor: '#F0DFC1' },
  warningRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  warningText: { flex: 1, color: colors.text, fontSize: 10, lineHeight: 16 },
  alternatives: { gap: 8 },
  alternative: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 12 },
  altIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  altText: { flex: 1, color: colors.text, fontSize: 11, fontWeight: '900' },
});

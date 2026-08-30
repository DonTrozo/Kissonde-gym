import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../brand';
import { colors, radius } from '../theme';
import { PrimaryButton } from '../ui';
import { experienceLabels, ExperienceLevel, FitnessGoal, goalLabels, MemberPreferences, programmeForGoal } from '../product';
import { useAppState } from '../state';
import { Shell } from './shared';

const goals: FitnessGoal[] = ['muscle', 'weight-loss', 'strength', 'fitness', 'health'];
const experiences: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
const dayOptions = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const goalIcons: Record<FitnessGoal, keyof typeof Ionicons.glyphMap> = {
  muscle: 'barbell-outline',
  'weight-loss': 'flame-outline',
  strength: 'trending-up-outline',
  fitness: 'heart-outline',
  health: 'leaf-outline',
};
const experienceIcons: Record<ExperienceLevel, keyof typeof Ionicons.glyphMap> = {
  beginner: 'walk-outline',
  intermediate: 'fitness-outline',
  advanced: 'flash-outline',
};

export function OnboardingScreen() {
  const { completeOnboarding } = useAppState();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<FitnessGoal>('muscle');
  const [experience, setExperience] = useState<ExperienceLevel>('intermediate');
  const [trainingDays, setTrainingDays] = useState(4);
  const [preferredDays, setPreferredDays] = useState<string[]>(['Seg', 'Ter', 'Qui', 'Sáb']);
  const programme = programmeForGoal(goal);

  const next = () => setStep(current => Math.min(3, current + 1));
  const back = () => setStep(current => Math.max(0, current - 1));
  const toggleDay = (day: string) => {
    setPreferredDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  };

  const finish = () => {
    const preferences: MemberPreferences = { goal, experience, trainingDays, preferredDays, wantsProgramme: true };
    completeOnboarding(preferences);
  };

  return <Shell>
    <View style={styles.top}><BrandLogo width={118} /><Text style={styles.stepText}>{step + 1}/4</Text></View>
    <View style={styles.progress}><View style={[styles.progressFill, { width: `${((step + 1) / 4) * 100}%` as any }]} /></View>

    {step === 0 ? <>
      <Text style={styles.eyebrow}>OBJETIVO</Text><Text style={styles.title}>O que queres alcançar?</Text><Text style={styles.subtitle}>A app usa esta escolha para organizar o treino, progresso e recomendações.</Text>
      <View style={styles.optionList}>{goals.map(item => <Choice key={item} active={goal === item} icon={goalIcon(item)} title={goalLabels[item]} onPress={() => setGoal(item)} />)}</View>
    </> : null}

    {step === 1 ? <>
      <Text style={styles.eyebrow}>EXPERIÊNCIA</Text><Text style={styles.title}>Qual é o teu nível atual?</Text><Text style={styles.subtitle}>Isto define o ritmo de progressão e a complexidade das sessões.</Text>
      <View style={styles.optionList}>{experiences.map(item => <Choice key={item} active={experience === item} icon={experienceIcon(item)} title={experienceLabels[item]} onPress={() => setExperience(item)} />)}</View>
    </> : null}

    {step === 2 ? <>
      <Text style={styles.eyebrow}>ROTINA</Text><Text style={styles.title}>Quantas vezes podes treinar?</Text><Text style={styles.subtitle}>Escolhe uma frequência sustentável. Podes alterar mais tarde.</Text>
      <View style={styles.dayCountRow}>{[2, 3, 4, 5, 6].map(value => <Pressable key={value} onPress={() => setTrainingDays(value)} style={[styles.dayCount, trainingDays === value && styles.dayCountActive]}><Text style={[styles.dayCountValue, trainingDays === value && styles.dayCountValueActive]}>{value}</Text><Text style={[styles.dayCountLabel, trainingDays === value && styles.dayCountValueActive]}>dias</Text></Pressable>)}</View>
      <Text style={styles.subheading}>Dias preferidos</Text>
      <View style={styles.weekRow}>{dayOptions.map(day => <Pressable key={day} onPress={() => toggleDay(day)} style={[styles.weekDay, preferredDays.includes(day) && styles.weekDayActive]}><Text style={[styles.weekDayText, preferredDays.includes(day) && styles.weekDayTextActive]}>{day}</Text></Pressable>)}</View>
    </> : null}

    {step === 3 ? <>
      <Text style={styles.eyebrow}>PROGRAMA</Text><Text style={styles.title}>O teu plano está preparado.</Text><Text style={styles.subtitle}>A experiência inicial será personalizada com base nas escolhas anteriores.</Text>
      <View style={styles.programmeCard}>
        <View style={styles.programmeIcon}><Ionicons name="barbell" size={24} color={colors.white} /></View>
        <Text style={styles.programmeEyebrow}>{programme.durationWeeks} SEMANAS · {programme.sessionsPerWeek} SESSÕES/SEMANA</Text>
        <Text style={styles.programmeTitle}>{programme.title}</Text>
        <Text style={styles.programmeMeta}>{programme.subtitle}</Text>
        <View style={styles.summaryRow}><Summary label="Objetivo" value={goalLabels[goal]} /><Summary label="Nível" value={experienceLabels[experience]} /></View>
        <View style={styles.summaryRow}><Summary label="Frequência" value={`${trainingDays} dias/semana`} /><Summary label="Primeira sessão" value={programme.dayTitle} /></View>
      </View>
    </> : null}

    <View style={styles.actions}>{step > 0 ? <Pressable accessibilityRole="button" onPress={back} style={styles.back}><Ionicons name="arrow-back" size={18} color={colors.accentDark} /><Text style={styles.backText}>Voltar</Text></Pressable> : <View />}{step < 3 ? <View style={styles.nextWrap}><PrimaryButton label="Continuar" onPress={next} /></View> : <View style={styles.nextWrap}><PrimaryButton label="Entrar na Kissonde" onPress={finish} /></View>}</View>
  </Shell>;
}

function Choice({ active, icon, title, onPress }: { active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><View style={[styles.choiceIcon, active && styles.choiceIconActive]}><Ionicons name={icon} size={20} color={active ? colors.white : colors.accentDark} /></View><Text style={[styles.choiceText, active && styles.choiceTextActive]}>{title}</Text><Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={active ? colors.accent : colors.slate} /></Pressable>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return <View style={styles.summary}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>;
}

function goalIcon(goal: FitnessGoal): keyof typeof Ionicons.glyphMap {
  return goalIcons[goal];
}

function experienceIcon(level: ExperienceLevel): keyof typeof Ionicons.glyphMap {
  return experienceIcons[level];
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  stepText: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  progress: { height: 5, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginBottom: 30 },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  eyebrow: { color: colors.accent, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 1.15 },
  title: { color: colors.text, fontSize: 28, lineHeight: 33, fontWeight: '900', letterSpacing: -.8, marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 520 },
  optionList: { gap: 10, marginTop: 22 },
  choice: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 14 },
  choiceActive: { borderColor: '#9CC8E7', backgroundColor: '#F3F9FD' },
  choiceIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  choiceIconActive: { backgroundColor: colors.accent },
  choiceText: { flex: 1, color: colors.text, fontSize: 13, fontWeight: '850' as any },
  choiceTextActive: { color: colors.accentDark },
  dayCountRow: { flexDirection: 'row', gap: 8, marginTop: 24 },
  dayCount: { flex: 1, minHeight: 72, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayCountActive: { backgroundColor: colors.accentDeep, borderColor: colors.accentDeep },
  dayCountValue: { color: colors.text, fontSize: 19, fontWeight: '900' },
  dayCountLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', marginTop: 2 },
  dayCountValueActive: { color: colors.white },
  subheading: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 26, marginBottom: 10 },
  weekRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  weekDay: { minWidth: 53, minHeight: 42, paddingHorizontal: 10, borderRadius: 13, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.panel },
  weekDayActive: { backgroundColor: colors.accentSoft, borderColor: '#A7CCE6' },
  weekDayText: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  weekDayTextActive: { color: colors.accentDark },
  programmeCard: { marginTop: 24, borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 20, overflow: 'hidden' },
  programmeIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#2678B4', alignItems: 'center', justifyContent: 'center' },
  programmeEyebrow: { color: '#9FC9E6', fontSize: 8, lineHeight: 12, fontWeight: '900', letterSpacing: .9, marginTop: 20 },
  programmeTitle: { color: colors.white, fontSize: 26, lineHeight: 30, fontWeight: '900', letterSpacing: -.7, marginTop: 5 },
  programmeMeta: { color: '#D1E5F3', fontSize: 11, lineHeight: 17, marginTop: 6 },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  summary: { flex: 1, backgroundColor: '#124A75', borderRadius: 13, padding: 11 },
  summaryLabel: { color: '#88B9D9', fontSize: 7, fontWeight: '900', letterSpacing: .7, textTransform: 'uppercase' },
  summaryValue: { color: colors.white, fontSize: 10, lineHeight: 14, fontWeight: '900', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28, paddingBottom: 8 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 6 },
  backText: { color: colors.accentDark, fontSize: 12, fontWeight: '900' },
  nextWrap: { minWidth: 180, flex: 1, maxWidth: 310 },
});

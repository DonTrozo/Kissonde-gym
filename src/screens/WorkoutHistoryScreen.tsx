import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { previousWorkouts } from '../product';
import { colors } from '../theme';
import { useAppState } from '../state';
import { Card, Pill, ScreenTitle, SectionHeader } from '../ui';
import { Shell } from './shared';

export function WorkoutHistoryScreen() {
  const { workoutSets } = useAppState();
  const currentVolume = Math.round(workoutSets.reduce((sum, set) => sum + set.weightKg * set.reps, 0));
  const totalVolume = previousWorkouts.reduce((sum, item) => sum + item.volumeKg, currentVolume);
  const totalSets = previousWorkouts.reduce((sum, item) => sum + item.sets, workoutSets.length);

  return <Shell>
    <ScreenTitle eyebrow="Treino" title="Histórico" subtitle="Sessões anteriores, volume, destaques e progressão num só lugar." />
    <View style={styles.metrics}><Metric value={`${previousWorkouts.length + (workoutSets.length ? 1 : 0)}`} label="Sessões" icon="calendar-outline" /><Metric value={`${totalSets}`} label="Séries" icon="checkmark-done-outline" /><Metric value={`${Math.round(totalVolume / 100) / 10} t`} label="Volume" icon="stats-chart-outline" /></View>

    {workoutSets.length ? <><SectionHeader title="Hoje" /><Card style={styles.current}><View style={styles.currentTop}><View><Text style={styles.currentTitle}>Sessão em curso</Text><Text style={styles.currentMeta}>{workoutSets.length} séries registadas · {currentVolume.toLocaleString('pt-PT')} kg</Text></View><Pill tone="info">Hoje</Pill></View></Card></> : null}

    <SectionHeader title="Sessões anteriores" />
    <View style={styles.list}>{previousWorkouts.map(item => <Card key={item.id} style={styles.card}><View style={styles.top}><View style={styles.date}><Text style={styles.dateText}>{item.date}</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>{item.duration} · {item.sets} séries · {item.volumeKg.toLocaleString('pt-PT')} kg</Text></View><Ionicons name="chevron-forward" size={18} color={colors.slate} /></View><View style={styles.highlights}>{item.highlights.map(highlight => <View key={highlight} style={styles.highlight}><Ionicons name="trophy-outline" size={14} color={colors.accentDark} /><Text style={styles.highlightText}>{highlight}</Text></View>)}</View></Card>)}</View>
  </Shell>;
}

function Metric({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) {
  return <View style={styles.metric}><View style={styles.metricIcon}><Ionicons name={icon} size={17} color={colors.accentDark} /></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, minHeight: 104, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12 },
  metricIcon: { width: 33, height: 33, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  metricValue: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 10 },
  metricLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', marginTop: 2 },
  current: { backgroundColor: colors.accentSoft, borderColor: '#BBD6E9' },
  currentTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  currentTitle: { color: colors.accentDark, fontSize: 12, fontWeight: '900' },
  currentMeta: { color: colors.slateDark, fontSize: 9, marginTop: 3 },
  list: { gap: 10 },
  card: { padding: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  date: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  dateText: { color: colors.accentDark, fontSize: 9, fontWeight: '900', textAlign: 'center' },
  title: { color: colors.text, fontSize: 13, fontWeight: '900' },
  meta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  highlights: { gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  highlight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  highlightText: { color: colors.text, fontSize: 9, fontWeight: '800' },
});

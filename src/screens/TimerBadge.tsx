import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { formatTimerSeconds, useTrainingTimer } from '../timer';

export function TimerBadge() {
  const navigation = useNavigation<any>();
  const { active } = useTrainingTimer();
  if (active.phase === 'complete' && !active.running) return null;
  const seconds = active.mode === 'stopwatch' ? active.elapsedSeconds : active.remainingSeconds;
  const label = active.phase === 'work' ? 'TRABALHO' : active.phase === 'rest' ? 'DESCANSO' : active.phase === 'prepare' ? 'PREPARAR' : 'TIMER';
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir timer. ${label}, ${formatTimerSeconds(seconds)}`} onPress={() => navigation.navigate('Timer')} style={styles.badge}>
    <View style={[styles.dot, { backgroundColor: active.phase === 'rest' ? colors.success : colors.accent }]} />
    <Text style={styles.label}>{label}</Text><Text style={styles.time}>{formatTimerSeconds(seconds)}</Text><Ionicons name="chevron-forward" size={15} color="#BFDCEC" />
  </Pressable>;
}

const styles = StyleSheet.create({
  badge: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, backgroundColor: colors.accentDeep, borderRadius: 14, marginBottom: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { color: '#9FC9E6', fontSize: 8, fontWeight: '900', letterSpacing: .75 },
  time: { flex: 1, color: colors.white, fontSize: 13, fontWeight: '900', textAlign: 'right' },
});

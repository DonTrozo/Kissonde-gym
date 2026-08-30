import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { formatTimerSeconds, useTrainingTimer } from '../timer';
import { TrainScreen } from './TrainScreen';

export function TrainingHubScreen() {
  const navigation = useNavigation<any>();
  const { active } = useTrainingTimer();
  const live = active.phase !== 'complete' || active.running;
  const seconds = active.mode === 'stopwatch' ? active.elapsedSeconds : active.remainingSeconds;
  const phase = active.phase === 'work' ? 'Trabalho' : active.phase === 'rest' ? 'Descanso' : active.phase === 'prepare' ? 'Preparar' : 'Timer';

  return <View style={styles.root}>
    <TrainScreen />
    <Pressable accessibilityRole="button" accessibilityLabel={live ? `Abrir timer. ${phase}, ${formatTimerSeconds(seconds)}` : 'Abrir Kissonde Timer'} onPress={() => navigation.navigate('Timer')} style={({ pressed }) => [styles.floating, live && styles.floatingLive, pressed && { opacity: .86 }]}>
      <View style={[styles.icon, live && styles.iconLive]}><Ionicons name="timer-outline" size={20} color={live ? colors.white : colors.accentDark} /></View>
      {live ? <><View style={styles.liveCopy}><Text style={styles.phase}>{phase.toUpperCase()}</Text><Text style={styles.time}>{formatTimerSeconds(seconds)}</Text></View><Ionicons name="chevron-forward" size={17} color="#B9D8EA" /></> : <Text style={styles.launchText}>Timer</Text>}
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  floating: { position: 'absolute', right: 16, bottom: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 10, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 18, shadowColor: '#153B58', shadowOpacity: .18, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
  floatingLive: { minWidth: 154, backgroundColor: colors.accentDeep, borderColor: colors.accentDeep },
  icon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  iconLive: { backgroundColor: '#287BB5' },
  launchText: { color: colors.accentDark, fontSize: 11, fontWeight: '900', paddingRight: 3 },
  liveCopy: { flex: 1 },
  phase: { color: '#9FC9E6', fontSize: 7, fontWeight: '900', letterSpacing: .75 },
  time: { color: colors.white, fontSize: 15, lineHeight: 18, fontWeight: '900', marginTop: 1 },
});

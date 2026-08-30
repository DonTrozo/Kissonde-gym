import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { formatTimerSeconds, TimerMode, useTrainingTimer } from '../timer';
import { Shell, screenStyles as s } from './shared';

type TimerTab = 'interval' | 'rest' | 'simple';

export function TimerScreen() {
  const timer = useTrainingTimer();
  const [tab, setTab] = useState<TimerTab>('interval');
  const [work, setWork] = useState('30');
  const [rest, setRest] = useState('30');
  const [rounds, setRounds] = useState('4');
  const [prepare, setPrepare] = useState('5');
  const [restSeconds, setRestSeconds] = useState(String(timer.settings.defaultRestSeconds));
  const [countdown, setCountdown] = useState('60');
  const [presetName, setPresetName] = useState('Meu intervalo');

  const displaySeconds = timer.active.mode === 'stopwatch' ? timer.active.elapsedSeconds : timer.active.remainingSeconds;
  const phaseLabel = timer.active.phase === 'prepare' ? 'PREPARAR' : timer.active.phase === 'work' ? 'TRABALHO' : timer.active.phase === 'rest' ? 'DESCANSO' : 'CONCLUÍDO';
  const activeColor = timer.active.phase === 'work' ? colors.accent : timer.active.phase === 'rest' ? colors.success : colors.warning;
  const progress = timer.active.phaseDurationSeconds > 0 && timer.active.mode !== 'stopwatch' ? Math.max(0, Math.min(100, ((timer.active.phaseDurationSeconds - timer.active.remainingSeconds) / timer.active.phaseDurationSeconds) * 100)) : 0;

  const beginInterval = () => timer.startInterval({ workSeconds: Number(work) || 30, restSeconds: Number(rest) || 30, rounds: Number(rounds) || 4, prepareSeconds: Number(prepare) || 0, label: presetName.trim() || undefined });
  const beginRest = () => timer.startRest(Number(restSeconds) || timer.settings.defaultRestSeconds, 'Descanso manual');
  const beginCountdown = () => timer.startCountdown(Number(countdown) || 60, 'Contagem decrescente');

  return <Shell>
    <ScreenTitle eyebrow="Kissonde Timer" title="Treina no teu ritmo." subtitle="Intervalos, tempo sob tensão, descanso entre séries e cronómetro num único lugar." />

    <View style={styles.activeHero}>
      <View style={styles.heroTop}><Pill tone={timer.active.phase === 'rest' ? 'success' : timer.active.phase === 'complete' ? 'default' : 'info'}>{phaseLabel}</Pill>{timer.active.totalRounds > 1 ? <Text style={styles.roundLabel}>ROUND {timer.active.round}/{timer.active.totalRounds}</Text> : null}</View>
      <Text style={[styles.clock, { color: timer.active.phase === 'complete' ? colors.white : '#FFFFFF' }]}>{formatTimerSeconds(displaySeconds)}</Text>
      <Text style={styles.activeMeta}>{timer.active.label ?? modeLabel(timer.active.mode)}</Text>
      {timer.active.mode !== 'stopwatch' ? <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: activeColor }]} /></View> : null}
      <View style={styles.heroActions}>
        {timer.active.running ? <HeroAction icon="pause" label="Pausar" onPress={timer.pause} /> : timer.active.phase !== 'complete' ? <HeroAction icon="play" label="Retomar" onPress={timer.resume} /> : <HeroAction icon="play" label="Iniciar" onPress={() => tab === 'rest' ? beginRest() : tab === 'simple' ? beginCountdown() : beginInterval()} />}
        {timer.active.mode !== 'stopwatch' && timer.active.phase !== 'complete' ? <HeroAction icon="add" label="+10s" onPress={() => timer.addSeconds(10)} /> : null}
        {timer.active.phase !== 'complete' ? <HeroAction icon="play-skip-forward" label="Saltar" onPress={timer.skipPhase} /> : null}
        <HeroAction icon="refresh" label="Reset" onPress={timer.reset} />
      </View>
    </View>

    <View style={styles.tabs}>
      <TabButton label="Intervalo" active={tab === 'interval'} onPress={() => setTab('interval')} />
      <TabButton label="Descanso" active={tab === 'rest'} onPress={() => setTab('rest')} />
      <TabButton label="Simples" active={tab === 'simple'} onPress={() => setTab('simple')} />
    </View>

    {tab === 'interval' ? <>
      <SectionHeader title="Tempo sob tensão / intervalos" />
      <Card>
        <View style={styles.fieldGrid}>
          <NumberField label="TRABALHO" value={work} onChange={setWork} suffix="seg" />
          <NumberField label="DESCANSO" value={rest} onChange={setRest} suffix="seg" />
          <NumberField label="ROUNDS" value={rounds} onChange={setRounds} />
          <NumberField label="PREPARAR" value={prepare} onChange={setPrepare} suffix="seg" />
        </View>
        <Text style={[s.label, { marginTop: 16, marginBottom: 7 }]}>NOME DO PRESET</Text>
        <TextInput accessibilityLabel="Nome do preset" value={presetName} onChangeText={setPresetName} style={s.input} placeholder="Ex.: TUT 30/30" placeholderTextColor={colors.slate} />
        <View style={styles.buttonGap}><PrimaryButton label="Começar intervalo" onPress={beginInterval} /></View>
        <View style={styles.buttonGap}><SecondaryButton label="Guardar como preset" onPress={() => timer.savePreset({ label: presetName.trim() || 'Meu intervalo', workSeconds: Number(work) || 30, restSeconds: Number(rest) || 30, rounds: Number(rounds) || 4, prepareSeconds: Number(prepare) || 0 })} /></View>
      </Card>

      <SectionHeader title="Presets" action={`${timer.presets.length} guardados`} />
      <View style={styles.presetGrid}>{timer.presets.map(preset => <Pressable key={preset.id} accessibilityRole="button" onPress={() => { setWork(String(preset.workSeconds)); setRest(String(preset.restSeconds)); setRounds(String(preset.rounds)); setPrepare(String(preset.prepareSeconds)); setPresetName(preset.label); timer.startInterval({ ...preset }); }} style={styles.presetCard}><View style={styles.presetIcon}><Ionicons name="timer-outline" size={18} color={colors.accentDark} /></View><Text style={styles.presetTitle}>{preset.label}</Text><Text style={styles.presetMeta}>{preset.workSeconds}s trabalho · {preset.restSeconds}s descanso</Text><Text style={styles.presetRounds}>{preset.rounds} rounds</Text></Pressable>)}</View>
    </> : null}

    {tab === 'rest' ? <>
      <SectionHeader title="Descanso entre séries" />
      <Card>
        <Text style={s.cardTitle}>Descanso rápido</Text><Text style={s.muted}>Usa manualmente ou ativa o início automático sempre que guardares uma série.</Text>
        <View style={styles.quickRestRow}>{[30, 45, 60, 90, 120, 180].map(value => <Pressable key={value} onPress={() => { setRestSeconds(String(value)); timer.startRest(value, `Descanso ${value}s`); }} style={[styles.quickRest, Number(restSeconds) === value && styles.quickRestActive]}><Text style={[styles.quickRestText, Number(restSeconds) === value && styles.quickRestTextActive]}>{value < 60 ? `${value}s` : `${value / 60}m`}</Text></Pressable>)}</View>
        <NumberField label="PERSONALIZADO" value={restSeconds} onChange={setRestSeconds} suffix="seg" full />
        <View style={styles.buttonGap}><PrimaryButton label="Iniciar descanso" onPress={beginRest} /></View>
      </Card>
    </> : null}

    {tab === 'simple' ? <>
      <SectionHeader title="Contagem decrescente" />
      <Card><NumberField label="DURAÇÃO" value={countdown} onChange={setCountdown} suffix="seg" full /><View style={styles.buttonGap}><PrimaryButton label="Começar contagem" onPress={beginCountdown} /></View></Card>
      <SectionHeader title="Cronómetro" />
      <Card style={styles.stopwatchCard}><View style={styles.stopwatchIcon}><Ionicons name="stopwatch-outline" size={24} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>Cronómetro livre</Text><Text style={s.muted}>Para pranchas, mobilidade, cardio, holds e testes.</Text></View><Pressable onPress={timer.startStopwatch} style={styles.playCircle}><Ionicons name="play" size={18} color={colors.white} /></Pressable></Card>
    </> : null}

    <SectionHeader title="Preferências do timer" />
    <Card style={styles.settingsCard}>
      <SettingRow icon="volume-high-outline" label="Som nas transições" value={timer.settings.soundEnabled} onChange={value => timer.updateSettings({ soundEnabled: value })} />
      <SettingRow icon="phone-portrait-outline" label="Vibração" value={timer.settings.vibrationEnabled} onChange={value => timer.updateSettings({ vibrationEnabled: value })} />
      <SettingRow icon="sunny-outline" label="Manter ecrã ativo" value={timer.settings.keepAwake} onChange={value => timer.updateSettings({ keepAwake: value })} />
      <SettingRow icon="flash-outline" label="Descanso automático ao guardar série" value={timer.settings.autoRestAfterSet} onChange={value => timer.updateSettings({ autoRestAfterSet: value })} last />
    </Card>
  </Shell>;
}

function modeLabel(mode: TimerMode) { return mode === 'interval' ? 'Intervalo de treino' : mode === 'rest' ? 'Descanso entre séries' : mode === 'countdown' ? 'Contagem decrescente' : 'Cronómetro'; }
function HeroAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.heroAction}><Ionicons name={icon} size={17} color={colors.white} /><Text style={styles.heroActionText}>{label}</Text></Pressable>; }
function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>; }
function NumberField({ label, value, onChange, suffix, full = false }: { label: string; value: string; onChange: (value: string) => void; suffix?: string; full?: boolean }) { return <View style={[styles.numberField, full && { flexBasis: '100%' }]}><Text style={styles.numberLabel}>{label}</Text><View style={styles.numberInputWrap}><TextInput accessibilityLabel={label} keyboardType="number-pad" value={value} onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 4))} style={styles.numberInput} /><Text style={styles.numberSuffix}>{suffix ?? ''}</Text></View></View>; }
function SettingRow({ icon, label, value, onChange, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) { return <View style={[styles.settingRow, last && { borderBottomWidth: 0 }]}><View style={styles.settingIcon}><Ionicons name={icon} size={17} color={colors.accentDark} /></View><Text style={styles.settingLabel}>{label}</Text><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#8CBCE0' }} thumbColor={value ? colors.accent : colors.white} /></View>; }

const styles = StyleSheet.create({
  activeHero: { borderRadius: radius.xl, backgroundColor: colors.accentDeep, padding: 18, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundLabel: { color: '#9BC7E5', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  clock: { fontSize: 58, lineHeight: 64, fontWeight: '900', letterSpacing: -2.4, textAlign: 'center', marginTop: 18 },
  activeMeta: { color: '#CBE3F2', fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: '#245E87', overflow: 'hidden', marginTop: 18 },
  progressFill: { height: '100%', borderRadius: 99 },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 18 },
  heroAction: { minWidth: 74, minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#246F9F', borderRadius: 13, paddingHorizontal: 10 },
  heroActionText: { color: colors.white, fontSize: 9, fontWeight: '900' },
  tabs: { flexDirection: 'row', backgroundColor: colors.panel3, borderRadius: 15, padding: 4, marginTop: 13 },
  tab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  tabActive: { backgroundColor: colors.panel },
  tabText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  tabTextActive: { color: colors.accentDark },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  numberField: { flex: 1, flexBasis: '46%', minWidth: 130 },
  numberLabel: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .7, marginBottom: 6 },
  numberInputWrap: { height: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 13, backgroundColor: colors.white, overflow: 'hidden' },
  numberInput: { flex: 1, minWidth: 0, height: '100%', color: colors.text, fontSize: 16, fontWeight: '900', paddingHorizontal: 12 },
  numberSuffix: { color: colors.muted, fontSize: 10, fontWeight: '800', paddingRight: 12 },
  buttonGap: { marginTop: 10 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  presetCard: { flex: 1, flexBasis: '46%', minWidth: 140, minHeight: 130, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 13 },
  presetIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  presetTitle: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 10 },
  presetMeta: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 3 },
  presetRounds: { color: colors.accentDark, fontSize: 9, fontWeight: '900', marginTop: 8 },
  quickRestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginVertical: 15 },
  quickRest: { minWidth: 54, minHeight: 39, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  quickRestActive: { backgroundColor: colors.accentSoft, borderColor: '#A0CBE8' },
  quickRestText: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  quickRestTextActive: { color: colors.accentDark },
  stopwatchCard: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  stopwatchIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  playCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  settingsCard: { paddingVertical: 3 },
  settingRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, color: colors.text, fontSize: 11, fontWeight: '800' },
});

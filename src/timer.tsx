import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { createAudioPlayer } from 'expo-audio';

export type TimerMode = 'interval' | 'rest' | 'countdown' | 'stopwatch';
export type IntervalPhase = 'prepare' | 'work' | 'rest' | 'complete';
export type TimerPreset = { id: string; label: string; workSeconds: number; restSeconds: number; rounds: number; prepareSeconds: number };
export type TimerSettings = { soundEnabled: boolean; vibrationEnabled: boolean; keepAwake: boolean; defaultRestSeconds: number; autoRestAfterSet: boolean };

type ActiveTimer = {
  mode: TimerMode;
  running: boolean;
  phase: IntervalPhase;
  round: number;
  totalRounds: number;
  phaseDurationSeconds: number;
  remainingSeconds: number;
  targetTimestamp?: number;
  elapsedSeconds: number;
  startedAt?: number;
  pausedAt?: number;
  workSeconds: number;
  restSeconds: number;
  prepareSeconds: number;
  label?: string;
};

type TimerContextValue = {
  hydrated: boolean;
  active: ActiveTimer;
  presets: TimerPreset[];
  settings: TimerSettings;
  startInterval: (preset: Omit<TimerPreset, 'id' | 'label'> & { label?: string }) => void;
  startRest: (seconds?: number, label?: string) => void;
  startCountdown: (seconds: number, label?: string) => void;
  startStopwatch: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skipPhase: () => void;
  addSeconds: (seconds: number) => void;
  savePreset: (preset: Omit<TimerPreset, 'id'>) => void;
  deletePreset: (id: string) => void;
  updateSettings: (patch: Partial<TimerSettings>) => void;
};

const STORAGE_KEY = 'kissonde-training-timer-v1';
const KEEP_AWAKE_TAG = 'kissonde-training-timer';
const defaultPresets: TimerPreset[] = [
  { id: '30-30', label: '30 / 30', workSeconds: 30, restSeconds: 30, rounds: 4, prepareSeconds: 5 },
  { id: '40-20', label: '40 / 20', workSeconds: 40, restSeconds: 20, rounds: 6, prepareSeconds: 5 },
  { id: '45-15', label: '45 / 15', workSeconds: 45, restSeconds: 15, rounds: 8, prepareSeconds: 5 },
  { id: '60-30', label: '60 / 30', workSeconds: 60, restSeconds: 30, rounds: 4, prepareSeconds: 5 },
];
const defaultSettings: TimerSettings = { soundEnabled: true, vibrationEnabled: true, keepAwake: true, defaultRestSeconds: 90, autoRestAfterSet: false };
const idleTimer: ActiveTimer = { mode: 'interval', running: false, phase: 'complete', round: 0, totalRounds: 0, phaseDurationSeconds: 0, remainingSeconds: 0, elapsedSeconds: 0, workSeconds: 30, restSeconds: 30, prepareSeconds: 5 };

const TimerContext = createContext<TimerContextValue | null>(null);

function makeId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }
function clampSeconds(value: number) { return Math.max(1, Math.min(60 * 60, Math.round(value))); }

let cuePlayer: ReturnType<typeof createAudioPlayer> | null = null;
function playCue(soundEnabled: boolean, vibrationEnabled: boolean) {
  if (vibrationEnabled) Vibration.vibrate(Platform.OS === 'android' ? 90 : 60);
  if (!soundEnabled) return;
  try {
    if (!cuePlayer) cuePlayer = createAudioPlayer(require('../assets/timer-cue.wav'));
    cuePlayer.seekTo(0);
    cuePlayer.play();
  } catch {
    // Audio cue failure must never interrupt the timer itself.
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveTimer>(idleTimer);
  const [presets, setPresets] = useState<TimerPreset[]>(defaultPresets);
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        setPresets(saved.presets?.length ? saved.presets : defaultPresets);
        setSettings({ ...defaultSettings, ...(saved.settings ?? {}) });
        if (saved.active) setActive(reconcile(saved.active));
      } catch {
        // Invalid preview state falls back to safe timer defaults.
      }
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ active, presets, settings }));
  }, [active, presets, settings, hydrated]);

  useEffect(() => {
    if (active.running && settings.keepAwake) activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);
    else deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
    return () => { deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined); };
  }, [active.running, settings.keepAwake]);

  useEffect(() => {
    if (!active.running) return;
    const tick = () => {
      setActive(current => {
        if (!current.running) return current;
        if (current.mode === 'stopwatch') {
          const startedAt = current.startedAt ?? Date.now();
          return { ...current, elapsedSeconds: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) };
        }
        if (!current.targetTimestamp) return current;
        const remaining = Math.max(0, Math.ceil((current.targetTimestamp - Date.now()) / 1000));
        if (remaining > 0) return remaining === current.remainingSeconds ? current : { ...current, remainingSeconds: remaining };
        playCue(settingsRef.current.soundEnabled, settingsRef.current.vibrationEnabled);
        return advancePhase(current);
      });
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [active.running]);

  const startInterval: TimerContextValue['startInterval'] = input => {
    const workSeconds = clampSeconds(input.workSeconds);
    const restSeconds = clampSeconds(input.restSeconds);
    const prepareSeconds = Math.max(0, Math.min(60, Math.round(input.prepareSeconds)));
    const rounds = Math.max(1, Math.min(99, Math.round(input.rounds)));
    const phase: IntervalPhase = prepareSeconds > 0 ? 'prepare' : 'work';
    const duration = prepareSeconds > 0 ? prepareSeconds : workSeconds;
    setActive({ mode: 'interval', running: true, phase, round: 1, totalRounds: rounds, phaseDurationSeconds: duration, remainingSeconds: duration, targetTimestamp: Date.now() + duration * 1000, elapsedSeconds: 0, workSeconds, restSeconds, prepareSeconds, label: input.label });
  };

  const startRest = (seconds = settings.defaultRestSeconds, label?: string) => {
    const duration = clampSeconds(seconds);
    setActive({ mode: 'rest', running: true, phase: 'rest', round: 1, totalRounds: 1, phaseDurationSeconds: duration, remainingSeconds: duration, targetTimestamp: Date.now() + duration * 1000, elapsedSeconds: 0, workSeconds: 0, restSeconds: duration, prepareSeconds: 0, label });
  };

  const startCountdown = (seconds: number, label?: string) => {
    const duration = clampSeconds(seconds);
    setActive({ mode: 'countdown', running: true, phase: 'work', round: 1, totalRounds: 1, phaseDurationSeconds: duration, remainingSeconds: duration, targetTimestamp: Date.now() + duration * 1000, elapsedSeconds: 0, workSeconds: duration, restSeconds: 0, prepareSeconds: 0, label });
  };

  const startStopwatch = () => setActive({ mode: 'stopwatch', running: true, phase: 'work', round: 1, totalRounds: 1, phaseDurationSeconds: 0, remainingSeconds: 0, elapsedSeconds: 0, startedAt: Date.now(), workSeconds: 0, restSeconds: 0, prepareSeconds: 0 });

  const pause = () => setActive(current => {
    if (!current.running) return current;
    if (current.mode === 'stopwatch') return { ...current, running: false, pausedAt: Date.now(), startedAt: undefined };
    const remaining = current.targetTimestamp ? Math.max(0, Math.ceil((current.targetTimestamp - Date.now()) / 1000)) : current.remainingSeconds;
    return { ...current, running: false, remainingSeconds: remaining, targetTimestamp: undefined, pausedAt: Date.now() };
  });

  const resume = () => setActive(current => {
    if (current.running || current.phase === 'complete') return current;
    if (current.mode === 'stopwatch') return { ...current, running: true, startedAt: Date.now() - current.elapsedSeconds * 1000, pausedAt: undefined };
    return { ...current, running: true, targetTimestamp: Date.now() + current.remainingSeconds * 1000, pausedAt: undefined };
  });

  const reset = () => setActive(idleTimer);
  const skipPhase = () => setActive(current => { playCue(settings.soundEnabled, settings.vibrationEnabled); return advancePhase(current); });
  const addSeconds = (seconds: number) => setActive(current => {
    if (current.mode === 'stopwatch') return { ...current, elapsedSeconds: Math.max(0, current.elapsedSeconds + seconds), startedAt: current.running ? Date.now() - Math.max(0, current.elapsedSeconds + seconds) * 1000 : current.startedAt };
    const remainingSeconds = Math.max(0, current.remainingSeconds + seconds);
    return { ...current, remainingSeconds, targetTimestamp: current.running ? Date.now() + remainingSeconds * 1000 : current.targetTimestamp };
  });

  const savePreset = (preset: Omit<TimerPreset, 'id'>) => setPresets(current => [...current, { ...preset, id: makeId('PRESET') }]);
  const deletePreset = (id: string) => setPresets(current => defaultPresets.some(item => item.id === id) ? current : current.filter(item => item.id !== id));
  const updateSettings = (patch: Partial<TimerSettings>) => setSettings(current => ({ ...current, ...patch }));

  const value = useMemo<TimerContextValue>(() => ({ hydrated, active, presets, settings, startInterval, startRest, startCountdown, startStopwatch, pause, resume, reset, skipPhase, addSeconds, savePreset, deletePreset, updateSettings }), [hydrated, active, presets, settings]);
  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

function advancePhase(current: ActiveTimer): ActiveTimer {
  if (current.mode === 'interval') {
    if (current.phase === 'prepare') return phaseState(current, 'work', current.workSeconds, current.round);
    if (current.phase === 'work') return phaseState(current, 'rest', current.restSeconds, current.round);
    if (current.phase === 'rest' && current.round < current.totalRounds) return phaseState(current, 'work', current.workSeconds, current.round + 1);
  }
  return { ...current, running: false, phase: 'complete', remainingSeconds: 0, targetTimestamp: undefined };
}

function phaseState(current: ActiveTimer, phase: IntervalPhase, duration: number, round: number): ActiveTimer {
  const safe = Math.max(1, duration);
  return { ...current, running: true, phase, round, phaseDurationSeconds: safe, remainingSeconds: safe, targetTimestamp: Date.now() + safe * 1000 };
}

function reconcile(saved: ActiveTimer): ActiveTimer {
  if (!saved.running) return saved;
  if (saved.mode === 'stopwatch' && saved.startedAt) return { ...saved, elapsedSeconds: Math.max(0, Math.floor((Date.now() - saved.startedAt) / 1000)) };
  let current = { ...saved };
  let guard = 0;
  while (current.running && current.targetTimestamp && Date.now() >= current.targetTimestamp && guard < 200) {
    const overshoot = Date.now() - current.targetTimestamp;
    current = advancePhase(current);
    if (current.running && current.targetTimestamp) current.targetTimestamp -= overshoot;
    guard += 1;
  }
  if (current.running && current.targetTimestamp) current.remainingSeconds = Math.max(0, Math.ceil((current.targetTimestamp - Date.now()) / 1000));
  return current;
}

export function useTrainingTimer() {
  const value = useContext(TimerContext);
  if (!value) throw new Error('TimerProvider is missing');
  return value;
}

export function formatTimerSeconds(total: number) {
  const seconds = Math.max(0, Math.floor(total));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

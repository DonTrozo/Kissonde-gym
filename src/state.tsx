import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { member } from './domain';

type AppState = {
  signedIn: boolean;
  bookedClasses: string[];
  completedExercises: string[];
  redeemedRewards: string[];
  points: number;
  signIn: () => void;
  signOut: () => void;
  toggleClass: (id: string) => void;
  toggleExercise: (id: string) => void;
  redeem: (id: string, cost: number) => void;
};

const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'kissonde-phase1-state-v2';

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [bookedClasses, setBookedClasses] = useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [points, setPoints] = useState(member.points);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      const saved = JSON.parse(raw);
      setSignedIn(saved.signedIn ?? false);
      setBookedClasses(saved.bookedClasses ?? []);
      setCompletedExercises(saved.completedExercises ?? []);
      setRedeemedRewards(saved.redeemedRewards ?? []);
      setPoints(saved.points ?? member.points);
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ signedIn, bookedClasses, completedExercises, redeemedRewards, points }));
  }, [signedIn, bookedClasses, completedExercises, redeemedRewards, points, hydrated]);

  const value = useMemo<AppState>(() => ({
    signedIn,
    bookedClasses,
    completedExercises,
    redeemedRewards,
    points,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    toggleClass: id => setBookedClasses(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]),
    toggleExercise: id => setCompletedExercises(current => {
      const completed = current.includes(id);
      if (!completed) setPoints(p => p + 4);
      return completed ? current.filter(x => x !== id) : [...current, id];
    }),
    redeem: (id, cost) => {
      if (redeemedRewards.includes(id)) return;
      if (points < cost) return Alert.alert('Pontos insuficientes', 'Continue a treinar para desbloquear esta recompensa.');
      setPoints(p => p - cost);
      setRedeemedRewards(r => [...r, id]);
      Alert.alert('Recompensa desbloqueada', 'A recompensa foi adicionada à tua conta.');
    },
  }), [signedIn, bookedClasses, completedExercises, redeemedRewards, points]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('StateProvider is missing');
  return value;
}

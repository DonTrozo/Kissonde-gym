import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ClassReservation,
  LedgerItem,
  PTBooking,
  SupportTicket,
  VisitReport,
  WorkoutSet,
  classes,
  initialLedger,
  member,
  rewards,
} from './domain';

type AppState = {
  signedIn: boolean;
  hydrated: boolean;
  points: number;
  ledger: LedgerItem[];
  reservations: ClassReservation[];
  workoutSets: WorkoutSet[];
  workoutCompleted: boolean;
  redeemedRewards: string[];
  ptBookings: PTBooking[];
  supportTickets: SupportTicket[];
  visitReports: VisitReport[];
  signIn: () => void;
  signOut: () => void;
  reserveClass: (classId: string) => void;
  cancelReservation: (classId: string) => void;
  logWorkoutSet: (exerciseId: string, setNumber: number, weightKg: number, reps: number) => void;
  removeWorkoutSet: (setId: string) => void;
  completeWorkout: () => void;
  redeem: (rewardId: string, cost: number) => void;
  bookTrainer: (trainerId: string, slot: string) => void;
  cancelPTBooking: (bookingId: string) => void;
  createSupportTicket: (category: string) => string;
  reportVisit: (description: string, visitId?: string) => string;
};

const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'kissonde-production-state-v1';

const nowIso = () => new Date().toISOString();
const shortDate = () => new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' }).format(new Date()).replace('.', '');
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [points, setPoints] = useState(member.points);
  const [ledger, setLedger] = useState<LedgerItem[]>(initialLedger);
  const [reservations, setReservations] = useState<ClassReservation[]>([]);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [ptBookings, setPTBookings] = useState<PTBooking[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [visitReports, setVisitReports] = useState<VisitReport[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        setSignedIn(saved.signedIn ?? false);
        setPoints(saved.points ?? member.points);
        setLedger(saved.ledger ?? initialLedger);
        setReservations(saved.reservations ?? []);
        setWorkoutSets(saved.workoutSets ?? []);
        setWorkoutCompleted(saved.workoutCompleted ?? false);
        setRedeemedRewards(saved.redeemedRewards ?? []);
        setPTBookings(saved.ptBookings ?? []);
        setSupportTickets(saved.supportTickets ?? []);
        setVisitReports(saved.visitReports ?? []);
      } catch {
        // Corrupt local state should never block member access; fall back to safe defaults.
      }
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      signedIn,
      points,
      ledger,
      reservations,
      workoutSets,
      workoutCompleted,
      redeemedRewards,
      ptBookings,
      supportTickets,
      visitReports,
    }));
  }, [signedIn, points, ledger, reservations, workoutSets, workoutCompleted, redeemedRewards, ptBookings, supportTickets, visitReports, hydrated]);

  const addLedgerEntry = (entry: Omit<LedgerItem, 'id' | 'date'>) => {
    const item: LedgerItem = { id: makeId('L'), date: shortDate(), ...entry };
    setLedger(current => [item, ...current]);
  };

  const reserveClass = (classId: string) => {
    const gymClass = classes.find(item => item.id === classId);
    if (!gymClass) return;
    const existing = reservations.find(item => item.classId === classId && item.status !== 'cancelled');
    if (existing) return;

    const full = gymClass.booked >= gymClass.capacity;
    const reservation: ClassReservation = {
      id: makeId('CR'),
      classId,
      status: full ? 'waitlisted' : 'confirmed',
      createdAt: nowIso(),
      waitlistPosition: full ? gymClass.waitlist + 1 : undefined,
    };
    setReservations(current => [reservation, ...current]);
  };

  const cancelReservation = (classId: string) => {
    setReservations(current => current.map(item => item.classId === classId && item.status !== 'cancelled' ? { ...item, status: 'cancelled' } : item));
  };

  const logWorkoutSet = (exerciseId: string, setNumber: number, weightKg: number, reps: number) => {
    if (!Number.isFinite(weightKg) || !Number.isFinite(reps) || weightKg < 0 || reps <= 0) return;
    const existingSet = workoutSets.find(set => set.exerciseId === exerciseId && set.setNumber === setNumber);
    const nextSet: WorkoutSet = {
      id: existingSet?.id ?? makeId('SET'),
      exerciseId,
      setNumber,
      weightKg,
      reps,
      completedAt: nowIso(),
    };
    setWorkoutSets(current => {
      const existing = current.some(set => set.exerciseId === exerciseId && set.setNumber === setNumber);
      if (!existing) return [...current, nextSet];
      return current.map(set => set.exerciseId === exerciseId && set.setNumber === setNumber ? nextSet : set);
    });
    setWorkoutCompleted(false);
  };

  const removeWorkoutSet = (setId: string) => {
    setWorkoutSets(current => current.filter(set => set.id !== setId));
    setWorkoutCompleted(false);
  };

  const completeWorkout = () => {
    if (workoutCompleted || workoutSets.length === 0) return;
    setWorkoutCompleted(true);
    setPoints(current => current + 20);
    addLedgerEntry({ title: 'Treino Push concluído', points: 20, sourceType: 'workout', sourceId: makeId('W') });
    Alert.alert('Treino guardado', 'A sessão e os teus dados de carga ficaram registados.');
  };

  const redeem = (rewardId: string, cost: number) => {
    if (redeemedRewards.includes(rewardId)) return;
    if (points < cost) {
      Alert.alert('Pontos insuficientes', 'Continua a treinar para desbloquear esta recompensa.');
      return;
    }
    const reward = rewards.find(item => item.id === rewardId);
    setPoints(current => current - cost);
    setRedeemedRewards(current => [...current, rewardId]);
    addLedgerEntry({ title: reward?.title ?? 'Recompensa', points: -cost, sourceType: 'reward', sourceId: rewardId });
    Alert.alert('Recompensa desbloqueada', 'A recompensa foi adicionada à tua conta.');
  };

  const bookTrainer = (trainerId: string, slot: string) => {
    const duplicate = ptBookings.some(item => item.trainerId === trainerId && item.slot === slot && item.status === 'confirmed');
    if (duplicate) return;
    setPTBookings(current => [{ id: makeId('PT'), trainerId, slot, status: 'confirmed', createdAt: nowIso() }, ...current]);
  };

  const cancelPTBooking = (bookingId: string) => {
    setPTBookings(current => current.map(item => item.id === bookingId ? { ...item, status: 'cancelled' } : item));
  };

  const createSupportTicket = (category: string) => {
    const id = makeId('SUP');
    setSupportTickets(current => [{ id, category, status: 'open', createdAt: nowIso(), memberId: member.id }, ...current]);
    return id;
  };

  const reportVisit = (description: string, visitId?: string) => {
    const id = makeId('VIS');
    setVisitReports(current => [{ id, visitId, status: 'open', createdAt: nowIso(), description }, ...current]);
    return id;
  };

  const value = useMemo<AppState>(() => ({
    signedIn,
    hydrated,
    points,
    ledger,
    reservations,
    workoutSets,
    workoutCompleted,
    redeemedRewards,
    ptBookings,
    supportTickets,
    visitReports,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    reserveClass,
    cancelReservation,
    logWorkoutSet,
    removeWorkoutSet,
    completeWorkout,
    redeem,
    bookTrainer,
    cancelPTBooking,
    createSupportTicket,
    reportVisit,
  }), [signedIn, hydrated, points, ledger, reservations, workoutSets, workoutCompleted, redeemedRewards, ptBookings, supportTickets, visitReports]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('StateProvider is missing');
  return value;
}

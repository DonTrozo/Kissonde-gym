import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ClassReservation,
  LedgerItem,
  PTBooking,
  RewardRedemption,
  SupportTicket,
  VisitReport,
  WorkoutSet,
  classes,
  initialLedger,
  member,
  rewards,
} from './domain';
import { MemberPreferences, programmeForGoal } from './product';

export type MembershipRequest = {
  id: string;
  type: 'freeze' | 'upgrade' | 'renewal' | 'invoice';
  status: 'submitted' | 'reviewing' | 'completed';
  createdAt: string;
};

type AppState = {
  signedIn: boolean;
  hydrated: boolean;
  onboardingComplete: boolean;
  preferences: MemberPreferences;
  points: number;
  ledger: LedgerItem[];
  reservations: ClassReservation[];
  workoutSets: WorkoutSet[];
  workoutCompleted: boolean;
  rewardRedemptions: RewardRedemption[];
  ptBookings: PTBooking[];
  supportTickets: SupportTicket[];
  visitReports: VisitReport[];
  favoriteClassIds: string[];
  instructorRatings: Record<string, number>;
  joinedChallenges: string[];
  connectedIntegrations: string[];
  readNotificationIds: string[];
  membershipRequests: MembershipRequest[];
  referralCode: string;
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: (preferences: MemberPreferences) => void;
  resetOnboarding: () => void;
  reserveClass: (classId: string) => void;
  cancelReservation: (classId: string) => void;
  toggleFavoriteClass: (classId: string) => void;
  rateInstructor: (instructor: string, rating: number) => void;
  logWorkoutSet: (exerciseId: string, setNumber: number, weightKg: number, reps: number) => void;
  removeWorkoutSet: (setId: string) => void;
  completeWorkout: () => void;
  redeem: (rewardId: string, cost: number) => void;
  bookTrainer: (trainerId: string, slot: string) => void;
  cancelPTBooking: (bookingId: string) => void;
  createSupportTicket: (category: string) => string;
  reportVisit: (description: string, visitId?: string) => string;
  joinChallenge: (challengeId: string) => void;
  toggleIntegration: (providerId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (notificationIds: string[]) => void;
  requestMembershipAction: (type: MembershipRequest['type']) => string;
};

const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'kissonde-production-state-v5';

const defaultPreferences: MemberPreferences = {
  goal: 'muscle',
  experience: 'intermediate',
  trainingDays: 4,
  preferredDays: ['Seg', 'Ter', 'Qui', 'Sáb'],
  wantsProgramme: true,
};

const nowIso = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().slice(0, 10);
const shortDate = () => new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' }).format(new Date()).replace('.', '');
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [preferences, setPreferences] = useState<MemberPreferences>(defaultPreferences);
  const [points, setPoints] = useState(member.points);
  const [ledger, setLedger] = useState<LedgerItem[]>(initialLedger);
  const [reservations, setReservations] = useState<ClassReservation[]>([]);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(todayKey());
  const [rewardRedemptions, setRewardRedemptions] = useState<RewardRedemption[]>([]);
  const [ptBookings, setPTBookings] = useState<PTBooking[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [visitReports, setVisitReports] = useState<VisitReport[]>([]);
  const [favoriteClassIds, setFavoriteClassIds] = useState<string[]>([]);
  const [instructorRatings, setInstructorRatings] = useState<Record<string, number>>({});
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        setOnboardingComplete(saved.onboardingComplete ?? false);
        setPreferences(saved.preferences ?? defaultPreferences);
        setPoints(saved.points ?? member.points);
        setLedger(saved.ledger ?? initialLedger);
        setReservations(saved.reservations ?? []);
        if (saved.workoutDate === todayKey()) {
          setWorkoutSets(saved.workoutSets ?? []);
          setWorkoutCompleted(saved.workoutCompleted ?? false);
        } else {
          setWorkoutSets([]);
          setWorkoutCompleted(false);
          setWorkoutDate(todayKey());
        }
        setRewardRedemptions(saved.rewardRedemptions ?? []);
        setPTBookings(saved.ptBookings ?? []);
        setSupportTickets(saved.supportTickets ?? []);
        setVisitReports(saved.visitReports ?? []);
        setFavoriteClassIds(saved.favoriteClassIds ?? []);
        setInstructorRatings(saved.instructorRatings ?? {});
        setJoinedChallenges(saved.joinedChallenges ?? []);
        setConnectedIntegrations(saved.connectedIntegrations ?? []);
        setReadNotificationIds(saved.readNotificationIds ?? []);
        setMembershipRequests(saved.membershipRequests ?? []);
      } catch {
        // Corrupt local preview state falls back to safe defaults.
      }
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      onboardingComplete,
      preferences,
      points,
      ledger,
      reservations,
      workoutSets,
      workoutCompleted,
      workoutDate,
      rewardRedemptions,
      ptBookings,
      supportTickets,
      visitReports,
      favoriteClassIds,
      instructorRatings,
      joinedChallenges,
      connectedIntegrations,
      readNotificationIds,
      membershipRequests,
    }));
  }, [onboardingComplete, preferences, points, ledger, reservations, workoutSets, workoutCompleted, workoutDate, rewardRedemptions, ptBookings, supportTickets, visitReports, favoriteClassIds, instructorRatings, joinedChallenges, connectedIntegrations, readNotificationIds, membershipRequests, hydrated]);

  const ensureCurrentWorkoutDay = () => {
    const currentDay = todayKey();
    if (workoutDate === currentDay) return;
    setWorkoutDate(currentDay);
    setWorkoutSets([]);
    setWorkoutCompleted(false);
  };

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

  const toggleFavoriteClass = (classId: string) => {
    setFavoriteClassIds(current => current.includes(classId) ? current.filter(id => id !== classId) : [...current, classId]);
  };

  const rateInstructor = (instructor: string, rating: number) => {
    const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
    setInstructorRatings(current => ({ ...current, [instructor]: safeRating }));
  };

  const logWorkoutSet = (exerciseId: string, setNumber: number, weightKg: number, reps: number) => {
    ensureCurrentWorkoutDay();
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
    ensureCurrentWorkoutDay();
    setWorkoutSets(current => current.filter(set => set.id !== setId));
    setWorkoutCompleted(false);
  };

  const completeWorkout = () => {
    ensureCurrentWorkoutDay();
    if (workoutCompleted || workoutSets.length === 0) return;
    const programme = programmeForGoal(preferences.goal);
    setWorkoutCompleted(true);
    setPoints(current => current + 20);
    addLedgerEntry({ title: `${programme.dayTitle} concluído`, points: 20, sourceType: 'workout', sourceId: makeId('W') });
    Alert.alert('Treino guardado', 'A sessão e os teus dados de carga ficaram registados.');
  };

  const redeem = (rewardId: string, cost: number) => {
    if (points < cost) {
      Alert.alert('Pontos insuficientes', 'Continua a treinar para desbloquear esta recompensa.');
      return;
    }
    const reward = rewards.find(item => item.id === rewardId);
    const redemption: RewardRedemption = { id: makeId('RWD'), rewardId, points: cost, createdAt: nowIso(), status: 'issued' };
    setPoints(current => current - cost);
    setRewardRedemptions(current => [redemption, ...current]);
    addLedgerEntry({ title: reward?.title ?? 'Recompensa', points: -cost, sourceType: 'reward', sourceId: redemption.id });
    Alert.alert('Recompensa desbloqueada', `Código ${redemption.id}. A recompensa foi adicionada à tua conta.`);
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

  const joinChallenge = (challengeId: string) => {
    setJoinedChallenges(current => current.includes(challengeId) ? current : [...current, challengeId]);
  };

  const toggleIntegration = (providerId: string) => {
    setConnectedIntegrations(current => current.includes(providerId) ? current.filter(id => id !== providerId) : [...current, providerId]);
  };

  const markNotificationRead = (notificationId: string) => {
    setReadNotificationIds(current => current.includes(notificationId) ? current : [...current, notificationId]);
  };

  const markAllNotificationsRead = (notificationIds: string[]) => {
    setReadNotificationIds(current => Array.from(new Set([...current, ...notificationIds])));
  };

  const requestMembershipAction = (type: MembershipRequest['type']) => {
    const id = makeId('MEM');
    setMembershipRequests(current => [{ id, type, status: 'submitted', createdAt: nowIso() }, ...current]);
    return id;
  };

  const value = useMemo<AppState>(() => ({
    signedIn,
    hydrated,
    onboardingComplete,
    preferences,
    points,
    ledger,
    reservations,
    workoutSets,
    workoutCompleted,
    rewardRedemptions,
    ptBookings,
    supportTickets,
    visitReports,
    favoriteClassIds,
    instructorRatings,
    joinedChallenges,
    connectedIntegrations,
    readNotificationIds,
    membershipRequests,
    referralCode: `KSG-${member.id.replace(/\D/g, '').slice(-4)}-AMIGO`,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    completeOnboarding: nextPreferences => { setPreferences(nextPreferences); setOnboardingComplete(true); },
    resetOnboarding: () => setOnboardingComplete(false),
    reserveClass,
    cancelReservation,
    toggleFavoriteClass,
    rateInstructor,
    logWorkoutSet,
    removeWorkoutSet,
    completeWorkout,
    redeem,
    bookTrainer,
    cancelPTBooking,
    createSupportTicket,
    reportVisit,
    joinChallenge,
    toggleIntegration,
    markNotificationRead,
    markAllNotificationsRead,
    requestMembershipAction,
  }), [signedIn, hydrated, onboardingComplete, preferences, points, ledger, reservations, workoutSets, workoutCompleted, rewardRedemptions, ptBookings, supportTickets, visitReports, favoriteClassIds, instructorRatings, joinedChallenges, connectedIntegrations, readNotificationIds, membershipRequests, workoutDate]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('StateProvider is missing');
  return value;
}

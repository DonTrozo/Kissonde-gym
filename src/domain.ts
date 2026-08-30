export type MemberStatus = 'Ativa' | 'Pendente' | 'Suspensa';
export type ReservationStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no-show';
export type TicketStatus = 'open' | 'in_review' | 'resolved';
export type VisitStatus = 'verified' | 'pending' | 'disputed';

export type Member = {
  id: string;
  name: string;
  membership: string;
  status: MemberStatus;
  branch: string;
  expiry: string;
  points: number;
  streak: number;
};

export type Visit = {
  id: string;
  date: string;
  branch: string;
  enteredAt: string;
  exitedAt?: string;
  status: VisitStatus;
  points: number;
};

export type Exercise = {
  id: string;
  name: string;
  target: string;
  sets: number;
  reps: string;
  previous?: string;
  suggested?: string;
};

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completedAt: string;
};

export type WorkoutSession = {
  id: string;
  title: string;
  programme: string;
  startedAt: string;
  completedAt?: string;
  sets: WorkoutSet[];
};

export type ClassCategory = 'Cycling' | 'HIIT' | 'Dance' | 'Strength' | 'Mobility' | 'Functional';

export type GymClass = {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  difficulty: string;
  category: ClassCategory;
  capacity: number;
  booked: number;
  waitlist: number;
};

export type ClassReservation = {
  id: string;
  classId: string;
  status: ReservationStatus;
  createdAt: string;
  waitlistPosition?: number;
};

export type Reward = {
  id: string;
  title: string;
  points: number;
  subtitle: string;
};

export type RewardRedemption = {
  id: string;
  rewardId: string;
  points: number;
  createdAt: string;
  status: 'issued' | 'used' | 'cancelled';
};

export type LedgerItem = {
  id: string;
  date: string;
  title: string;
  points: number;
  sourceType: 'visit' | 'workout' | 'class' | 'reward' | 'adjustment';
  sourceId?: string;
};

export type Trainer = {
  id: string;
  name: string;
  specialties: string[];
  experience: string;
  languages: string[];
  nextSlot: string;
  rating: number;
  reviews: number;
};

export type PTBooking = {
  id: string;
  trainerId: string;
  slot: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  memberId: string;
};

export type VisitReport = {
  id: string;
  visitId?: string;
  status: TicketStatus;
  createdAt: string;
  description: string;
};

export const member: Member = {
  id: 'KSG-02481',
  name: 'Membro Kissonde',
  membership: 'Premium',
  status: 'Ativa',
  branch: 'Kissonde Viana',
  expiry: '31 Dez 2026',
  points: 2450,
  streak: 3,
};

export const visits: Visit[] = [
  { id: 'V-260826', date: '26 Ago', branch: 'Kissonde Viana', enteredAt: '18:07', exitedAt: '19:34', status: 'verified', points: 50 },
  { id: 'V-240826', date: '24 Ago', branch: 'Kissonde Viana', enteredAt: '17:42', exitedAt: '19:02', status: 'verified', points: 50 },
  { id: 'V-210826', date: '21 Ago', branch: 'Kissonde Viana', enteredAt: '18:13', status: 'pending', points: 0 },
];

export const exercises: Exercise[] = [
  { id: 'bench', name: 'Supino com barra', target: 'Peito', sets: 4, reps: '8', previous: '80 kg × 8', suggested: '82.5 kg × 8' },
  { id: 'incline', name: 'Supino inclinado com halteres', target: 'Peito', sets: 3, reps: '10', previous: '28 kg × 10', suggested: '30 kg × 10' },
  { id: 'press', name: 'Desenvolvimento de ombros', target: 'Ombros', sets: 3, reps: '8', previous: '45 kg × 8', suggested: '47.5 kg × 8' },
  { id: 'fly', name: 'Crossover no cabo', target: 'Peito', sets: 3, reps: '12', previous: '20 kg × 12', suggested: '22.5 kg × 12' },
  { id: 'triceps', name: 'Tríceps na polia', target: 'Tríceps', sets: 3, reps: '12', previous: '30 kg × 12', suggested: '32.5 kg × 12' },
  { id: 'squat', name: 'Agachamento com barra', target: 'Pernas', sets: 4, reps: '6', previous: '90 kg × 6', suggested: '92.5 kg × 6' },
  { id: 'legpress', name: 'Leg press', target: 'Pernas', sets: 3, reps: '10', previous: '170 kg × 10', suggested: '180 kg × 10' },
  { id: 'row', name: 'Remada sentada', target: 'Costas', sets: 4, reps: '10', previous: '65 kg × 10', suggested: '67.5 kg × 10' },
  { id: 'rdl', name: 'Peso morto romeno', target: 'Posterior', sets: 3, reps: '8', previous: '80 kg × 8', suggested: '85 kg × 8' },
  { id: 'hipthrust', name: 'Hip thrust', target: 'Glúteos', sets: 4, reps: '10', previous: '100 kg × 10', suggested: '105 kg × 10' },
  { id: 'plank', name: 'Prancha', target: 'Core', sets: 3, reps: '45 s', previous: '40 s', suggested: '45 s' },
];

export const classes: GymClass[] = [
  { id: 'spin', name: 'Spinning', instructor: 'Ana Silva', time: '18:00', duration: '45 min', difficulty: 'Intermédio', category: 'Cycling', capacity: 20, booked: 20, waitlist: 2 },
  { id: 'hiit', name: 'HIIT', instructor: 'Carlos Manuel', time: '19:00', duration: '40 min', difficulty: 'Avançado', category: 'HIIT', capacity: 18, booked: 14, waitlist: 0 },
  { id: 'zumba', name: 'Zumba', instructor: 'Marta João', time: '20:00', duration: '50 min', difficulty: 'Todos', category: 'Dance', capacity: 30, booked: 21, waitlist: 0 },
  { id: 'strength', name: 'Strength Lab', instructor: 'Carlos Manuel', time: '07:00', duration: '50 min', difficulty: 'Intermédio', category: 'Strength', capacity: 16, booked: 11, waitlist: 0 },
  { id: 'mobility', name: 'Mobilidade', instructor: 'Marta João', time: '10:00', duration: '35 min', difficulty: 'Todos', category: 'Mobility', capacity: 18, booked: 8, waitlist: 0 },
  { id: 'functional', name: 'Funcional', instructor: 'Ana Silva', time: '17:00', duration: '45 min', difficulty: 'Intermédio', category: 'Functional', capacity: 22, booked: 17, waitlist: 0 },
];

export const rewards: Reward[] = [
  { id: 'shake', title: 'Batido proteico grátis', points: 500, subtitle: 'Levantar na receção' },
  { id: 'guest', title: 'Passe para convidado', points: 750, subtitle: '1 entrada para um amigo' },
  { id: 'shirt', title: 'T-shirt Kissonde', points: 1000, subtitle: 'Sujeito a stock' },
  { id: 'pt', title: 'Sessão de PT', points: 1500, subtitle: '1 sessão de 45 minutos' },
  { id: 'membership', title: 'Desconto na mensalidade', points: 2000, subtitle: 'Aplicado na próxima cobrança' },
];

export const initialLedger: LedgerItem[] = [
  { id: 'L0', date: '20 Ago', title: 'Saldo anterior', points: 2850, sourceType: 'adjustment' },
  { id: 'L1', date: '26 Ago', title: 'Visita ao ginásio', points: 50, sourceType: 'visit', sourceId: 'V-260826' },
  { id: 'L2', date: '25 Ago', title: 'Treino Push concluído', points: 20, sourceType: 'workout', sourceId: 'W-PUSH-250826' },
  { id: 'L3', date: '23 Ago', title: 'Aula de Zumba', points: 30, sourceType: 'class', sourceId: 'zumba' },
  { id: 'L4', date: '21 Ago', title: 'Batido proteico', points: -500, sourceType: 'reward', sourceId: 'shake' },
];

export const trainers: Trainer[] = [
  { id: 'T1', name: 'Carlos Manuel', specialties: ['Hipertrofia', 'Força', 'Transformação corporal'], experience: '8 anos', languages: ['Português', 'Inglês'], nextSlot: 'Hoje, 17:30', rating: 4.9, reviews: 128 },
  { id: 'T2', name: 'Marta João', specialties: ['Perda de peso', 'Funcional', 'Mobilidade'], experience: '6 anos', languages: ['Português'], nextSlot: 'Amanhã, 09:00', rating: 4.8, reviews: 94 },
  { id: 'T3', name: 'Ana Silva', specialties: ['Cycling', 'Condicionamento', 'HIIT'], experience: '7 anos', languages: ['Português', 'Inglês'], nextSlot: 'Amanhã, 16:00', rating: 4.9, reviews: 112 },
];

export type Member = {
  id: string;
  name: string;
  membership: string;
  status: 'Ativa' | 'Pendente' | 'Suspensa';
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
  status: 'verified' | 'pending';
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

export type GymClass = {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  difficulty: string;
  capacity: number;
  booked: number;
  waitlist: number;
};

export type Reward = {
  id: string;
  title: string;
  points: number;
  subtitle: string;
};

export type LedgerItem = {
  id: string;
  date: string;
  title: string;
  points: number;
};

export type Trainer = {
  id: string;
  name: string;
  specialties: string[];
  experience: string;
  languages: string[];
  nextSlot: string;
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
];

export const classes: GymClass[] = [
  { id: 'spin', name: 'Spinning', instructor: 'Ana Silva', time: '18:00', duration: '45 min', difficulty: 'Intermédio', capacity: 20, booked: 20, waitlist: 2 },
  { id: 'hiit', name: 'HIIT', instructor: 'Carlos Manuel', time: '19:00', duration: '40 min', difficulty: 'Avançado', capacity: 18, booked: 14, waitlist: 0 },
  { id: 'zumba', name: 'Zumba', instructor: 'Marta João', time: '20:00', duration: '50 min', difficulty: 'Todos', capacity: 30, booked: 21, waitlist: 0 },
];

export const rewards: Reward[] = [
  { id: 'shake', title: 'Batido proteico grátis', points: 500, subtitle: 'Levantar na receção' },
  { id: 'guest', title: 'Passe para convidado', points: 750, subtitle: '1 entrada para um amigo' },
  { id: 'shirt', title: 'T-shirt Kissonde', points: 1000, subtitle: 'Sujeito a stock' },
  { id: 'pt', title: 'Sessão de PT', points: 1500, subtitle: '1 sessão de 45 minutos' },
  { id: 'membership', title: 'Desconto na mensalidade', points: 2000, subtitle: 'Aplicado na próxima cobrança' },
];

export const ledger: LedgerItem[] = [
  { id: 'L1', date: '26 Ago', title: 'Visita ao ginásio', points: 50 },
  { id: 'L2', date: '25 Ago', title: 'Treino Push concluído', points: 20 },
  { id: 'L3', date: '23 Ago', title: 'Aula de Zumba', points: 30 },
  { id: 'L4', date: '21 Ago', title: 'Batido proteico', points: -500 },
];

export const trainers: Trainer[] = [
  { id: 'T1', name: 'Carlos Manuel', specialties: ['Hipertrofia', 'Força', 'Transformação corporal'], experience: '8 anos', languages: ['Português', 'Inglês'], nextSlot: 'Hoje, 17:30' },
  { id: 'T2', name: 'Marta João', specialties: ['Perda de peso', 'Funcional', 'Mobilidade'], experience: '6 anos', languages: ['Português'], nextSlot: 'Amanhã, 09:00' },
];

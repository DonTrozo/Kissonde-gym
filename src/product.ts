import { Exercise } from './domain';

export type FitnessGoal = 'muscle' | 'weight-loss' | 'strength' | 'fitness' | 'health';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type MemberPreferences = {
  goal: FitnessGoal;
  experience: ExperienceLevel;
  trainingDays: number;
  preferredDays: string[];
  wantsProgramme: boolean;
};

export type ProgrammeDefinition = {
  id: string;
  goal: FitnessGoal;
  title: string;
  subtitle: string;
  dayTitle: string;
  focus: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  exerciseIds: string[];
};

export const programmes: ProgrammeDefinition[] = [
  {
    id: 'hypertrophy-12',
    goal: 'muscle',
    title: 'Hipertrofia 12',
    subtitle: 'Progressão de volume e carga para ganho de massa muscular.',
    dayTitle: 'Push Day',
    focus: 'Peito · Ombros · Tríceps',
    durationWeeks: 12,
    sessionsPerWeek: 4,
    exerciseIds: ['bench', 'incline', 'press', 'fly', 'triceps'],
  },
  {
    id: 'strength-foundation',
    goal: 'strength',
    title: 'Base de Força',
    subtitle: 'Movimentos compostos com progressão objetiva de carga.',
    dayTitle: 'Força A',
    focus: 'Supino · Agachamento · Remada',
    durationWeeks: 10,
    sessionsPerWeek: 4,
    exerciseIds: ['bench', 'squat', 'row', 'rdl', 'press'],
  },
  {
    id: 'lean-conditioning',
    goal: 'weight-loss',
    title: 'Lean Conditioning',
    subtitle: 'Treino de força e condicionamento para aumentar gasto energético.',
    dayTitle: 'Full Body',
    focus: 'Corpo inteiro · Condicionamento',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    exerciseIds: ['squat', 'row', 'press', 'hipthrust', 'plank'],
  },
  {
    id: 'performance-fit',
    goal: 'fitness',
    title: 'Performance Fit',
    subtitle: 'Força, resistência e mobilidade para desempenho geral.',
    dayTitle: 'Performance A',
    focus: 'Força · Resistência · Core',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    exerciseIds: ['squat', 'row', 'incline', 'rdl', 'plank'],
  },
  {
    id: 'healthy-start',
    goal: 'health',
    title: 'Healthy Start',
    subtitle: 'Rotina equilibrada e sustentável para saúde e consistência.',
    dayTitle: 'Full Body Base',
    focus: 'Movimento · Força · Core',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    exerciseIds: ['legpress', 'row', 'incline', 'hipthrust', 'plank'],
  },
];

export function programmeForGoal(goal?: FitnessGoal) {
  return programmes.find(item => item.goal === goal) ?? programmes[0]!;
}

export const goalLabels: Record<FitnessGoal, string> = {
  muscle: 'Ganhar massa muscular',
  'weight-loss': 'Perder peso',
  strength: 'Ficar mais forte',
  fitness: 'Melhorar condição física',
  health: 'Saúde geral',
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermédio',
  advanced: 'Avançado',
};

export type ExerciseGuide = {
  exerciseId: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  setup: string[];
  execution: string[];
  mistakes: string[];
  alternatives: string[];
  videoLabel: string;
};

export const exerciseGuides: ExerciseGuide[] = [
  {
    exerciseId: 'bench', equipment: 'Barra e banco', primaryMuscles: ['Peito'], secondaryMuscles: ['Tríceps', 'Ombro anterior'],
    setup: ['Pés firmes no chão.', 'Escápulas retraídas e banco estável.', 'Pegada ligeiramente mais larga que os ombros.'],
    execution: ['Desce a barra de forma controlada até à linha média do peito.', 'Mantém antebraços estáveis.', 'Empurra sem perder a posição das escápulas.'],
    mistakes: ['Cotovelos demasiado abertos.', 'Perder contacto dos pés com o chão.', 'Usar impulso excessivo.'],
    alternatives: ['Supino com halteres', 'Chest press', 'Flexões'], videoLabel: 'Demonstração técnica · 00:34',
  },
  {
    exerciseId: 'incline', equipment: 'Halteres e banco inclinado', primaryMuscles: ['Peito superior'], secondaryMuscles: ['Tríceps', 'Ombros'],
    setup: ['Banco a 25–35°.', 'Halteres alinhados com o peito superior.'], execution: ['Desce com controlo.', 'Pressiona para cima mantendo tensão no peito.'],
    mistakes: ['Inclinação demasiado alta.', 'Bater os halteres no topo.'], alternatives: ['Supino inclinado com barra', 'Chest press inclinado'], videoLabel: 'Demonstração técnica · 00:29',
  },
  {
    exerciseId: 'press', equipment: 'Barra, halteres ou máquina', primaryMuscles: ['Ombros'], secondaryMuscles: ['Tríceps'],
    setup: ['Core firme.', 'Punhos alinhados com antebraços.'], execution: ['Pressiona acima da cabeça sem arquear excessivamente a lombar.', 'Desce até uma amplitude confortável.'],
    mistakes: ['Hiperextensão lombar.', 'Carga excessiva.'], alternatives: ['Shoulder press máquina', 'Arnold press'], videoLabel: 'Demonstração técnica · 00:31',
  },
  {
    exerciseId: 'fly', equipment: 'Cabos', primaryMuscles: ['Peito'], secondaryMuscles: ['Ombro anterior'],
    setup: ['Cabos alinhados com o peito.', 'Cotovelos ligeiramente fletidos.'], execution: ['Fecha os braços à frente do corpo mantendo tensão.', 'Retorna sem perder controlo.'],
    mistakes: ['Transformar o movimento num press.', 'Alongar além da amplitude confortável.'], alternatives: ['Pec deck', 'Fly com halteres'], videoLabel: 'Demonstração técnica · 00:25',
  },
  {
    exerciseId: 'triceps', equipment: 'Polia', primaryMuscles: ['Tríceps'], secondaryMuscles: [],
    setup: ['Cotovelos junto ao tronco.', 'Postura estável.'], execution: ['Estende os cotovelos até ao final sem mover os ombros.', 'Retorna controladamente.'],
    mistakes: ['Balançar o tronco.', 'Abrir os cotovelos.'], alternatives: ['Extensão acima da cabeça', 'Dips assistidos'], videoLabel: 'Demonstração técnica · 00:22',
  },
  {
    exerciseId: 'squat', equipment: 'Barra e rack', primaryMuscles: ['Quadríceps', 'Glúteos'], secondaryMuscles: ['Core', 'Posterior da coxa'],
    setup: ['Barra firme sobre a parte superior das costas.', 'Pés numa posição confortável.', 'Respira e cria tensão abdominal.'], execution: ['Desce mantendo joelhos alinhados com os pés.', 'Mantém o tronco firme.', 'Sobe empurrando o chão.'],
    mistakes: ['Joelhos colapsarem para dentro.', 'Perder tensão abdominal.', 'Aumentar carga antes de dominar a amplitude.'], alternatives: ['Hack squat', 'Goblet squat', 'Leg press'], videoLabel: 'Demonstração técnica · 00:41',
  },
  {
    exerciseId: 'legpress', equipment: 'Leg press', primaryMuscles: ['Quadríceps', 'Glúteos'], secondaryMuscles: ['Posterior da coxa'],
    setup: ['Lombar apoiada.', 'Pés à largura dos ombros.'], execution: ['Desce até uma amplitude segura.', 'Empurra sem bloquear agressivamente os joelhos.'],
    mistakes: ['Retirar a lombar do encosto.', 'Descer além da mobilidade disponível.'], alternatives: ['Hack squat', 'Agachamento'], videoLabel: 'Demonstração técnica · 00:28',
  },
  {
    exerciseId: 'row', equipment: 'Cabo ou máquina', primaryMuscles: ['Costas'], secondaryMuscles: ['Bíceps', 'Deltoide posterior'],
    setup: ['Peito alto e core firme.', 'Ombros longe das orelhas.'], execution: ['Puxa os cotovelos para trás.', 'Controla a extensão sem arredondar excessivamente as costas.'],
    mistakes: ['Usar impulso.', 'Encolher os ombros.'], alternatives: ['Remada com halter', 'Remada apoiada'], videoLabel: 'Demonstração técnica · 00:30',
  },
  {
    exerciseId: 'rdl', equipment: 'Barra ou halteres', primaryMuscles: ['Posterior da coxa', 'Glúteos'], secondaryMuscles: ['Lombar', 'Core'],
    setup: ['Pés à largura da anca.', 'Joelhos ligeiramente fletidos.'], execution: ['Empurra a anca para trás mantendo a carga próxima do corpo.', 'Sobe contraindo glúteos.'],
    mistakes: ['Transformar em agachamento.', 'Arredondar a coluna.'], alternatives: ['RDL com halteres', 'Pull-through'], videoLabel: 'Demonstração técnica · 00:36',
  },
  {
    exerciseId: 'hipthrust', equipment: 'Banco e barra', primaryMuscles: ['Glúteos'], secondaryMuscles: ['Posterior da coxa'],
    setup: ['Escápulas apoiadas no banco.', 'Pés firmes no chão.'], execution: ['Eleva a anca até alinhamento confortável.', 'Mantém costelas controladas.'],
    mistakes: ['Hiperextensão lombar.', 'Pés demasiado longe.'], alternatives: ['Glute bridge', 'Pull-through'], videoLabel: 'Demonstração técnica · 00:27',
  },
  {
    exerciseId: 'plank', equipment: 'Peso corporal', primaryMuscles: ['Core'], secondaryMuscles: ['Glúteos', 'Ombros'],
    setup: ['Cotovelos sob os ombros.', 'Corpo alinhado.'], execution: ['Mantém tensão abdominal e glúteos ativos.', 'Respira sem perder a posição.'],
    mistakes: ['Anca demasiado baixa.', 'Prender a respiração.'], alternatives: ['Dead bug', 'Pallof press'], videoLabel: 'Demonstração técnica · 00:21',
  },
];

export function guideForExercise(exerciseId: string) {
  return exerciseGuides.find(item => item.exerciseId === exerciseId);
}

export type PreviousWorkout = {
  id: string;
  date: string;
  title: string;
  duration: string;
  sets: number;
  volumeKg: number;
  highlights: string[];
};

export const previousWorkouts: PreviousWorkout[] = [
  { id: 'WH-1', date: '27 Ago', title: 'Push Day', duration: '58 min', sets: 16, volumeKg: 8120, highlights: ['Supino 80 kg × 8', 'Press 45 kg × 8'] },
  { id: 'WH-2', date: '24 Ago', title: 'Pull Day', duration: '61 min', sets: 17, volumeKg: 8740, highlights: ['Remada 65 kg × 10', 'Pulldown 70 kg × 10'] },
  { id: 'WH-3', date: '21 Ago', title: 'Leg Day', duration: '67 min', sets: 18, volumeKg: 11280, highlights: ['Agachamento 90 kg × 6', 'Leg press 180 kg × 10'] },
];

export type Challenge = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  unit: string;
  rewardPoints: number;
  ends: string;
};

export const challenges: Challenge[] = [
  { id: 'C1', title: '12 visitas em Setembro', description: 'Mantém consistência durante o mês.', target: 12, progress: 4, unit: 'visitas', rewardPoints: 500, ends: '30 Set' },
  { id: 'C2', title: 'Força em evolução', description: 'Regista 8 sessões completas de força.', target: 8, progress: 3, unit: 'sessões', rewardPoints: 350, ends: '30 Set' },
  { id: 'C3', title: 'Movimento diário', description: 'Atinge a meta de atividade em 10 dias.', target: 10, progress: 5, unit: 'dias', rewardPoints: 300, ends: '15 Set' },
];

export type DemoNotification = {
  id: string;
  category: 'class' | 'reward' | 'membership' | 'training' | 'support';
  title: string;
  body: string;
  time: string;
};

export const demoNotifications: DemoNotification[] = [
  { id: 'N1', category: 'class', title: 'Subiste na lista de espera', body: 'Spinning das 18:00: agora estás na posição #2.', time: 'Há 18 min' },
  { id: 'N2', category: 'training', title: 'Treino de hoje pronto', body: 'A tua sessão está preparada com base no programa atual.', time: 'Hoje, 08:00' },
  { id: 'N3', category: 'reward', title: 'Novo benefício disponível', body: 'Tens pontos suficientes para uma sessão de PT.', time: 'Ontem' },
  { id: 'N4', category: 'membership', title: 'Mensalidade em dia', body: 'O teu acesso Premium está ativo até 31 Dez 2026.', time: '28 Ago' },
];

export type IntegrationProvider = {
  id: string;
  name: string;
  description: string;
  kind: 'health' | 'wearable' | 'wallet';
  platforms: string[];
};

export const integrationProviders: IntegrationProvider[] = [
  { id: 'apple-health', name: 'Apple Health', description: 'Importar atividade, passos e treinos no iPhone.', kind: 'health', platforms: ['iOS'] },
  { id: 'health-connect', name: 'Health Connect', description: 'Centralizar atividade de apps compatíveis no Android.', kind: 'health', platforms: ['Android'] },
  { id: 'garmin', name: 'Garmin', description: 'Sincronizar corrida, ciclismo e métricas de atividade.', kind: 'wearable', platforms: ['iOS', 'Android'] },
  { id: 'strava', name: 'Strava', description: 'Importar atividades verificadas e distância.', kind: 'wearable', platforms: ['iOS', 'Android'] },
  { id: 'samsung-health', name: 'Samsung Health', description: 'Atividade e treino de dispositivos Galaxy.', kind: 'wearable', platforms: ['Android'] },
  { id: 'apple-wallet', name: 'Apple Wallet', description: 'Acesso rápido ao cartão de membro no iPhone e Apple Watch.', kind: 'wallet', platforms: ['iOS', 'watchOS'] },
  { id: 'google-wallet', name: 'Google Wallet', description: 'Cartão de membro e acesso rápido em Android.', kind: 'wallet', platforms: ['Android', 'Wear OS'] },
];

export type AdminClassPerformance = { name: string; fill: number; sessions: number };
export type AtRiskSegment = { label: string; members: number; action: string };

export const adminDemo = {
  activeMembers: 4821,
  insideNow: 184,
  occupancy: 63,
  visitsToday: 627,
  visitsMonth: 14842,
  retention: 91,
  openSupport: 8,
  visitDisputes: 3,
  rewardRedemptions: 382,
  ptBookings: 146,
  classPerformance: [
    { name: 'Spinning', fill: 100, sessions: 21 },
    { name: 'HIIT', fill: 78, sessions: 18 },
    { name: 'Zumba', fill: 70, sessions: 16 },
    { name: 'Funcional', fill: 66, sessions: 14 },
  ] as AdminClassPerformance[],
  riskSegments: [
    { label: 'Sem visita há 21+ dias', members: 143, action: 'Campanha de reativação' },
    { label: 'Mensalidade perto do vencimento', members: 92, action: 'Lembrete de renovação' },
    { label: '3+ cancelamentos de aula', members: 38, action: 'Analisar experiência de reserva' },
  ] as AtRiskSegment[],
};

export function exercisesForProgramme(allExercises: Exercise[], programme: ProgrammeDefinition) {
  return programme.exerciseIds.map(id => allExercises.find(exercise => exercise.id === id)).filter((exercise): exercise is Exercise => Boolean(exercise));
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { classes, exercises, ledger, member, rewards, trainers, visits } from './src/domain';
import { colors, radius } from './src/theme';
import { baseStyles, Card, Metric, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from './src/ui';

type AppState = {
  bookedClasses: string[];
  completedExercises: string[];
  redeemedRewards: string[];
  points: number;
  toggleClass: (id: string) => void;
  toggleExercise: (id: string) => void;
  redeem: (id: string, cost: number) => void;
};

const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'kissonde-phase1-state';

function StateProvider({ children }: { children: React.ReactNode }) {
  const [bookedClasses, setBookedClasses] = useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [points, setPoints] = useState(member.points);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        const saved = JSON.parse(raw);
        setBookedClasses(saved.bookedClasses ?? []);
        setCompletedExercises(saved.completedExercises ?? []);
        setRedeemedRewards(saved.redeemedRewards ?? []);
        setPoints(saved.points ?? member.points);
      }
    }).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ bookedClasses, completedExercises, redeemedRewards, points }));
  }, [bookedClasses, completedExercises, redeemedRewards, points, hydrated]);

  const value = useMemo<AppState>(() => ({
    bookedClasses,
    completedExercises,
    redeemedRewards,
    points,
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
      Alert.alert('Recompensa desbloqueada', 'A recompensa foi adicionada à sua conta.');
    },
  }), [bookedClasses, completedExercises, redeemedRewards, points]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('StateProvider is missing');
  return value;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <SafeAreaView edges={['top']} style={baseStyles.screen}><ScrollView contentContainerStyle={baseStyles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView></SafeAreaView>;
}

function HomeScreen() {
  const navigation = useNavigation<any>();
  const { points, completedExercises, bookedClasses } = useAppState();
  const nextClass = classes.find(c => bookedClasses.includes(c.id)) ?? classes[1];
  const workoutPercent = Math.round((completedExercises.length / exercises.length) * 100);

  return <Shell>
    <View style={styles.topbar}>
      <View><Text style={styles.brand}>KISSONDE</Text><Text style={styles.brandSub}>GYM</Text></View>
      <Pressable onPress={() => navigation.navigate('Profile')} style={styles.avatar}><Ionicons name="person" size={19} color={colors.text} /></Pressable>
    </View>
    <ScreenTitle eyebrow="Boa tarde" title="O teu treino começa aqui." subtitle="Tudo o que precisas para entrar, treinar e acompanhar o teu progresso." />

    <Card style={styles.heroCard}>
      <View style={styles.spaceBetween}><View><Text style={styles.kicker}>ACESSO RÁPIDO</Text><Text style={styles.cardTitle}>Cartão digital</Text><Text style={styles.cardMuted}>Membership {member.status.toLowerCase()} · pronto offline</Text></View><View style={styles.qrMini}><Ionicons name="qr-code" size={32} color="#121212" /></View></View>
      <View style={styles.divider} />
      <View style={styles.metricsRow}><Metric value={`${points.toLocaleString('pt-PT')}`} label="Pontos Kissonde" /><Metric value={`${member.streak}x`} label="Treinos esta semana" /><Metric value="42%" label="Ocupação agora" /></View>
    </Card>

    <SectionHeader title="Treino de hoje" action={`Semana 4 · ${workoutPercent}%`} />
    <Card>
      <View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Push Day</Text><Text style={styles.cardMuted}>12 semanas · Hipertrofia intermédia</Text></View><Pill tone={completedExercises.length === exercises.length ? 'success' : 'default'}>{completedExercises.length}/{exercises.length} exercícios</Pill></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${workoutPercent}%` }]} /></View>
    </Card>

    <SectionHeader title="Próxima aula" />
    <Card>
      <View style={styles.spaceBetween}><View><Text style={styles.cardTitle}>{nextClass.name}</Text><Text style={styles.cardMuted}>{nextClass.instructor} · {nextClass.duration}</Text></View><View style={styles.timeBox}><Text style={styles.time}>{nextClass.time}</Text></View></View>
    </Card>

    <SectionHeader title="Melhor hora para treinar" />
    <Card>
      <Text style={styles.cardTitle}>Kissonde Viana · 42% ocupado</Text>
      <Text style={styles.cardMuted}>Movimento moderado agora. Normalmente mais tranquilo entre 10:00–15:00 e depois das 20:00.</Text>
      <View style={styles.occupancyTrack}><View style={[styles.occupancyFill, { width: '42%' }]} /></View>
    </Card>
  </Shell>;
}

function AccessScreen() {
  return <Shell>
    <ScreenTitle eyebrow="Acesso" title="Entrar sem fricção." subtitle="O código de acesso fica disponível mesmo quando a internet falha." />
    <Card style={{ alignItems: 'center', gap: 16 }}>
      <View style={styles.qrWrap}><QRCode value={`KISSONDE:${member.id}:ACTIVE`} size={190} backgroundColor="#FFFFFF" color="#111111" /></View>
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.cardMuted}>{member.id} · {member.membership}</Text>
      <Pill tone="success">● DISPONÍVEL OFFLINE</Pill>
      <View style={[styles.metricsRow, { width: '100%' }]}><Metric value={member.status} label="Estado" /><Metric value={member.branch} label="Clube" /><Metric value={member.expiry} label="Validade" /></View>
    </Card>

    <SectionHeader title="Histórico de visitas" />
    {visits.map(v => <Card key={v.id} style={{ marginBottom: 10 }}>
      <View style={styles.spaceBetween}><View><Text style={styles.cardTitle}>{v.date} · {v.branch}</Text><Text style={styles.cardMuted}>{v.enteredAt}{v.exitedAt ? ` — ${v.exitedAt}` : ''} · ID {v.id}</Text></View><Pill tone={v.status === 'verified' ? 'success' : 'info'}>{v.status === 'verified' ? `Verificada +${v.points}` : 'Pendente'}</Pill></View>
    </Card>)}
    <SecondaryButton label="Reportar visita em falta" onPress={() => Alert.alert('Pedido criado', 'A equipa Kissonde poderá validar a visita através do ID e do registo de acesso.')} />
  </Shell>;
}

function TrainScreen() {
  const { completedExercises, toggleExercise } = useAppState();
  const completed = completedExercises.length;
  return <Shell>
    <ScreenTitle eyebrow="Treinar" title="Programa, não vídeos soltos." subtitle="Cada sessão mostra o que fizeste antes e a progressão recomendada para hoje." />
    <Card style={styles.programCard}>
      <Text style={styles.kicker}>PROGRAMA ATUAL</Text><Text style={styles.cardTitle}>12 Semanas · Hipertrofia</Text><Text style={styles.cardMuted}>Semana 4 · Dia 2 · Push Day</Text>
      <View style={styles.metricsRow}><Metric value={`${completed}/${exercises.length}`} label="Concluídos hoje" /><Metric value="3/4" label="Sessões da semana" /><Metric value="+8.4%" label="Volume vs. início" /></View>
    </Card>
    <SectionHeader title="Exercícios de hoje" />
    {exercises.map((exercise, index) => {
      const done = completedExercises.includes(exercise.id);
      return <Card key={exercise.id} style={[{ marginBottom: 10 }, done ? styles.doneCard : undefined]}>
        <View style={styles.exerciseRow}>
          <View style={styles.exerciseNumber}><Text style={styles.exerciseNumberText}>{index + 1}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.cardTitle}>{exercise.name}</Text><Text style={styles.cardMuted}>{exercise.sets} séries × {exercise.reps} reps · {exercise.target}</Text></View>
          <Pressable onPress={() => toggleExercise(exercise.id)} style={[styles.check, done && styles.checkDone]}><Ionicons name={done ? 'checkmark' : 'add'} size={20} color={done ? '#111' : colors.text} /></Pressable>
        </View>
        <View style={styles.exerciseCompare}><View><Text style={styles.smallLabel}>ÚLTIMA SESSÃO</Text><Text style={styles.compareValue}>{exercise.previous}</Text></View><Ionicons name="arrow-forward" color={colors.muted} size={18} /><View><Text style={styles.smallLabel}>SUGERIDO HOJE</Text><Text style={styles.compareValue}>{exercise.suggested}</Text></View></View>
      </Card>;
    })}
    {completed === exercises.length ? <PrimaryButton label="Concluir Push Day · +20 pontos" onPress={() => Alert.alert('Treino concluído', 'Push Day guardado no teu histórico.')} /> : null}
  </Shell>;
}

function ClassesScreen() {
  const { bookedClasses, toggleClass } = useAppState();
  return <Shell>
    <ScreenTitle eyebrow="Aulas & PT" title="Reserva com contexto." subtitle="Vê capacidade, posição em lista de espera e disponibilidade de treinadores antes de decidir." />
    <SectionHeader title="Aulas de hoje" />
    {classes.map(c => {
      const booked = bookedClasses.includes(c.id);
      const full = c.booked >= c.capacity;
      return <Card key={c.id} style={{ marginBottom: 10 }}>
        <View style={styles.spaceBetween}><View><Text style={styles.cardTitle}>{c.time} · {c.name}</Text><Text style={styles.cardMuted}>{c.instructor} · {c.duration} · {c.difficulty}</Text></View><Pill tone={full ? 'danger' : 'success'}>{full ? `${c.capacity}/${c.capacity}` : `${c.capacity - c.booked} vagas`}</Pill></View>
        {full ? <Text style={styles.waitlistText}>Lista de espera: {c.waitlist} pessoas · ao entrar, serás #{c.waitlist + 1}</Text> : null}
        <View style={{ height: 12 }} />
        <PrimaryButton label={booked ? 'Cancelar reserva' : full ? `Entrar na lista · #${c.waitlist + 1}` : 'Reservar aula'} onPress={() => toggleClass(c.id)} />
      </Card>;
    })}

    <SectionHeader title="Personal trainers" />
    {trainers.map(t => <Card key={t.id} style={{ marginBottom: 10 }}>
      <View style={styles.trainerRow}><View style={styles.trainerAvatar}><Ionicons name="fitness" size={24} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{t.name}</Text><Text style={styles.cardMuted}>{t.experience} · {t.languages.join(', ')}</Text></View></View>
      <Text style={styles.specialties}>{t.specialties.join(' · ')}</Text>
      <Text style={styles.nextSlot}>Próximo horário: {t.nextSlot}</Text>
      <PrimaryButton label="Reservar sessão de PT" onPress={() => Alert.alert('Sessão selecionada', `${t.name} · ${t.nextSlot}\nO pagamento será ligado ao sistema Kissonde na integração de backend.`)} />
    </Card>)}
  </Shell>;
}

function RewardsScreen() {
  const { points, redeemedRewards, redeem } = useAppState();
  return <Shell>
    <ScreenTitle eyebrow="Recompensas" title="Pontos que fazem sentido." subtitle="Cada ponto tem origem visível e és tu quem escolhe como o gastar." />
    <Card style={styles.pointsHero}><Text style={styles.kicker}>SALDO DISPONÍVEL</Text><Text style={styles.points}>{points.toLocaleString('pt-PT')}</Text><Text style={styles.cardMuted}>Pontos Kissonde</Text></Card>
    <SectionHeader title="Escolher recompensa" />
    {rewards.map(r => {
      const redeemed = redeemedRewards.includes(r.id);
      return <Card key={r.id} style={{ marginBottom: 10 }}>
        <View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{r.title}</Text><Text style={styles.cardMuted}>{r.subtitle}</Text></View><Text style={styles.rewardCost}>{r.points}</Text></View>
        <View style={{ height: 12 }} />
        <PrimaryButton disabled={redeemed || points < r.points} label={redeemed ? 'Desbloqueada' : points < r.points ? `Faltam ${r.points - points} pontos` : `Trocar por ${r.points} pontos`} onPress={() => redeem(r.id, r.points)} />
      </Card>;
    })}
    <SectionHeader title="Histórico de pontos" />
    {ledger.map(item => <View key={item.id} style={styles.ledgerRow}><View><Text style={styles.ledgerTitle}>{item.title}</Text><Text style={styles.cardMuted}>{item.date}</Text></View><Text style={[styles.ledgerPoints, { color: item.points >= 0 ? colors.success : colors.danger }]}>{item.points >= 0 ? '+' : ''}{item.points}</Text></View>)}
  </Shell>;
}

function ProfileScreen() {
  const [classAlerts, setClassAlerts] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const navigation = useNavigation<any>();
  return <Shell>
    <ScreenTitle eyebrow="Perfil" title={member.name} subtitle={`${member.membership} · ${member.id}`} />
    <Card>
      <Info label="Estado da adesão" value={member.status} /><Info label="Clube principal" value={member.branch} /><Info label="Validade" value={member.expiry} /><Info label="Idioma" value="Português" last />
    </Card>
    <SectionHeader title="Notificações" />
    <Card><Setting label="Aulas e lista de espera" value={classAlerts} onChange={setClassAlerts} /><Setting label="Objetivos e sequência semanal" value={streakAlerts} onChange={setStreakAlerts} last /></Card>
    <SectionHeader title="Conta" />
    <Card><Info label="Plano" value="Premium" /><Info label="Pagamento" value="Em dia" /><Info label="Próxima renovação" value="31 Dez 2026" last /></Card>
    <View style={{ height: 14 }} /><SecondaryButton label="Ajuda e suporte" onPress={() => navigation.navigate('Support')} />
  </Shell>;
}

function SupportScreen() {
  const options = ['Não consigo entrar no ginásio', 'Pagamento ou mensalidade', 'Visita em falta', 'Pontos/recompensa em falta', 'Problema com uma aula', 'Problema técnico na app'];
  return <Shell>
    <ScreenTitle eyebrow="Suporte" title="Resolver sem adivinhar." subtitle="Escolhe o problema. O pedido pode incluir automaticamente o teu ID de membro e referências relevantes." />
    {options.map(option => <Pressable key={option} onPress={() => Alert.alert('Pedido preparado', `${option}\nMembro: ${member.id}\nClube: ${member.branch}`)} style={styles.supportRow}><Text style={styles.supportText}>{option}</Text><Ionicons name="chevron-forward" size={20} color={colors.muted} /></Pressable>)}
  </Shell>;
}

function Info({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.cardMuted}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function Setting({ label, value, onChange, last = false }: { label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.infoValue}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#806329' }} thumbColor={value ? colors.accent : '#C7C7CA'} /></View>;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = { Início: 'home', Acesso: 'qr-code', Treinar: 'barbell', Aulas: 'calendar', Prémios: 'gift' };

function MainTabs() {
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: styles.tabLabel,
    tabBarIcon: ({ color, size }) => <Ionicons name={tabIcons[route.name] ?? 'ellipse'} size={size} color={color} />,
  })}>
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Acesso" component={AccessScreen} />
    <Tab.Screen name="Treinar" component={TrainScreen} />
    <Tab.Screen name="Aulas" component={ClassesScreen} />
    <Tab.Screen name="Prémios" component={RewardsScreen} />
  </Tab.Navigator>;
}

export default function App() {
  return <SafeAreaProvider><StateProvider><NavigationContainer><StatusBar style="light" /><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTintColor: colors.text, contentStyle: { backgroundColor: colors.bg }, headerShadowVisible: false }}><Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} /><Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} /><Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Ajuda' }} /></Stack.Navigator></NavigationContainer></StateProvider></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  brand: { color: colors.text, fontWeight: '900', fontSize: 17, letterSpacing: 2.2 },
  brandSub: { color: colors.accent, fontWeight: '900', fontSize: 9, letterSpacing: 4.5 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  heroCard: { gap: 16 },
  kicker: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 5 },
  cardTitle: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  cardMuted: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  qrMini: { width: 58, height: 58, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border },
  metricsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  timeBox: { minWidth: 64, paddingVertical: 12, paddingHorizontal: 10, backgroundColor: colors.panel2, borderRadius: radius.md, alignItems: 'center' },
  time: { color: colors.text, fontSize: 16, fontWeight: '900' },
  occupancyTrack: { height: 8, backgroundColor: colors.panel2, borderRadius: 99, overflow: 'hidden', marginTop: 16 },
  occupancyFill: { height: '100%', backgroundColor: colors.success },
  qrWrap: { padding: 18, backgroundColor: '#FFF', borderRadius: 22 },
  memberName: { color: colors.text, fontSize: 22, fontWeight: '900' },
  programCard: { gap: 8 },
  doneCard: { borderColor: '#285F3D', opacity: .84 },
  exerciseRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  exerciseNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  exerciseNumberText: { color: colors.muted, fontWeight: '900' },
  check: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  exerciseCompare: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  smallLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: .7 },
  compareValue: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 4 },
  waitlistText: { color: colors.info, fontSize: 12, fontWeight: '700', marginTop: 10 },
  trainerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trainerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2A261D', alignItems: 'center', justifyContent: 'center' },
  specialties: { color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 14 },
  nextSlot: { color: colors.accent, fontSize: 12, fontWeight: '800', marginVertical: 12 },
  pointsHero: { alignItems: 'center', paddingVertical: 26 },
  points: { color: colors.text, fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  rewardCost: { color: colors.accent, fontSize: 20, fontWeight: '900' },
  ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  ledgerTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  ledgerPoints: { fontSize: 15, fontWeight: '900' },
  infoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoValue: { color: colors.text, fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  supportRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, marginBottom: 8, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  supportText: { color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
  tabBar: { position: 'absolute', height: 76, paddingTop: 9, paddingBottom: 10, backgroundColor: '#111114F2', borderTopColor: colors.border },
  tabLabel: { fontSize: 10, fontWeight: '700' },
});

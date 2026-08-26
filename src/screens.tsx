import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { classes, exercises, ledger, member, rewards, trainers, visits } from './domain';
import { colors, radius } from './theme';
import { baseStyles, Card, Metric, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from './ui';
import { useAppState } from './state';

function Shell({ children }: { children: React.ReactNode }) {
  return <SafeAreaView edges={['top']} style={baseStyles.screen}><ScrollView contentContainerStyle={baseStyles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView></SafeAreaView>;
}

export function LoginScreen() {
  const { signIn } = useAppState();
  const [memberId, setMemberId] = useState('KSG-02481');
  const [password, setPassword] = useState('');
  return <SafeAreaView style={styles.loginScreen}>
    <View style={styles.loginBrand}><Text style={styles.brand}>KISSONDE</Text><Text style={styles.brandSub}>GYM</Text></View>
    <View style={styles.loginBody}>
      <ScreenTitle eyebrow="Área de membro" title="Entrar" subtitle="A Fase 1 usa autenticação de demonstração. A API real será ligada ao sistema de membros Kissonde." />
      <Text style={styles.inputLabel}>NÚMERO DE MEMBRO</Text>
      <TextInput value={memberId} onChangeText={setMemberId} autoCapitalize="characters" placeholder="KSG-00000" placeholderTextColor={colors.muted} style={styles.input} />
      <Text style={styles.inputLabel}>PALAVRA-PASSE</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.muted} style={styles.input} />
      <PrimaryButton label="Entrar na minha conta" onPress={signIn} />
      <Text style={styles.demoNote}>Demo: qualquer palavra-passe entra. Nenhuma credencial real é armazenada.</Text>
    </View>
  </SafeAreaView>;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { points, completedExercises, bookedClasses } = useAppState();
  const nextClass = classes.find(c => bookedClasses.includes(c.id)) ?? classes[1];
  const workoutPercent = Math.round((completedExercises.length / exercises.length) * 100);
  return <Shell>
    <View style={styles.topbar}><View><Text style={styles.brand}>KISSONDE</Text><Text style={styles.brandSub}>GYM</Text></View><Pressable onPress={() => navigation.navigate('Profile')} style={styles.avatar}><Ionicons name="person" size={19} color={colors.text} /></Pressable></View>
    <ScreenTitle eyebrow="Boa tarde" title="O teu treino começa aqui." subtitle="Acesso, treino, progresso, aulas e recompensas num único lugar." />
    <Card style={styles.heroCard}>
      <View style={styles.spaceBetween}><View><Text style={styles.kicker}>ACESSO RÁPIDO</Text><Text style={styles.cardTitle}>Cartão digital</Text><Text style={styles.cardMuted}>Adesão {member.status.toLowerCase()} · disponível offline</Text></View><View style={styles.qrMini}><Ionicons name="qr-code" size={32} color="#121212" /></View></View>
      <View style={styles.divider} /><View style={styles.metricsRow}><Metric value={points.toLocaleString('pt-PT')} label="Pontos Kissonde" /><Metric value={`${member.streak}x`} label="Treinos esta semana" /><Metric value="42%" label="Ocupação agora" /></View>
    </Card>
    <SectionHeader title="Treino de hoje" action={`Semana 4 · ${workoutPercent}%`} />
    <Card><View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Push Day</Text><Text style={styles.cardMuted}>12 semanas · Hipertrofia intermédia</Text></View><Pill tone={completedExercises.length === exercises.length ? 'success' : 'default'}>{completedExercises.length}/{exercises.length} exercícios</Pill></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${workoutPercent}%` }]} /></View></Card>
    <SectionHeader title="Próxima aula" />
    <Card><View style={styles.spaceBetween}><View><Text style={styles.cardTitle}>{nextClass.name}</Text><Text style={styles.cardMuted}>{nextClass.instructor} · {nextClass.duration}</Text></View><View style={styles.timeBox}><Text style={styles.time}>{nextClass.time}</Text></View></View></Card>
    <SectionHeader title="Melhor hora para treinar" />
    <Card><Text style={styles.cardTitle}>Kissonde Viana · 42% ocupado</Text><Text style={styles.cardMuted}>Movimento moderado agora. Normalmente mais tranquilo entre 10:00–15:00 e depois das 20:00.</Text><View style={styles.occupancyTrack}><View style={[styles.occupancyFill, { width: '42%' }]} /></View></Card>
  </Shell>;
}

export function AccessScreen() {
  return <Shell>
    <ScreenTitle eyebrow="Acesso" title="Entrar sem fricção." subtitle="O código de acesso fica disponível mesmo quando a internet falha." />
    <Card style={{ alignItems: 'center', gap: 16 }}><View style={styles.qrWrap}><QRCode value={`KISSONDE:${member.id}:ACTIVE`} size={190} backgroundColor="#FFFFFF" color="#111111" /></View><Text style={styles.memberName}>{member.name}</Text><Text style={styles.cardMuted}>{member.id} · {member.membership}</Text><Pill tone="success">● DISPONÍVEL OFFLINE</Pill><View style={[styles.metricsRow, { width: '100%' }]}><Metric value={member.status} label="Estado" /><Metric value={member.branch} label="Clube" /><Metric value={member.expiry} label="Validade" /></View></Card>
    <SectionHeader title="Histórico de visitas" />
    {visits.map(v => <Card key={v.id} style={{ marginBottom: 10 }}><View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{v.date} · {v.branch}</Text><Text style={styles.cardMuted}>{v.enteredAt}{v.exitedAt ? ` — ${v.exitedAt}` : ''} · ID {v.id}</Text></View><Pill tone={v.status === 'verified' ? 'success' : 'info'}>{v.status === 'verified' ? `Verificada +${v.points}` : 'Pendente'}</Pill></View></Card>)}
    <SecondaryButton label="Reportar visita em falta" onPress={() => Alert.alert('Pedido criado', 'A equipa Kissonde poderá validar a visita através do ID e do registo de acesso.')} />
  </Shell>;
}

export function TrainScreen() {
  const { completedExercises, toggleExercise } = useAppState();
  const completed = completedExercises.length;
  return <Shell>
    <ScreenTitle eyebrow="Treinar" title="Programa, não vídeos soltos." subtitle="A sessão mostra o que fizeste antes e a progressão recomendada para hoje." />
    <Card style={styles.programCard}><Text style={styles.kicker}>PROGRAMA ATUAL</Text><Text style={styles.cardTitle}>12 Semanas · Hipertrofia</Text><Text style={styles.cardMuted}>Semana 4 · Dia 2 · Push Day</Text><View style={styles.metricsRow}><Metric value={`${completed}/${exercises.length}`} label="Concluídos hoje" /><Metric value="3/4" label="Sessões da semana" /><Metric value="+8.4%" label="Volume vs. início" /></View></Card>
    <SectionHeader title="Exercícios de hoje" />
    {exercises.map((exercise, index) => {
      const done = completedExercises.includes(exercise.id);
      return <Card key={exercise.id} style={[{ marginBottom: 10 }, done ? styles.doneCard : undefined]}><View style={styles.exerciseRow}><View style={styles.exerciseNumber}><Text style={styles.exerciseNumberText}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{exercise.name}</Text><Text style={styles.cardMuted}>{exercise.sets} séries × {exercise.reps} reps · {exercise.target}</Text></View><Pressable onPress={() => toggleExercise(exercise.id)} style={[styles.check, done && styles.checkDone]}><Ionicons name={done ? 'checkmark' : 'add'} size={20} color={done ? '#111' : colors.text} /></Pressable></View><View style={styles.exerciseCompare}><View><Text style={styles.smallLabel}>ÚLTIMA SESSÃO</Text><Text style={styles.compareValue}>{exercise.previous}</Text></View><Ionicons name="arrow-forward" color={colors.muted} size={18} /><View><Text style={styles.smallLabel}>SUGERIDO HOJE</Text><Text style={styles.compareValue}>{exercise.suggested}</Text></View></View></Card>;
    })}
    {completed === exercises.length ? <PrimaryButton label="Concluir Push Day · +20 pontos" onPress={() => Alert.alert('Treino concluído', 'Push Day guardado no teu histórico.')} /> : null}

    <SectionHeader title="O teu progresso" />
    <Card><View style={styles.metricsRow}><Metric value="82.5 kg" label="Melhor supino" /><Metric value="3.8x" label="Treinos/semana" /><Metric value="+12.5 kg" label="Força em 12 semanas" /></View><Text style={styles.chartTitle}>Volume de treino · últimas 6 semanas</Text><View style={styles.chart}>{[42, 55, 61, 58, 72, 84].map((h, i) => <View key={i} style={styles.barSlot}><View style={[styles.bar, { height: h }]} /><Text style={styles.barLabel}>S{i + 1}</Text></View>)}</View></Card>

    <SectionHeader title="Biblioteca de exercícios" />
    {exercises.slice(0, 4).map(exercise => <Pressable key={`library-${exercise.id}`} onPress={() => Alert.alert(exercise.name, `Músculo principal: ${exercise.target}\n\nTécnica: mantém controlo total do movimento, amplitude confortável e progressão gradual de carga.\n\nA demonstração em vídeo será ligada ao catálogo de conteúdo Kissonde.`)} style={styles.libraryRow}><View style={styles.libraryIcon}><Ionicons name="play" size={17} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={styles.ledgerTitle}>{exercise.name}</Text><Text style={styles.cardMuted}>{exercise.target} · ver técnica e alternativas</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}
  </Shell>;
}

export function ClassesScreen() {
  const { bookedClasses, toggleClass } = useAppState();
  return <Shell>
    <ScreenTitle eyebrow="Aulas & PT" title="Reserva com contexto." subtitle="Capacidade, lista de espera e disponibilidade de treinadores antes de decidir." />
    <SectionHeader title="Aulas de hoje" />
    {classes.map(c => {
      const booked = bookedClasses.includes(c.id); const full = c.booked >= c.capacity;
      return <Card key={c.id} style={{ marginBottom: 10 }}><View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{c.time} · {c.name}</Text><Text style={styles.cardMuted}>{c.instructor} · {c.duration} · {c.difficulty}</Text></View><Pill tone={full ? 'danger' : 'success'}>{full ? `${c.capacity}/${c.capacity}` : `${c.capacity - c.booked} vagas`}</Pill></View>{full ? <Text style={styles.waitlistText}>Lista de espera: {c.waitlist} pessoas · ao entrar, serás #{c.waitlist + 1}</Text> : null}<View style={{ height: 12 }} /><PrimaryButton label={booked ? 'Cancelar reserva' : full ? `Entrar na lista · #${c.waitlist + 1}` : 'Reservar aula'} onPress={() => toggleClass(c.id)} /></Card>;
    })}
    <SectionHeader title="Personal trainers" />
    {trainers.map(t => <Card key={t.id} style={{ marginBottom: 10 }}><View style={styles.trainerRow}><View style={styles.trainerAvatar}><Ionicons name="fitness" size={24} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{t.name}</Text><Text style={styles.cardMuted}>{t.experience} · {t.languages.join(', ')}</Text></View></View><Text style={styles.specialties}>{t.specialties.join(' · ')}</Text><Text style={styles.nextSlot}>Próximo horário: {t.nextSlot}</Text><PrimaryButton label="Reservar sessão de PT" onPress={() => Alert.alert('Sessão selecionada', `${t.name} · ${t.nextSlot}\nO pagamento será ligado ao sistema Kissonde na integração de backend.`)} /></Card>)}
  </Shell>;
}

export function RewardsScreen() {
  const { points, redeemedRewards, redeem } = useAppState();
  return <Shell>
    <ScreenTitle eyebrow="Recompensas" title="Pontos que fazem sentido." subtitle="Cada ponto tem origem visível e és tu quem escolhe como o gastar." />
    <Card style={styles.pointsHero}><Text style={styles.kicker}>SALDO DISPONÍVEL</Text><Text style={styles.points}>{points.toLocaleString('pt-PT')}</Text><Text style={styles.cardMuted}>Pontos Kissonde</Text></Card>
    <SectionHeader title="Escolher recompensa" />
    {rewards.map(r => { const redeemed = redeemedRewards.includes(r.id); return <Card key={r.id} style={{ marginBottom: 10 }}><View style={styles.spaceBetween}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{r.title}</Text><Text style={styles.cardMuted}>{r.subtitle}</Text></View><Text style={styles.rewardCost}>{r.points}</Text></View><View style={{ height: 12 }} /><PrimaryButton disabled={redeemed || points < r.points} label={redeemed ? 'Desbloqueada' : points < r.points ? `Faltam ${r.points - points} pontos` : `Trocar por ${r.points} pontos`} onPress={() => redeem(r.id, r.points)} /></Card>; })}
    <SectionHeader title="Histórico de pontos" />
    {ledger.map(item => <View key={item.id} style={styles.ledgerRow}><View><Text style={styles.ledgerTitle}>{item.title}</Text><Text style={styles.cardMuted}>{item.date}</Text></View><Text style={[styles.ledgerPoints, { color: item.points >= 0 ? colors.success : colors.danger }]}>{item.points >= 0 ? '+' : ''}{item.points}</Text></View>)}
  </Shell>;
}

export function ProfileScreen() {
  const { signOut } = useAppState();
  const [classAlerts, setClassAlerts] = useState(true); const [streakAlerts, setStreakAlerts] = useState(true);
  const navigation = useNavigation<any>();
  return <Shell>
    <ScreenTitle eyebrow="Perfil" title={member.name} subtitle={`${member.membership} · ${member.id}`} />
    <Card><Info label="Estado da adesão" value={member.status} /><Info label="Clube principal" value={member.branch} /><Info label="Validade" value={member.expiry} /><Info label="Idioma" value="Português" last /></Card>
    <SectionHeader title="Notificações" /><Card><Setting label="Aulas e lista de espera" value={classAlerts} onChange={setClassAlerts} /><Setting label="Objetivos e sequência semanal" value={streakAlerts} onChange={setStreakAlerts} last /></Card>
    <SectionHeader title="Conta" /><Card><Info label="Plano" value="Premium" /><Info label="Pagamento" value="Em dia" /><Info label="Próxima renovação" value="31 Dez 2026" last /></Card>
    <View style={{ height: 14 }} /><SecondaryButton label="Ajuda e suporte" onPress={() => navigation.navigate('Support')} /><View style={{ height: 10 }} /><SecondaryButton label="Terminar sessão" onPress={signOut} />
  </Shell>;
}

export function SupportScreen() {
  const options = ['Não consigo entrar no ginásio', 'Pagamento ou mensalidade', 'Visita em falta', 'Pontos/recompensa em falta', 'Problema com uma aula', 'Problema técnico na app'];
  return <Shell><ScreenTitle eyebrow="Suporte" title="Resolver sem adivinhar." subtitle="O pedido inclui automaticamente o teu ID de membro e referências relevantes." />{options.map(option => <Pressable key={option} onPress={() => Alert.alert('Pedido preparado', `${option}\nMembro: ${member.id}\nClube: ${member.branch}`)} style={styles.supportRow}><Text style={styles.supportText}>{option}</Text><Ionicons name="chevron-forward" size={20} color={colors.muted} /></Pressable>)}</Shell>;
}

function Info({ label, value, last = false }: { label: string; value: string; last?: boolean }) { return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.cardMuted}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }
function Setting({ label, value, onChange, last = false }: { label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) { return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.infoValue}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#806329' }} thumbColor={value ? colors.accent : '#C7C7CA'} /></View>; }

const styles = StyleSheet.create({
  loginScreen: { flex: 1, backgroundColor: colors.bg, padding: 22, justifyContent: 'space-between' }, loginBrand: { paddingTop: 16 }, loginBody: { paddingBottom: 30 },
  inputLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: .9, marginBottom: 7, marginTop: 8 }, input: { height: 52, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 15, marginBottom: 13, fontSize: 15 }, demoNote: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 14 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }, brand: { color: colors.text, fontWeight: '900', fontSize: 17, letterSpacing: 2.2 }, brandSub: { color: colors.accent, fontWeight: '900', fontSize: 9, letterSpacing: 4.5 }, avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  heroCard: { gap: 16 }, kicker: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 5 }, cardTitle: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800' }, cardMuted: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 }, spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, qrMini: { width: 58, height: 58, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }, divider: { height: 1, backgroundColor: colors.border }, metricsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 16 }, progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 }, timeBox: { minWidth: 64, paddingVertical: 12, paddingHorizontal: 10, backgroundColor: colors.panel2, borderRadius: radius.md, alignItems: 'center' }, time: { color: colors.text, fontSize: 16, fontWeight: '900' }, occupancyTrack: { height: 8, backgroundColor: colors.panel2, borderRadius: 99, overflow: 'hidden', marginTop: 16 }, occupancyFill: { height: '100%', backgroundColor: colors.success },
  qrWrap: { padding: 18, backgroundColor: '#FFF', borderRadius: 22 }, memberName: { color: colors.text, fontSize: 22, fontWeight: '900' }, programCard: { gap: 8 }, doneCard: { borderColor: '#285F3D', opacity: .84 }, exerciseRow: { flexDirection: 'row', gap: 12, alignItems: 'center' }, exerciseNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }, exerciseNumberText: { color: colors.muted, fontWeight: '900' }, check: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  exerciseCompare: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border }, smallLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: .7 }, compareValue: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 4 },
  chartTitle: { color: colors.muted, fontSize: 11, fontWeight: '800', marginTop: 22, marginBottom: 12 }, chart: { height: 115, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }, barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 5 }, bar: { width: '72%', backgroundColor: colors.accent, borderRadius: 6 }, barLabel: { color: colors.muted, fontSize: 9 }, libraryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, paddingHorizontal: 14, marginBottom: 8, borderRadius: radius.md, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border }, libraryIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2A261D', alignItems: 'center', justifyContent: 'center' },
  waitlistText: { color: colors.info, fontSize: 12, fontWeight: '700', marginTop: 10 }, trainerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, trainerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2A261D', alignItems: 'center', justifyContent: 'center' }, specialties: { color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 14 }, nextSlot: { color: colors.accent, fontSize: 12, fontWeight: '800', marginVertical: 12 },
  pointsHero: { alignItems: 'center', paddingVertical: 26 }, points: { color: colors.text, fontSize: 48, fontWeight: '900', letterSpacing: -2 }, rewardCost: { color: colors.accent, fontSize: 20, fontWeight: '900' }, ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }, ledgerTitle: { color: colors.text, fontSize: 14, fontWeight: '700' }, ledgerPoints: { fontSize: 15, fontWeight: '900' },
  infoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.border }, infoValue: { color: colors.text, fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'right' }, supportRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, marginBottom: 8, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md }, supportText: { color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
});

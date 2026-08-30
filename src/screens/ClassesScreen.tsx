import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClassCategory, classes, trainers } from '../domain';
import { colors, radius } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { EmptyState, Shell } from './shared';

type Filter = 'Todas' | 'Disponíveis' | 'Favoritas' | ClassCategory;
const filters: Filter[] = ['Todas', 'Disponíveis', 'Favoritas', 'Cycling', 'HIIT', 'Dance', 'Strength', 'Mobility', 'Functional'];

export function ClassesScreen() {
  const { reservations, reserveClass, cancelReservation, ptBookings, bookTrainer, cancelPTBooking, favoriteClassIds, toggleFavoriteClass, instructorRatings, rateInstructor } = useAppState();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Todas');
  const dateLabel = new Intl.DateTimeFormat('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date()).replace('.', '').toUpperCase();

  const filteredClasses = useMemo(() => classes.filter(gymClass => {
    const matchesQuery = !query.trim() || `${gymClass.name} ${gymClass.instructor} ${gymClass.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'Todas' || (filter === 'Disponíveis' && gymClass.booked < gymClass.capacity) || (filter === 'Favoritas' && favoriteClassIds.includes(gymClass.id)) || gymClass.category === filter;
    return matchesQuery && matchesFilter;
  }), [query, filter, favoriteClassIds]);

  return <Shell>
    <ScreenTitle eyebrow="Aulas & PT" title="Planeia antes de chegar." subtitle="Pesquisa, filtros, lotação, posição em espera, instrutores e reservas com estado claro." />

    <View style={styles.dayBar}><View><Text style={styles.dayEyebrow}>AGENDA</Text><Text style={styles.dayLabel}>{dateLabel}</Text></View><View style={styles.liveChip}><View style={styles.liveDot} /><Text style={styles.liveText}>HOJE</Text></View></View>

    <View style={styles.searchWrap}><Ionicons name="search-outline" size={18} color={colors.slateDark} /><TextInput accessibilityLabel="Pesquisar aulas" value={query} onChangeText={setQuery} placeholder="Aula, instrutor ou categoria" placeholderTextColor={colors.slate} style={styles.searchInput} />{query ? <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={colors.slate} /></Pressable> : null}</View>
    <View style={styles.filters}>{filters.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filter === item }} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>

    <SectionHeader title="Aulas" action={`${filteredClasses.length} resultado${filteredClasses.length === 1 ? '' : 's'}`} />
    {filteredClasses.length === 0 ? <Card><EmptyState title="Sem resultados" text="Experimenta outro horário, categoria ou remove os filtros." /></Card> : filteredClasses.map(gymClass => {
      const active = reservations.find(item => item.classId === gymClass.id && item.status !== 'cancelled');
      const full = gymClass.booked >= gymClass.capacity;
      const availability = Math.max(0, gymClass.capacity - gymClass.booked);
      const fill = Math.min(100, Math.round((gymClass.booked / gymClass.capacity) * 100));
      const favorite = favoriteClassIds.includes(gymClass.id);
      const trainer = trainers.find(item => item.name === gymClass.instructor);
      const userRating = instructorRatings[gymClass.instructor];
      return <Card key={gymClass.id} style={styles.classCard}>
        <View style={styles.classTop}>
          <View style={styles.timeBlock}><Text style={styles.time}>{gymClass.time}</Text><Text style={styles.duration}>{gymClass.duration}</Text></View>
          <View style={{ flex: 1, minWidth: 0 }}><Text style={styles.className}>{gymClass.name}</Text><Text style={styles.classMeta}>{gymClass.category} · {gymClass.difficulty}</Text><View style={styles.instructorLine}><Text style={styles.instructorName}>{gymClass.instructor}</Text><Ionicons name="star" size={11} color="#C9952F" /><Text style={styles.ratingText}>{userRating ? `${userRating}.0 tua` : `${trainer?.rating ?? 4.8} (${trainer?.reviews ?? 80})`}</Text></View></View>
          <Pressable accessibilityRole="button" accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onPress={() => toggleFavoriteClass(gymClass.id)} style={styles.favorite}><Ionicons name={favorite ? 'heart' : 'heart-outline'} size={19} color={favorite ? colors.danger : colors.slateDark} /></Pressable>
        </View>
        <View style={styles.capacityTrack}><View style={[styles.capacityFill, { width: `${fill}%` as any }]} /></View>
        <View style={styles.capacityLabels}><Text style={styles.capacityText}>{gymClass.booked}/{gymClass.capacity} inscritos</Text><Pill tone={full ? 'warning' : 'success'}>{full ? 'Lotada' : `${availability} vagas`}</Pill></View>

        {active?.status === 'waitlisted' ? <View style={styles.statePanel}><View style={styles.stateIconWarning}><Ionicons name="hourglass-outline" size={17} color={colors.warning} /></View><View style={{ flex: 1 }}><Text style={styles.stateTitle}>Lista de espera #{active.waitlistPosition}</Text><Text style={styles.stateText}>Probabilidade estimada de entrada: {waitlistProbability(active.waitlistPosition ?? 4)}%</Text></View></View> : null}
        {active?.status === 'confirmed' ? <View style={styles.statePanel}><View style={styles.stateIconSuccess}><Ionicons name="checkmark" size={17} color={colors.success} /></View><View style={{ flex: 1 }}><Text style={styles.stateTitle}>Vaga confirmada</Text><Text style={styles.stateText}>Reserva associada à tua conta.</Text></View></View> : null}

        <View style={styles.rateBlock}><Text style={styles.rateLabel}>{userRating ? 'A tua avaliação do instrutor' : 'Avaliar instrutor'}</Text><View style={styles.stars}>{[1, 2, 3, 4, 5].map(value => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${value} estrelas`} onPress={() => rateInstructor(gymClass.instructor, value)}><Ionicons name={(userRating ?? 0) >= value ? 'star' : 'star-outline'} size={18} color="#C9952F" /></Pressable>)}</View></View>

        <View style={{ height: 11 }} />
        {active ? <SecondaryButton label="Cancelar reserva" onPress={() => cancelReservation(gymClass.id)} /> : <PrimaryButton label={full ? `Entrar na lista · #${gymClass.waitlist + 1}` : 'Reservar aula'} onPress={() => reserveClass(gymClass.id)} />}
      </Card>;
    })}

    <SectionHeader title="Personal trainers" />
    <View style={styles.trainerList}>{trainers.map(trainer => {
      const booking = ptBookings.find(item => item.trainerId === trainer.id && item.status === 'confirmed');
      const userRating = instructorRatings[trainer.name];
      return <Card key={trainer.id} style={styles.trainerCard}>
        <View style={styles.trainerTop}><View style={styles.trainerAvatar}><Ionicons name="person" size={22} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.trainerName}>{trainer.name}</Text><View style={styles.trainerRating}><Ionicons name="star" size={12} color="#C9952F" /><Text style={styles.trainerMeta}>{userRating ? `${userRating}.0 tua avaliação` : `${trainer.rating} · ${trainer.reviews} avaliações`} · {trainer.experience}</Text></View></View><Ionicons name="fitness-outline" size={20} color={colors.slate} /></View>
        <View style={styles.specialtyWrap}>{trainer.specialties.map(item => <View key={item} style={styles.specialty}><Text style={styles.specialtyText}>{item}</Text></View>)}</View>
        <View style={styles.slotRow}><View style={styles.slotIcon}><Ionicons name="time-outline" size={16} color={colors.accentDark} /></View><View><Text style={styles.slotLabel}>PRÓXIMO HORÁRIO</Text><Text style={styles.slotValue}>{trainer.nextSlot}</Text></View></View>
        {booking ? <><View style={styles.bookingState}><Ionicons name="checkmark-circle" size={18} color={colors.success} /><Text style={styles.bookingStateText}>Sessão confirmada · {booking.slot}</Text></View><SecondaryButton label="Cancelar sessão" onPress={() => cancelPTBooking(booking.id)} /></> : <PrimaryButton label="Reservar sessão de PT" onPress={() => { bookTrainer(trainer.id, trainer.nextSlot); Alert.alert('Sessão confirmada', `${trainer.name} · ${trainer.nextSlot}`); }} />}
      </Card>;
    })}</View>

    <SectionHeader title="As minhas reservas" />
    {reservations.filter(item => item.status !== 'cancelled').length === 0 && ptBookings.filter(item => item.status === 'confirmed').length === 0 ? <Card><EmptyState title="Sem reservas futuras" text="As aulas e sessões de PT confirmadas ficam reunidas aqui." /></Card> : <Card style={styles.reservationsCard}>
      {reservations.filter(item => item.status !== 'cancelled').map((item, index) => { const gymClass = classes.find(gym => gym.id === item.classId); return <View key={item.id} style={[styles.reservationRow, index > 0 && styles.rowBorder]}><View style={styles.reservationIcon}><Ionicons name="calendar-outline" size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.reservationTitle}>{gymClass?.name ?? 'Aula'}</Text><Text style={styles.reservationMeta}>{gymClass?.time} · {item.id}</Text></View><Pill tone={item.status === 'confirmed' ? 'success' : 'warning'}>{item.status === 'confirmed' ? 'Confirmada' : `Espera #${item.waitlistPosition}`}</Pill></View>; })}
      {ptBookings.filter(item => item.status === 'confirmed').map(item => { const trainer = trainers.find(person => person.id === item.trainerId); return <View key={item.id} style={[styles.reservationRow, styles.rowBorder]}><View style={styles.reservationIcon}><Ionicons name="fitness-outline" size={18} color={colors.accentDark} /></View><View style={{ flex: 1 }}><Text style={styles.reservationTitle}>PT · {trainer?.name ?? 'Treinador'}</Text><Text style={styles.reservationMeta}>{item.slot} · {item.id}</Text></View><Pill tone="success">Confirmada</Pill></View>; })}
    </Card>}
  </Shell>;
}

function waitlistProbability(position: number) { return Math.max(28, Math.min(88, 96 - position * 11)); }

const styles = StyleSheet.create({
  dayBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.accentDeep, borderRadius: radius.lg, paddingHorizontal: 17, paddingVertical: 15 },
  dayEyebrow: { color: '#90C1E2', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  dayLabel: { color: colors.white, fontSize: 17, fontWeight: '900', marginTop: 3, letterSpacing: -.3 },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#245F8A', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#76D4A2' },
  liveText: { color: '#D9ECF8', fontSize: 8, fontWeight: '900', letterSpacing: .7 },
  searchWrap: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: colors.text, fontSize: 11, paddingVertical: 10, minWidth: 0 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  filter: { minHeight: 34, paddingHorizontal: 10, borderRadius: 99, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  filterActive: { backgroundColor: colors.accentDeep, borderColor: colors.accentDeep },
  filterText: { color: colors.muted, fontSize: 8, fontWeight: '900' },
  filterTextActive: { color: colors.white },
  classCard: { marginBottom: 12, padding: 15 },
  classTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeBlock: { width: 60, minHeight: 57, backgroundColor: colors.accentSoft, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  time: { color: colors.accentDark, fontSize: 17, fontWeight: '900' },
  duration: { color: colors.slateDark, fontSize: 8, fontWeight: '700', marginTop: 2 },
  className: { color: colors.text, fontSize: 15, fontWeight: '900' },
  classMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  instructorLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  instructorName: { color: colors.accentDark, fontSize: 9, fontWeight: '900' },
  ratingText: { color: colors.slateDark, fontSize: 8, fontWeight: '800' },
  favorite: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' },
  capacityTrack: { height: 5, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden', marginTop: 14 },
  capacityFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  capacityLabels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  capacityText: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  statePanel: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 13, padding: 11, marginTop: 12 },
  stateIconWarning: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center' },
  stateIconSuccess: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  stateTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  stateText: { color: colors.muted, fontSize: 9, marginTop: 2 },
  rateBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  rateLabel: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  stars: { flexDirection: 'row', gap: 5 },
  trainerList: { gap: 11 },
  trainerCard: { padding: 15 },
  trainerTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  trainerAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  trainerName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  trainerRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  trainerMeta: { color: colors.muted, fontSize: 9 },
  specialtyWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 13 },
  specialty: { backgroundColor: colors.panel2, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  specialtyText: { color: colors.slateDark, fontSize: 9, fontWeight: '800' },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 14 },
  slotIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  slotLabel: { color: colors.slateDark, fontSize: 8, fontWeight: '900', letterSpacing: .7 },
  slotValue: { color: colors.text, fontSize: 12, fontWeight: '900', marginTop: 2 },
  bookingState: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10, backgroundColor: colors.successSoft, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 11 },
  bookingStateText: { color: colors.success, fontSize: 10, fontWeight: '900' },
  reservationsCard: { paddingVertical: 3 },
  reservationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  reservationIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  reservationTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  reservationMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
});

import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { classes, trainers } from '../domain';
import { colors } from '../theme';
import { Card, Pill, PrimaryButton, ScreenTitle, SecondaryButton, SectionHeader } from '../ui';
import { useAppState } from '../state';
import { EmptyState, Shell, screenStyles as s } from './shared';

export function ClassesScreen() {
  const { reservations, reserveClass, cancelReservation, ptBookings, bookTrainer, cancelPTBooking } = useAppState();

  return <Shell>
    <ScreenTitle eyebrow="Aulas & PT" title="Reserva com estado visível." subtitle="Confirmação, lista de espera e sessões de PT ficam registadas na tua conta." />

    <SectionHeader title="Aulas de hoje" />
    {classes.map(gymClass => {
      const active = reservations.find(item => item.classId === gymClass.id && item.status !== 'cancelled');
      const full = gymClass.booked >= gymClass.capacity;
      return <Card key={gymClass.id} style={{ marginBottom: 10 }}>
        <View style={s.between}>
          <View style={{ flex: 1 }}><Text style={s.cardTitle}>{gymClass.time} · {gymClass.name}</Text><Text style={s.muted}>{gymClass.instructor} · {gymClass.duration} · {gymClass.difficulty}</Text></View>
          <Pill tone={full ? 'warning' : 'success'}>{full ? 'Lotada' : `${gymClass.capacity - gymClass.booked} vagas`}</Pill>
        </View>
        {active?.status === 'waitlisted' ? <View style={styles.statusBlock}><Pill tone="warning">Lista de espera #{active.waitlistPosition}</Pill><Text style={s.muted}>A tua posição fica associada a esta reserva até existir uma vaga ou cancelares.</Text></View> : null}
        {active?.status === 'confirmed' ? <View style={styles.statusBlock}><Pill tone="success">Reserva confirmada</Pill><Text style={s.muted}>A tua vaga está registada.</Text></View> : null}
        <View style={{ height: 12 }} />
        {active ? <SecondaryButton label="Cancelar" onPress={() => cancelReservation(gymClass.id)} /> : <PrimaryButton label={full ? `Entrar na lista · #${gymClass.waitlist + 1}` : 'Reservar aula'} onPress={() => reserveClass(gymClass.id)} />}
      </Card>;
    })}

    <SectionHeader title="Personal trainers" />
    {trainers.map(trainer => {
      const booking = ptBookings.find(item => item.trainerId === trainer.id && item.status === 'confirmed');
      return <Card key={trainer.id} style={{ marginBottom: 10 }}>
        <View style={s.row}><View style={styles.trainerAvatar}><Ionicons name="fitness" size={24} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>{trainer.name}</Text><Text style={s.muted}>{trainer.experience} · {trainer.languages.join(', ')}</Text></View></View>
        <Text style={styles.specialties}>{trainer.specialties.join(' · ')}</Text>
        <Text style={styles.nextSlot}>Próximo horário: {trainer.nextSlot}</Text>
        {booking ? <><Pill tone="success">Sessão confirmada · {booking.slot}</Pill><View style={{ height: 10 }} /><SecondaryButton label="Cancelar sessão" onPress={() => cancelPTBooking(booking.id)} /></> : <PrimaryButton label="Reservar sessão de PT" onPress={() => { bookTrainer(trainer.id, trainer.nextSlot); Alert.alert('Sessão confirmada', `${trainer.name} · ${trainer.nextSlot}`); }} />}
      </Card>;
    })}

    <SectionHeader title="As minhas reservas" />
    {reservations.filter(item => item.status !== 'cancelled').length === 0 && ptBookings.filter(item => item.status === 'confirmed').length === 0 ? <Card><EmptyState title="Sem reservas futuras" text="As aulas e sessões de PT confirmadas ficam reunidas aqui." /></Card> : <>
      {reservations.filter(item => item.status !== 'cancelled').map(item => {
        const gymClass = classes.find(gym => gym.id === item.classId);
        return <Card key={item.id} style={{ marginBottom: 10 }}><View style={s.between}><View><Text style={s.cardTitle}>{gymClass?.name ?? 'Aula'}</Text><Text style={s.muted}>{gymClass?.time} · {item.id}</Text></View><Pill tone={item.status === 'confirmed' ? 'success' : 'warning'}>{item.status === 'confirmed' ? 'Confirmada' : `Espera #${item.waitlistPosition}`}</Pill></View></Card>;
      })}
      {ptBookings.filter(item => item.status === 'confirmed').map(item => {
        const trainer = trainers.find(person => person.id === item.trainerId);
        return <Card key={item.id} style={{ marginBottom: 10 }}><View style={s.between}><View><Text style={s.cardTitle}>PT · {trainer?.name ?? 'Treinador'}</Text><Text style={s.muted}>{item.slot} · {item.id}</Text></View><Pill tone="success">Confirmada</Pill></View></Card>;
      })}
    </>}
  </Shell>;
}

const styles = StyleSheet.create({
  statusBlock: { marginTop: 12, gap: 4 },
  trainerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E7EFF7', alignItems: 'center', justifyContent: 'center' },
  specialties: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 14 },
  nextSlot: { color: colors.accent, fontSize: 13, fontWeight: '800', marginVertical: 12 },
});

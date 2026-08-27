import {
  ClassReservation,
  GymClass,
  LedgerItem,
  Member,
  PTBooking,
  Reward,
  RewardRedemption,
  SupportTicket,
  Visit,
  VisitReport,
  WorkoutSession,
} from '../domain';

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  member: Member;
};

export interface KissondeBackend {
  authenticate(memberId: string, password: string): Promise<AuthSession>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  getMember(): Promise<Member>;
  getVisits(): Promise<Visit[]>;
  reportVisit(description: string, visitId?: string): Promise<VisitReport>;
  getClasses(): Promise<GymClass[]>;
  reserveClass(classId: string): Promise<ClassReservation>;
  cancelClassReservation(reservationId: string): Promise<ClassReservation>;
  getWorkoutHistory(): Promise<WorkoutSession[]>;
  saveWorkout(session: WorkoutSession): Promise<WorkoutSession>;
  getRewards(): Promise<Reward[]>;
  redeemReward(rewardId: string): Promise<RewardRedemption>;
  getPointsLedger(): Promise<LedgerItem[]>;
  bookPT(trainerId: string, slotId: string): Promise<PTBooking>;
  cancelPT(bookingId: string): Promise<PTBooking>;
  createSupportTicket(category: string, description?: string): Promise<SupportTicket>;
  getSupportTickets(): Promise<SupportTicket[]>;
}

import React, { useEffect, useRef } from 'react';
import { useAppState } from './state';
import { useTrainingTimer } from './timer';

export function TimerAutoRestBridge() {
  const { hydrated: appHydrated, workoutSets } = useAppState();
  const { hydrated: timerHydrated, settings, startRest } = useTrainingTimer();
  const previousCount = useRef<number | null>(null);

  useEffect(() => {
    if (!appHydrated || !timerHydrated) return;
    if (previousCount.current === null) {
      previousCount.current = workoutSets.length;
      return;
    }
    if (workoutSets.length > previousCount.current && settings.autoRestAfterSet) {
      startRest(settings.defaultRestSeconds, 'Descanso após série');
    }
    previousCount.current = workoutSets.length;
  }, [appHydrated, timerHydrated, workoutSets.length, settings.autoRestAfterSet, settings.defaultRestSeconds, startRest]);

  return null;
}

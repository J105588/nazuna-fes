import React from 'react';
import type { TimetableEvent, StageLocation } from '../types/database';
import { TimetableSection } from '../components/timetable/TimetableSection';

interface TimetablePageProps {
  events: TimetableEvent[];
  initialStage?: StageLocation;
}

export const TimetablePage: React.FC<TimetablePageProps> = ({ events, initialStage = 'gym' }) => {
  return (
    <div className="animate-fade-in">
      <TimetableSection events={events} initialStage={initialStage} />
    </div>
  );
};

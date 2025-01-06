export type RecurringPattern = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TeamEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  end_date?: string;
  color: string;
  is_team_event: boolean;
  is_admin_only: boolean;
  is_multi_day: boolean;
  recurring_pattern: RecurringPattern;
  recurring_day_of_week?: number;
  created_by: string;
  created_at: string;
  isTeamEvent: boolean;
  isAdminEvent: boolean;
  isRecurring: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  meeting_type: string;
  completed: boolean;
  cancelled: boolean;
  created_at: string;
  user_id: string;
  lead_id: string;
  leads: { name: string };
  isTeamEvent: boolean;
  end_date?: string;
  is_multi_day?: boolean;
  due_date?: string;
}
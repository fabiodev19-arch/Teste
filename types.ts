
export enum MaintenanceStatus {
  COMPLETED = 'CONCLUÍDO',
  AWAITING_PARTS = 'AGUARDANDO PEÇA',
  YESTERDAY = 'ONTEM'
}

export interface MaintenanceLog {
  id: string;
  code: string;
  equipmentCode?: string;
  title: string;
  time: string;
  date?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  status: MaintenanceStatus;
  mechanic?: string;
  totalHours?: string;
  observations?: string;
  stopType?: string;
}

export interface Stats {
  pending: number;
  completed: number;
}

export type UserRole = 'ADMIN' | 'UNIVERSAL';

export interface User {
  username: string;
  role: UserRole;
}

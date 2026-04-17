export enum ProfessionalCategory {
  DOCTOR = 'Médico',
  NURSE = 'Enfermeiro',
  TECHNICIAN = 'Técnico de Enfermagem',
  DRIVER = 'Condutor',
  ADMIN = 'Administrativo'
}

export interface User {
  id: number;
  name: string;
  username?: string;
  email?: string;
  registration_number?: string;
  professional_category?: ProfessionalCategory;
  hourly_rate: number;
  must_change_password: number;
  is_admin: number;
  role_user?: 'ADM' | 'USER';
  lotacao_fisica: string;
}

export interface Extra {
  id: number;
  user_id: number;
  date: string;
  type: 'rural' | 'urban' | 'other';
  hours: number;
  observations: string;
  start_time: string;
  end_time: string;
  is_sent: number;
  reason: string;
  month: number;
  year: number;
}

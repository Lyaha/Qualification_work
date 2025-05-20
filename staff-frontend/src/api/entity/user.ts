export type UserRole = 'client' | 'warehouse_worker' | 'manager' | 'admin' | 'director';

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  auth0_id?: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
};

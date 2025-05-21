import { UserRole } from './user';

export type Warehouse = {
  id: string;
  name: string;
  location: string;
  working_hours?: string;
  manager_id?: string;
  manager?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    role: UserRole;
  };
  is_active: boolean;
};

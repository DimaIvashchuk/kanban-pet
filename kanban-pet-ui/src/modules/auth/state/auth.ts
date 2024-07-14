import { atom } from 'recoil';
import { Nullable } from '../../core/types/nullable';

export interface AuthState {
  id?: string;
  firstName?: string;
  lastName?: boolean;
  role?: string;
  isLogged?: boolean;
}

export const authState = atom({
  key: 'authState',
  default: null as Nullable<AuthState>,
});

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToasterContext } from './ToasterContext.tsx';
import type { LoginForm, RegisterForm, User } from '@/types/index.ts';

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  register: (formState: RegisterForm) => Promise<void>;
  login: (formState: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  isRefreshing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const navigate = useNavigate();

  const toasterContext = useContext(ToasterContext);
  const toaster = toasterContext?.toaster;

  const register = async (formState: RegisterForm) => {
    try {
      navigate('/books');
    } catch (error) {
      if (error instanceof Error) {
        toaster?.error(error.message);
      }
    }
  };

  const login = async (formState: LoginForm) => {
    try {
      navigate('/books');
    } catch (error) {
      if (error instanceof Error) {
        toaster?.error(error.message);
      }
    }
  };

  const logout = async () => {
    try {
      navigate('/');

      toaster?.success(`Bye`);
    } catch {
      toaster?.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        setIsRefreshing(false);
      } catch {
        navigate('/');
      }
    };
    if (isRefreshing) refresh();
  }, []);

  return (
    <AuthContext
      value={{ user, setUser, register, login, logout, isRefreshing }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;

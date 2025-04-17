
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fastfuel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Check if login credentials are valid
      if (email && password) {
        // Mock users for demo
        const mockUser: User = isAdmin 
          ? {
              id: 'admin1',
              name: 'Admin User',
              email: email,
              role: 'admin',
            }
          : {
              id: 'user1',
              name: 'Demo User',
              email: email,
              phone: '+91 9876543210',
              address: 'Koramangala, Bangalore',
              role: 'user',
            };
        
        setUser(mockUser);
        localStorage.setItem('fastfuel_user', JSON.stringify(mockUser));
        toast.success(`Welcome back, ${mockUser.name}!`);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      // Create a new user
      const newUser: User = {
        id: `user${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: 'user',
      };
      
      setUser(newUser);
      localStorage.setItem('fastfuel_user', JSON.stringify(newUser));
      toast.success(`Welcome to FastFuel, ${newUser.name}!`);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error; // Rethrow to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fastfuel_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('fastfuel_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

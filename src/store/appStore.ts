// store/appStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // Actions
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        user: null,
        theme: 'light',
        notifications: [],

        setUser: (user) => set((state) => {
          state.user = user;
        }),

        toggleTheme: () => set((state) => {
          state.theme = state.theme === 'light' ? 'dark' : 'light';
        }),

        addNotification: (notification) => set((state) => {
          state.notifications.push({
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date()
          });
        }),

        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),

        clearNotifications: () => set((state) => {
          state.notifications = [];
        })
      })),
      {
        name: 'app-storage',
        partialize: (state) => ({ theme: state.theme, user: state.user })
      }
    )
  )
);

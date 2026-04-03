"use client";

import { create } from 'zustand';

type AppMode = 'public' | 'admin' | 'partner';

interface AppModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

export const useAppMode = create<AppModeState>((set) => ({
  mode: 'public',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'public' ? 'admin' : 'public' 
  })),
}));

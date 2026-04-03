"use client";

import { create } from 'zustand';

interface BlogState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetSearch: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetSearch: () => set({ searchQuery: '' }),
}));

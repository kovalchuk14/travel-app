"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  setLoading: (value: boolean) => void;
  updateFavorites: (newFavorites: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
      setLoading: (value: boolean) => set({ loading: value }),
      updateFavorites: (newFavorites) => set((state) => ({
        user: state.user
          ? { ...state.user, favouriteArticles: newFavorites }
          :null,
      })),
    }),
    {
      name: "auth-store", // key in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these
    }
  )
);

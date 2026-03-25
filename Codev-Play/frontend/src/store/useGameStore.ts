import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

type GameState = {
  score: number;
  level: number;
  paused: boolean;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  increaseScore: (points: number) => void;
};

const localStorageStore: PersistStorage<GameState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      score: 0,
      level: 1,
      paused: false,

      startGame: () => set({ paused: false, score: 0, level: 1 }),
      pauseGame: () => set({ paused: true }),
      resetGame: () => set({ score: 0, level: 1, paused: false }),
      increaseScore: (points: number) => set((state) => ({ score: state.score + points })),
    }),
    {
      name: "game-storage",
      storage: localStorageStore,
    }
  )
);

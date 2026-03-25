import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  login: (userData) =>
    set(() => ({
      user: userData,
    })),

  logout: () =>
    set(() => ({
      user: null,
    })),
}));

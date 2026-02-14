import { apiFetch } from "@/lib/utils";

const base_url = "/api/tictactoe";

export const ticTacToeService = {
  createGame: async () => {
    const res = await apiFetch(`${base_url}/create`, {
      method: "POST",
      credentials: "include",
    });

    if (res.success) {
      console.log("Game created successfully");
    }

    return res;
  },

  fetchActiveGames: async () => {
    const res = await apiFetch(`${base_url}/active`, {
      method: "GET",
      credentials: "include",
    });

    if (res.success) {
      console.log("Games fetched successfully");
    }

    return res;
  },
};

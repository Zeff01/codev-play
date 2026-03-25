import { apiFetch } from "@/lib/utils";

const base_url = "/api/tictactoe";

export const ticTacToeService = {
  createGame: async () => {
    const res = await apiFetch(`${base_url}/create`, {
      method: "POST",
      credentials: "include",
    });

    return res;
  },
};

"use client";

import { apiFetch } from "@/lib/utils";
import { useState } from "react";

export function useApiFetch() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(endpoint, options);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Error in fetching data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
}

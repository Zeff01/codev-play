"use client";

import { apiFetch } from "@/lib/utils";
import { useState } from "react";

export function useApiFetch(endpoint: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(endpoint);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Error in fetching data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}

import { useState } from "react";

export function useApi(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function call(...args) {
    setLoading(true);
    setError(null);
    try {
      return await apiFn(...args);
    } catch (err) {
      setError(err.message || "Erro inesperado");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { call, loading, error };
}

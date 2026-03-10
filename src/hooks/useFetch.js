import { useCallback, useEffect, useState } from "react";

export default function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState(0);

  const refetch = useCallback(() => {
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const runRequest = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await fetcher(controller.signal);
        setData(result);
      } catch (requestError) {
        if (requestError.name !== "CanceledError" && requestError.name !== "AbortError") {
          setError(requestError.message || "Something went wrong while fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };

    runRequest();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, requestId]);

  return { data, error, loading, refetch };
}

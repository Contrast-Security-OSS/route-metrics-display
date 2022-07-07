import {useState, useCallback} from "react";

export const useFetch = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async ({url, query, applyData}) => {
      setLoading(true);
      try {
        const response = await fetch(
          url ||
            `http://localhost:3001/api?${
              query || `last=${Date.now()}&first=${Date.now() - 20000 * 60}`
            }`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          setError(response.status.toString());
        }
        const dataToSet = await response.json();
        applyData(dataToSet);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );
  return {
    error,
    loading,
    fetchData,
  };
};

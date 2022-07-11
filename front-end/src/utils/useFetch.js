import { useState, useCallback } from "react";

export const useFetch = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async ({ url, query, applyData, options }) => {
      setLoading(true);
      try {
        const environment = () => {
          return process.env.NODE_ENV == "development" ? process.env.REACT_APP_FETCH_LINK + url : url
        }
        const response = await fetch(
          `${environment()}?${query || "relStart=-100000"}`,
          options
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

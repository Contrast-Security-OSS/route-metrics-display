import {useState, useCallback} from "react";

export const useFetch = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const environment = useCallback((url) => {
    return process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_FETCH_LINK + url
      : url;
  }, []);

  const fetchData = useCallback(
    async ({url, query, applyData, options}) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${environment("/api/" + url)}?${query || ""}`,
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
    [setLoading, environment]
  );
  return {
    error,
    loading,
    fetchData,
  };
};

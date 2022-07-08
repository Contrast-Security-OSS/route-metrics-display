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
            `${process.env.REACT_APP_FETCH_LINK}/api/timeseries?${
              query || "relStart=-1000000"
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

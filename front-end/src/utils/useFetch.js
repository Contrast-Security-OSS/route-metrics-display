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
        // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        //   console.log('in development')
        // } else if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
        //   console.log('production');
        // }
        const environment = () => {
          return process.env.NODE_ENV == "development"
            ? process.env.REACT_APP_FETCH_LINK + "/api/" + url
            : "/api/" + url;
        };
        const response = await fetch(
          `${environment(url)}?${query || ""}`,
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

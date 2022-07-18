import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useFetch} from "../../utils/useFetch";
import {addData} from "../../redux/slices/dataSlice";
import ChartScreen from "./chart-screen";

const ChartsPage = () => {
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addData(data));
    };

    fetchData({
      url: "timeseries",
      applyData: applyData,
      query: "relStart=-1000000",
    });
  }, [dispatch, fetchData]);

  return (
    <div>
      <ChartScreen />
    </div>
  );
};

export default ChartsPage;

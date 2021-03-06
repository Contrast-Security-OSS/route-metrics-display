import React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import SaveButton from "../buttons/save-button";
import {StyledChartScreen, NoDataDiv} from "./chart-screen.styles";
import LineChart from "./line-chart";
import {addData} from "../../redux/slices/dataSlice";
import {useDispatch} from "react-redux";
import {useFetch} from "../../utils/useFetch";

const ChartScreen = () => {
  const chartData = useSelector((state) => state.data.timeseries);
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addData(data));
    };
    const interval = setInterval(() => {
      fetchData({
        query: `last=${Date.now()}&first=${Date.now() - 20000 * 60}`,
        applyData: applyData,
      });
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, chartData]);

  if (error) {
    return <h1>{error.toString()}</h1>;
  }
  if (chartData) {
    if (Object.keys(chartData).length !== 0) {
      const charts = Object.entries(chartData).map(([key, value]) => {
        return <LineChart key={key} chartTitle={key} chartData={value} />;
      });
      return <StyledChartScreen>{charts}</StyledChartScreen>;
    }
  }
  return (
    <NoDataDiv>
      <h1>No data yet!</h1>
      <SaveButton />
    </NoDataDiv>
  );
};

export default ChartScreen;

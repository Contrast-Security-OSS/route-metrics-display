import React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import SaveButton from "../buttons/save-button";
import {StyledChartScreen} from "./chart-screen.styles";
import LineChart from "./line-chart";
import {addData} from "../../redux/slices/dataSlice";
import {useDispatch} from "react-redux";

const ChartScreen = () => {
  const chartData = useSelector((state) => state.data.timeseries);
  const dispatch = useDispatch();
  useEffect(() => {
    //Get the last few minutes of requests (PLACEHOLDER IMPLEMENTATION)
    const interval = setInterval(() => {
      fetch(
        `http://localhost:3001/api?last=${Date.now()}&first=${Date.now() -
          20000 * 60}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(addData(data));
        })
        .catch((err) => console.log(err));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [chartData]);

  if (chartData) {
    if (Object.keys(chartData).length !== 0) {
      const charts = Object.entries(chartData).map((chart) => {
        return (
          <LineChart  chartTitle={chart[0]} chartData={chart[1]} />
        );
      });
      return <StyledChartScreen>{charts}</StyledChartScreen>;
    }
  }
  return (
    <StyledChartScreen>
      <div>
        <h1>No data yet!</h1>
        <SaveButton />
      </div>
    </StyledChartScreen>
  );
};

export default ChartScreen;

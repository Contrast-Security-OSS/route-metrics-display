import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { ChartDiv } from "./line-chart.styles";
import SaveButton from "../buttons/save-button";

const LineChart = ({ chartTitle, chartData }) => {
  return (
    <ChartDiv>
      <Line
        data={{
          labels: [
            "Red",
            "Blue",
            "Yellow",
            "Green",
            "Purple",
            "Orange",
          ],
          datasets: [
            {
              label: `${chartTitle} data`,
              data: ["32", 91, 3, 5, 2, 3],
              backgroundColor: ["#BAD4C6ff"],
              borderColor: ["#2C4244ff", "#2D8840ff;"],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: `${chartTitle}`,
            },
          },
        }}
        
      />
      <SaveButton />
    </ChartDiv>
  );
};

export default LineChart;

import React from 'react';
import {useSelector} from 'react-redux';

import {NoDataDiv, StyledChartScreen} from './chart-screen.styles';

import LineChart from './line-chart';

const StaticChartScreen = () => {
  const staticChartData = useSelector((state) => state.currentFile);

  if (Object.keys(staticChartData).length !== 0) {
    const chartData = Object.values(staticChartData)[1];
    const charts = Object.entries(chartData).map(([key, value]) => {
      return <LineChart key={key} chartTitle={key} chartData={value} />;
    });
    return (
      <div>
        <StyledChartScreen>{charts}</StyledChartScreen>
      </div>
    );
  }

  return <NoDataDiv>No Data yet</NoDataDiv>;
};

export default StaticChartScreen;

import React from 'react';
import {useSelector} from 'react-redux';

import {NoDataDiv, StyledChartScreen} from './chart-screen.styles';

import LineChart from './line-chart';

const StaticChartScreen = () => {
  const currentFileData = useSelector((state) => state.currentFile);
  console.log(currentFileData);

  if (Object.keys(currentFileData).length !== 0) {
    return (
      <div>
        <h1>{currentFileData.name}</h1>
        <StyledChartScreen></StyledChartScreen>
      </div>
    );
  }

  return <NoDataDiv>No Data yet</NoDataDiv>;
};

export default StaticChartScreen;

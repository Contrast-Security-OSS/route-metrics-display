import React, {useState} from 'react';
import 'chart.js/auto';
import {Line} from 'react-chartjs-2';
import {ChartDiv, MainDiv, ToggleButtons} from './line-chart.styles';
import SaveButton from '../../components/buttons/save-button';

const LineChart = React.memo(({chartTitle, chartData}) => {
  const [show, setShow] = useState(true);

  let datasets = [];
  let labels = chartData.map((dataObj) => Math.floor(dataObj.ts));

  switch (chartTitle) {
    case 'cpu':
      if (chartData && chartData.length) {
        const userData = chartData.map((dataObj) => dataObj.user);
        const systemData = chartData.map((dataObj) => dataObj.system);
        datasets.push(
          {
            label: `user`,
            data: userData,
            backgroundColor: ['#BAD4C6ff'],
            borderColor: ['#2C4244ff', '#2D8840ff;'],
            borderWidth: 1,
          },
          {
            label: `system`,
            data: systemData,
            backgroundColor: ['#72524a'],
            borderColor: ['#ebcfc9', '#2D8840ff;'],
            borderWidth: 1,
          }
        );
      } else {
        return <h1>No data for {chartTitle}</h1>;
      }
      break;
    case 'eventloop':
      if (chartData && chartData.length) {
        const eventloopLabels = Object.keys(chartData[0]).filter(
          (key) => !isNaN(key)
        );
        const eventloopDatasets = eventloopLabels.map((label) =>
          chartData.map((obj) => obj[label])
        );
        datasets = eventloopLabels.map((label, index) => {
          //Random colors are a temporary solution
          let randomColor;
          if (randomColor !== null) {
            randomColor = Math.floor(Math.random() * 16777215).toString(16);
          }
          return {
            label: label,
            data: eventloopDatasets[index],
            backgroundColor: ['#' + randomColor],
            borderColor: ['#' + randomColor, '#' + randomColor],
            borderWidth: 1,
          };
        });
      } else {
        return <h1>No data for {chartTitle}</h1>;
      }
      break;
    case 'memory':
      if (chartData && chartData.length) {
        const firstDataSet = chartData.map((dataObj) => dataObj['externalAvg']);
        const secondDataSet = chartData.map(
          (dataObj) => dataObj['heapUsedAvg']
        );
        datasets.push(
          {
            label: `externalAvg`,
            data: firstDataSet,
            backgroundColor: ['#BAD4C6ff'],
            borderColor: ['#2C4244ff', '#2D8840ff;'],
            borderWidth: 1,
          },
          {
            label: `heapUsedAvg`,
            data: secondDataSet,
            backgroundColor: ['#72524a'],
            borderColor: ['#ebcfc9', '#2D8840ff;'],
            borderWidth: 1,
          }
        );
      } else {
        return <h1>No data for {chartTitle}</h1>;
      }
      break;
    default:
      break;
  }

  return (
    <MainDiv>
      <div>
        <ToggleButtons onClick={() => setShow(true)}>+</ToggleButtons>
        <ToggleButtons onClick={() => setShow(false)}>-</ToggleButtons>
      </div>
      {show && (
        <ChartDiv>
          <Line
            data={{
              labels: labels,
              datasets: datasets,
            }}
            options={{
              animation: false,
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
      )}
    </MainDiv>
  );
});

export default React.memo(LineChart);

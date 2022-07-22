import React from 'react';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import SaveButton from '../../components/buttons/save-button';
import {StyledChartScreen, NoDataDiv} from './chart-screen.styles';
import LineChart from './line-chart';
import {addLiveData} from '../../redux/slices/liveDataSlice';
import {useDispatch} from 'react-redux';
import {useFetch} from '../../utils/useFetch';

const LiveChartScreen = () => {
  const liveChartData = useSelector((state) => state.liveData.timeseries);
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addLiveData(data));
    };
    const interval = setInterval(() => {
      fetchData({
        url: 'timeseries',
        applyData: applyData,
        query: 'relStart=-1000000',
      });
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, liveChartData, fetchData]);

  if (error) {
    return <h1>{error.toString()}</h1>;
  }
  if (liveChartData) {
    if (Object.keys(liveChartData).length !== 0) {
      const charts = Object.entries(liveChartData).map(([key, value]) => {
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

export default LiveChartScreen;

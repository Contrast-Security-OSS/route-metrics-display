import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useFetch} from '../../utils/useFetch';
import {addLiveData} from '../../redux/slices/liveDataSlice';
import LiveChartScreen from './live-chart-screen';
import StaticChartScreen from './static-chart-screen';

const ChartsPage = ({type}) => {
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    if (type === 'liveFile') {
      const applyData = (data) => {
        dispatch(addLiveData(data));
      };

      fetchData({
        url: 'timeseries',
        applyData: applyData,
        query: 'relStart=-1000000',
      });
    }
  }, [dispatch, fetchData]);

  return (
    <div>
      {type === 'liveFile' && <LiveChartScreen />}
      {type === 'staticFile' && <StaticChartScreen />}
    </div>
  );
};

export default ChartsPage;

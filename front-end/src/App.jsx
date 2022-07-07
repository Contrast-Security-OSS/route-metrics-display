import React, {useEffect} from "react";

import ChartScreen from "./screens/charts-page/chart-screen";
import UploadForm from "./screens/uploads-page/upload-screen";
import {useDispatch} from "react-redux";
import {addData} from "./redux/slices/dataSlice";
import {useFetch} from "./utils/useFetch";

const App = () => {
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addData(data));
    };

    fetchData({
      applyData: applyData,
    });
  }, [dispatch, fetchData]);

  return (
    <div>
      <UploadForm />
      <ChartScreen />
    </div>
  );
};

export default App;

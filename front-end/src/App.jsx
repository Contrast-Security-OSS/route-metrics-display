import React, {useEffect} from "react";

import ChartScreen from "./components/charts/chart-screen";
import UploadForm from "./components/uploads-page/upload-screen";
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
  }, []);

  return (
    <div>
      <UploadForm />
      <ChartScreen />
    </div>
  );
};

export default App;

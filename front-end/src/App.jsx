import React, {useEffect} from "react";

import ChartScreen from "./screens/charts-page/chart-screen";
import UploadForm from "./screens/uploads-page/upload-screen";
import {useDispatch} from "react-redux";
import {addData} from "./redux/slices/dataSlice";
import {useFetch} from "./utils/useFetch";
import FilesListPage from "./screens/files-list-page/files-list-page";

const App = () => {
  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addData(data));
    };

    fetchData({
      url: "timeseries",
      applyData: applyData,
      query: "relStart=-1000000",
    });
  }, [dispatch, fetchData]);

  return (
    <div>
      <FilesListPage />
      <UploadForm />
      <ChartScreen />
    </div>
  );
};

export default App;

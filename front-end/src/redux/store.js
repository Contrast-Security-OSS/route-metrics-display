import {configureStore} from "@reduxjs/toolkit";
import dataSlice from "./slices/dataSlice";
import filesListSlice from "./slices/filesListSlice";

export default configureStore({
  reducer: {
    files: filesListSlice,
    data: dataSlice,
  },
});

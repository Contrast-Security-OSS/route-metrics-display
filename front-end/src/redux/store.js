import {configureStore} from '@reduxjs/toolkit';
import liveDataSlice from './slices/liveDataSlice';
import filesListSlice from './slices/filesListSlice';
import currentFileSlice from './slices/currentFileSlice';

export default configureStore({
  reducer: {
    files: filesListSlice,
    liveData: liveDataSlice,
    currentFile: currentFileSlice,
  },
});

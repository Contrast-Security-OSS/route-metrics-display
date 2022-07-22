import {createSlice} from '@reduxjs/toolkit';

const initialState = {};

const liveDataSlice = createSlice({
  name: 'liveDataSlice',
  initialState,
  reducers: {
    addLiveData: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const {addLiveData} = liveDataSlice.actions;

export default liveDataSlice.reducer;

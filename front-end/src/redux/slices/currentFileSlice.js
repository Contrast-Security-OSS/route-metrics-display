import {createSlice} from '@reduxjs/toolkit';

const initialState = {};

const currentFileSlice = createSlice({
  name: 'currentFileSlice',
  initialState,
  reducers: {
    watchFile: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const {watchFile} = currentFileSlice.actions;

export default currentFileSlice.reducer;

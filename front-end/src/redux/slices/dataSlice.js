import {createSlice} from "@reduxjs/toolkit";

const initialState = {};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    addData: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const {addData} = dataSlice.actions;

export default dataSlice.reducer;

import {createSlice} from "@reduxjs/toolkit";

const initialState = {};

const filesListSlice = createSlice({
  name: "filesList",
  initialState,
  reducers: {
    addFiles: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const {addFiles} = filesListSlice.actions;

export default filesListSlice.reducer;

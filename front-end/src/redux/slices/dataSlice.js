import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  works: 'no'
}

const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,
  reducers: {
    addData: (state, action) => {
      console.log(action.payload);
      state.works = action.payload
    }
  }
});

export const { addData } = dataSlice.actions

export default dataSlice.reducer
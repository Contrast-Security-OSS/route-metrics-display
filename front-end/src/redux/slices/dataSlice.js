import {createSlice} from "@reduxjs/toolkit";

const initialState = {};

const dataSlice = createSlice({
	name: "dataSlice",
	initialState,
	reducers: {
		addData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const {addData} = dataSlice.actions;

export default dataSlice.reducer;

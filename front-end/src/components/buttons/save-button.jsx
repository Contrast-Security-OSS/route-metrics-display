import React from "react";
import {StyledButton} from "./save-button.styled";
import {addData} from "../../redux/slices/dataSlice";
import {useDispatch} from "react-redux";

const SaveButton = () => {
	const dispatch = useDispatch();

	const fetchData = () => {
		fetch(
			`http://localhost:3001/api?last=${Date.now()}&first=${Date.now() -
				100000000000}`,
			{
				method: "GET",
			}
		)
			.then((res) => res.json())
			.then((data) => {
				dispatch(addData(data.timeseries));
			})
			.catch((err) => console.log(err));
	};
	return <StyledButton onClick={fetchData}>Save snapshot</StyledButton>;
};

export default SaveButton;

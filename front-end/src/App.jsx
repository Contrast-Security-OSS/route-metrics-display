import React, {useEffect} from "react";

import ChartScreen from "./components/charts/chart-screen";
import {useDispatch} from "react-redux";
import {addData} from "./redux/slices/dataSlice";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		fetch(
			`http://localhost:3001/api?last=${Date.now()}&first=${Date.now() -
				20000 * 60}`,
			{
				method: "GET",
			}
		)
			.then((res) => res.json())
			.then((data) => {
				dispatch(addData(data));
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div>
			<ChartScreen />
		</div>
	);
};

export default App;

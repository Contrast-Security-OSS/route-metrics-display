import React, {useEffect} from "react";

import ChartScreen from "./components/charts/chart-screen";
import {useDispatch} from "react-redux";
import {addData} from "./redux/slices/dataSlice";
import {useFetch} from "./utils/useFetch";

const App = () => {
	const dispatch = useDispatch();
	const {error, loading, fetchData} = useFetch();

	useEffect(() => {
		const applyData = (data) => {
			dispatch(addData(data));
		};

		fetchData({
			query: `timeseries=cpu&last=${Date.now()}&first=${Date.now() -
				20000 * 60}`,
			applyData: applyData,
		});
	}, []);

	return (
		<div>
			<ChartScreen />
		</div>
	);
};

export default App;

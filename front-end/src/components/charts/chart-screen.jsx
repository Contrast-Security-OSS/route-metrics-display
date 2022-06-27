import React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {StyledChartScreen} from "./chart-screen.styles";
import LineChart from "./line-chart";

const ChartScreen = () => {
	const data = useSelector((state) => state.data);
	useEffect(() => {
		const interval = setInterval(() => {
			console.log(data);
		}, 10000);
		return () => {
			clearInterval(interval);
		};
	}, [data]);

	return (
		<StyledChartScreen>
			<LineChart chartTitle={"CPU"} />
			<LineChart chartTitle={"Memory"} />
			<LineChart chartTitle={"User"} />
			<LineChart chartTitle={"Chart"} />
		</StyledChartScreen>
	);
};

export default ChartScreen;

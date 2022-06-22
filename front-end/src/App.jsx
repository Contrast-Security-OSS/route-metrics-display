import React from "react";
import { AppStyled } from "./app.styles";
import LineChart from "./components/line-chart";


const App = () => {
	return (
		<AppStyled>
			<LineChart />
			<LineChart/>
			<LineChart/>
			<LineChart/>
		</AppStyled>
	);
};

export default App;


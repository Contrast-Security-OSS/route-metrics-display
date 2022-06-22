import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { ChartDiv } from "./line-chart.styles";
import SaveButton from "./buttons/save-button";



const LineChart = () => {
	return (
		<ChartDiv>
			
			<Line
				data={{
					labels: [
						"Red",
						"Blue",
						"Yellow",
						"Green",
						"Purple",
						"Orange",
					],
					datasets: [
						{
							label: "# of Votes",
							data: [12, 91, 3, 5, 2, 3],
							backgroundColor: [
								"rgba(255, 99, 132, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(255, 206, 86, 0.2)",
								"rgba(75, 192, 192, 0.2)",
								"rgba(153, 102, 255, 0.2)",
								"rgba(255, 159, 64, 0.2)",
							],
							borderColor: [
								"rgba(255, 99, 132, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(255, 206, 86, 1)",
								"rgba(75, 192, 192, 1)",
								"rgba(153, 102, 255, 1)",
								"rgba(255, 159, 64, 1)",
							],
							borderWidth: 1,
						},
						{
							label: "# of Votes",
							data: [10, 2, 5, 1, 7, 4],
							backgroundColor: [
								"rgba(255, 99, 132, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(255, 206, 86, 0.2)",
								"rgba(75, 192, 192, 0.2)",
								"rgba(153, 102, 255, 0.2)",
								"rgba(255, 159, 64, 0.2)",
							],
							borderColor: [
								"rgba(255, 99, 132, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(255, 206, 86, 1)",
								"rgba(75, 192, 192, 1)",
								"rgba(153, 102, 255, 1)",
								"rgba(255, 159, 64, 1)",
							],
							borderWidth: 1,
						},
					],
				}}
				options={{
					plugins: {
						title: {
							display: true,
							text: "Chart.js Line Chart",
						},
					},
				}}
			/>
			<SaveButton/>
		</ChartDiv>
		
	);
};

export default LineChart;

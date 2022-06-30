import React, {useEffect} from "react";
import "chart.js/auto";
import {Line} from "react-chartjs-2";
import {ChartDiv} from "./line-chart.styles";
import SaveButton from "../buttons/save-button";

const LineChart = ({chartTitle, chartData}) => {
	let data = [];
	let labels = [];
	if (chartTitle === "cpu") {
		const userData = chartData.map((dataObj) => dataObj.user);
		const systemData = chartData.map((dataObj) => dataObj.system);
		labels = chartData.map((dataObj) => Math.floor(dataObj.delta));
		data.push(
			{
				label: `user`,
				data: userData,
				backgroundColor: ["#BAD4C6ff"],
				borderColor: ["#2C4244ff", "#2D8840ff;"],
				borderWidth: 1,
			},
			{
				label: `system`,
				data: systemData,
				backgroundColor: ["#72524a"],
				borderColor: ["#ebcfc9", "#2D8840ff;"],
				borderWidth: 1,
			}
		);
	}
	if (chartTitle === "eventloop") {
		labels = chartData.map((dataObj) => Math.floor(dataObj.delta));
		const firstDataSet = chartData.map((dataObj) => dataObj["50"]);
		const secondDataSet = chartData.map((dataObj) => dataObj["75"]);
		const thirdDataSet = chartData.map((dataObj) => dataObj["90"]);
		const fourthDataSet = chartData.map((dataObj) => dataObj["95"]);
		const fifthDataSet = chartData.map((dataObj) => dataObj["99"]);
		data.push(
			{
				label: `50`,
				data: firstDataSet,
				backgroundColor: ["#BAD4C6ff"],
				borderColor: ["#2C4244ff", "#2D8840ff;"],
				borderWidth: 1,
			},
			{
				label: `75`,
				data: secondDataSet,
				backgroundColor: ["#72524a"],
				borderColor: ["#ebcfc9", "#2D8840ff;"],
				borderWidth: 1,
			},
			{
				label: `90`,
				data: thirdDataSet,
				backgroundColor: ["#ffffff"],
				borderColor: ["#66bbe2", "#9578e4;"],
				borderWidth: 1,
			},
			{
				label: `95`,
				data: fourthDataSet,
				backgroundColor: ["#dffabd"],
				borderColor: ["#a2f88d", "#ecf1e9;"],
				borderWidth: 1,
			},
			{
				label: `99`,
				data: fifthDataSet,
				backgroundColor: ["#d64825"],
				borderColor: ["#b471a0", "#ffa8a8;"],
				borderWidth: 1,
			}
		);
	}
	if (chartTitle === "memory") {
		labels = chartData.map((dataObj) => Math.floor(dataObj.delta));
		const firstDataSet = chartData.map((dataObj) => dataObj["externalAvg"]);
		const secondDataSet = chartData.map(
			(dataObj) => dataObj["heapUsedAvg"]
		);
		data.push(
			{
				label: `externalAvg`,
				data: firstDataSet,
				backgroundColor: ["#BAD4C6ff"],
				borderColor: ["#2C4244ff", "#2D8840ff;"],
				borderWidth: 1,
			},
			{
				label: `heapUsedAvg`,
				data: secondDataSet,
				backgroundColor: ["#72524a"],
				borderColor: ["#ebcfc9", "#2D8840ff;"],
				borderWidth: 1,
			}
		);
	}

	return (
		<ChartDiv>
			<Line
				data={{
					labels: labels,
					datasets: data,
				}}
				options={{
					plugins: {
						title: {
							display: true,
							text: `${chartTitle}`,
						},
					},
					downsample: {
						enabled: true,
						threshold: 100, // max number of points to display per dataset
					},
				}}
			/>
			<SaveButton />
		</ChartDiv>
	);
};

export default LineChart;

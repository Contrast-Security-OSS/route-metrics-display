import React from 'react'
import { StyledChartScreen } from './chart-screen.styles'
import LineChart from './line-chart'

const ChartScreen = () => {
	return (
		<StyledChartScreen>
			<LineChart chartTitle={'CPU'}/>
			<LineChart chartTitle={'Memory'}/>
			<LineChart chartTitle={'User'}/>
			<LineChart chartTitle={'Chart'}/>
		</StyledChartScreen>
	)
}

export default ChartScreen
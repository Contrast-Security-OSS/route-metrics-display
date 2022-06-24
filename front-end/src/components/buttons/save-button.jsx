import React from 'react'
import { StyledButton } from './save-button.styled'


const SaveButton = () => {
	const fetchData = () => {
		fetch('http://localhost:3001/api', {
			method:'GET',
		}).then(res => res.json()).then(data=>console.log(data)).catch(err =>console.log(err))
	}
	return (
			<StyledButton onClick={fetchData}>Save snapshot</StyledButton>
	)
}

export default SaveButton
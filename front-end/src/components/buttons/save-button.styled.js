import styled from 'styled-components'

export const StyledButton = styled.button`
	background-color: #2C4244ff;
	color: #F2F2F2;
	border: none;
	box-sizing: border-box;
	padding: 0.5em;
	border-radius: 5px;
	font-size: 16px;
	transition: 0.3s ease-in-out;
	outline: 1px solid #2C4244ff;
	
	&:hover {
		background-color: #F2F2F2;
		color: #193440;
		box-shadow: 0px 10px 14px -7px #2C4244ff;
		cursor: pointer;
	}
	`
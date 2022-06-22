import styled from 'styled-components'

export const StyledButton = styled.button`
	background-color: #193440;
	color: #F2F2F2;
	border: none;
	box-sizing: border-box;
	height: 50px;
	width: 100px;
	border-radius: 5px;
	font-size: 20px;
	transition: 0.3s ease-in-out;
	outline: 1px solid #193440;
	
	&:hover {
		background-color: #F2F2F2;
		color: #193440;
		box-shadow: 0px 10px 14px -7px #193440;
	}
	`
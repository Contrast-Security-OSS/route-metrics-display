import styled from 'styled-components'

// $white: #f2f2f2;
// $opal: #BAD4C6ff;
// $outer-space-crayola: #2C4244ff;
// $spanish-green: #2D8840ff;
// $white-2: #FFFFFFff;



export const AppStyled = styled.div`
background-color: #F2F2F2;
margin: 0;
padding: 0;
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: repeat(2, 1fr);
grid-column-gap: 5px;
grid-row-gap: 10px;
margin: 0 auto;
@media (max-width: 1300px) {
		margin: 0 auto;
    display: flex;
		align-items: center;
		flex-direction: column;
  }
`
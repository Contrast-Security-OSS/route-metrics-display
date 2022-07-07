import styled from "styled-components";

export const StyledChartScreen = styled.div`
  margin: 0 auto;
  background-color: #f2f2f2;
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
`;

export const NoDataDiv = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

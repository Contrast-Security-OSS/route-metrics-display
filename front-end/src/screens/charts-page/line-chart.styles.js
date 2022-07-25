import styled from 'styled-components';

export const ChartDiv = styled.div`
  width: 40vw;
  margin: 0 auto;
  @media (max-width: 1300px) {
    width: 80vw;
  }
`;
export const MainDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const ToggleButtons = styled.button`
  background-color: lightgray;
  margin-left: 10px;
  position: relative;
  height: 30px;
  width: 30px;
  border: none;
  font-size: 24px;
  :hover {
    cursor: pointer;
  }
`;

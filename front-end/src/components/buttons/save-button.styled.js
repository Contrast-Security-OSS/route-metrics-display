import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: #2c4244;
  color: #f2f2f2;
  border: none;
  box-sizing: border-box;
  padding: 0.5em;
  border-radius: 5px;
  font-size: 16px;
  transition: 0.3s ease-in-out;
  outline: 1px solid #2c4244ff;
  max-width: fit-content;
  &:hover {
    background-color: #f2f2f2;
    color: #193440;
    box-shadow: 0px 10px 14px -7px #2c4244ff;
    cursor: pointer;
  }
`;

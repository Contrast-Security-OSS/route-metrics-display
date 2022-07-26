import styled from "styled-components";

export const StyledFile = styled.li`
  list-style: none;

  > button {
    transition: 0.2s ease-in-out;
    cursor: pointer;
    border: none;
		
    box-sizing: border-box;
    padding: 1em;
    &:hover {
      background-color: #ebcfc9;
    }
  }
`;

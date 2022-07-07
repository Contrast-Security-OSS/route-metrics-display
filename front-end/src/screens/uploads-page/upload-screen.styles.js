import styled from "styled-components";

export const FormDiv = styled.div`
  margin: 0 auto;
  margin-top: 1%;
  margin-bottom: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  width: 33%;
  > form {
    display: flex;
    flex-direction: column;
    
  }
  > form > button {
    margin-top: 5px;
    background-color: #5db394;
    border-radius: 7px;
    border: 1px solid #336136;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 17px;
    padding: 16px 31px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #2f6627;
    :hover {
      background-color: #36665c;
    }
  }
`;

import styled from 'styled-components';

export const StyledNav = styled.nav`
	border-bottom: 1px solid #0a004f;
  box-shadow: 1px 4px 5px -4px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 1px 4px 5px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 1px 4px 5px -4px rgba(0, 0, 0, 0.75);
  height: 45px;
  border-radius: 0px;
	background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
  margin-bottom: 5%;
	z-index: 1000;

  > ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    > li {
      list-style: none;
      display: flex;
      height: 45px;
      width: fit-content;
      align-items: center;
      > div {
        box-sizing: border-box;
        padding-top: 1%;
        padding-left: 5%;
        width: auto;
        height: auto;
      }
      > a {
        padding: 0 14px;
        text-decoration: none;
        font-size: 16px;
        color: #0a004f;
      }
    }
  }

  > ul > li > a:hover {
    color: #004f45;
  }
`;

import styled from 'styled-components';

export const StyledNav = styled.nav`
  background: #497560;
  color: #fff;
  height: 45px;
  border-radius: 0px;
  position: fixed;
  width: 100%;
  top: 0;
  margin-bottom: 5%;

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
        width: auto;
        height: auto;
      }
      > a {
        padding: 0 14px;
        text-decoration: none;
        font-size: 16px;
        color: #f2f2f2;
      }
    }
  }

  > ul > li > a:hover {
    color: #f2f2f2;
  }
`;

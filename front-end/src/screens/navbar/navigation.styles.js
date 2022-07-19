import styled from "styled-components";

export const StyledNav = styled.nav`
  background: #497560;
  color: #fff;
  height: 45px;
  padding-left: 18px;
  border-radius: 0px;
  position: fixed;
  width: 100%;
  top: 0;
  margin-bottom: 5%;

  > ul {
    width: 100%;
    > li {
      margin: 0 auto;
      padding: 0;
      list-style: none;
      float: left;

      > a {
        line-height: 45px;
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

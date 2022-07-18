import React from "react";
import {StyledNav} from "./navigation.styles";

const NavBar = () => {
  return (
    <StyledNav>
      <ul>
        <li>
          <a href="/live">Live File</a>
        </li>
        <li>
          <a href="/upload-files">Upload a file</a>
        </li>
      </ul>
    </StyledNav>
  );
};

export default NavBar;

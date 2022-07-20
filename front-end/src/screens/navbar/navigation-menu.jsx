import React from "react";
import {Link, NavLink} from "react-router-dom";
import {StyledNav} from "./navigation.styles";

const NavBar = () => {
  let activeStyle = {
    textDecoration: "underline",
  };

  let activeClassName = "underline";

  return (
    <StyledNav>
      <ul>
        <li>
          <NavLink
            to="/live"
            style={({isActive}) => (isActive ? activeStyle : undefined)}
          >
            Live File
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/upload-files"
            style={({isActive}) => (isActive ? activeStyle : undefined)}
          >
            Upload a file
          </NavLink>
        </li>
      </ul>
    </StyledNav>
  );
};

export default NavBar;

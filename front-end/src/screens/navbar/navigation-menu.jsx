import React from 'react';
import {NavLink} from 'react-router-dom';
import {StyledNav} from './navigation.styles';

const NavBar = () => {
  return (
    <StyledNav>
      <ul>
        <li>
          <NavLink to='/live'>Live File</NavLink>
        </li>
        <li>
          <NavLink to='/upload-files'>Upload a file</NavLink>
        </li>
      </ul>
    </StyledNav>
  );
};

export default NavBar;

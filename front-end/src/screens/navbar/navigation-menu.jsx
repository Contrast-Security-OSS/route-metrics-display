import React from 'react';
import {NavLink} from 'react-router-dom';
import {StyledNav} from './navigation.styles';

import {ReactComponent as YourSvg} from '../../images/image.svg';

const NavBar = () => {
  return (
    <StyledNav>
      <ul>
        <li>
          <div>
            <YourSvg
              height="100%"
              viewBox='0 0 372 60'
              
            />
          </div>
        </li>
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

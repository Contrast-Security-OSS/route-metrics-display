import React from 'react';
import {useDispatch} from 'react-redux';
import {watchFile} from '../../../redux/slices/currentFileSlice';

import {StyledFile} from './file.styles';

const File = ({data, name}) => {
  const dispatch = useDispatch();

  const watchCurrentFile = () => {
    dispatch(watchFile(data));
  };

  return (
    <StyledFile>
      <button onClick={watchCurrentFile}>{name}</button>
    </StyledFile>
  );
};

export default File;

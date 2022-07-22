import React from 'react';
import {useDispatch} from 'react-redux';
import FilesList from './components/files-list';
import {StyledPageDiv} from './files-list-page.styles';

const FilesListPage = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <StyledPageDiv>
        <FilesList />
      </StyledPageDiv>
    </div>
  );
};

export default React.memo(FilesListPage);

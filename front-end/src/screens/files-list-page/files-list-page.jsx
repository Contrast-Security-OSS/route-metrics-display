import React from 'react';
import FilesList from './components/files-list';
import {StyledPageDiv} from './files-list-page.styles';

const FilesListPage = () => {
  return (
    <div>
      <StyledPageDiv>
        <FilesList />
      </StyledPageDiv>
    </div>
  );
};

export default React.memo(FilesListPage);

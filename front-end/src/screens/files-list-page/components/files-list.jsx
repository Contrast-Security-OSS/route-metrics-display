import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import File from './file';

const FilesList = () => {
  const files = useSelector((state) => state.files);

  if (Object.keys(files).length !== 0) {
    const renderedFiles = Object.entries(files).map(([key, value], index) => {
      return <File key={index} data={{name: key, data: value}} name={key} />;
    });
    return <ul>{renderedFiles}</ul>;
  }

  return <h1>No files yet!</h1>;
};

export default React.memo(FilesList);

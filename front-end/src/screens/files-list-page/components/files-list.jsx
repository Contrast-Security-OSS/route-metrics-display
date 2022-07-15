
import React, {useState} from "react";
import {useSelector} from "react-redux";
import File from "./file";

const FilesList = () => {
  const [loading, setLoading] = useState(true);
  const files = useSelector((state) => state.files);

  const renderedFiles = files.map((data, index) => {
    return <File data={data} key={index} />;
  });
  return <ul>{renderedFiles}</ul>;
};

export default React.memo(FilesList);

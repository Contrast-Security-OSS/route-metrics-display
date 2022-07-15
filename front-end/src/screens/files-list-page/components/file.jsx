import React from "react";
import {useFetch} from "../../../utils/useFetch";
import {StyledFile} from "./file.styles";

const File = ({data}) => {
  const {error, loading, fetchData} = useFetch();

  const fetchTimeseries = () => {
    const applyData = (data) => {
      console.log(data);
    };
    fetchData({
      url: "watchfile",
      applyData: applyData,
      options: {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          filename: data.filename,
        }),
      },
    });
  };

  return (
    <StyledFile>
      <button onClick={fetchTimeseries}>{data.originalname}</button>
    </StyledFile>
  );
};

export default File;

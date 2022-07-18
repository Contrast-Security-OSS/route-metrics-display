import React from "react";
import {useDispatch} from "react-redux";
import {addData} from "../../../redux/slices/dataSlice";
import {useFetch} from "../../../utils/useFetch";
import {StyledFile} from "./file.styles";

const File = ({data}) => {
  const {error, loading, fetchData} = useFetch();
  const dispatch = useDispatch();

  const fetchTimeseries = () => {
    fetchData({
      url: "watchfile",
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

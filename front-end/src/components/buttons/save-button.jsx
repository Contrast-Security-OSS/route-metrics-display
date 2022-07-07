import React from "react";
import {StyledButton} from "./save-button.styled";
import {addData} from "../../redux/slices/dataSlice";
import {useDispatch} from "react-redux";

const SaveButton = () => {
  const dispatch = useDispatch();

  const fetchData = () => {
    fetch(`http://localhost:3001/api/logfiles`, {
      method: "GET",
    })
      .then((res) => console.log(res))

      .catch((err) => console.log(err));
  };
  return <StyledButton onClick={fetchData}>Save snapshot</StyledButton>;
};

export default SaveButton;

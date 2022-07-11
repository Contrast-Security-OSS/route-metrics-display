import React, { useState } from "react";
import { useFetch } from "../../utils/useFetch";
import { FormDiv } from "./upload-screen.styles";

const UploadForm = () => {
  const [files, setFiles] = useState("");
  const [filesArrayError, setFilesArrayError] = useState("");
  const { error, loading, fetchData } = useFetch();

  const uploadFileHandler = (e) => {
    setFiles([...e.target.files]);
  };

  const fileSubmitHandler = (e) => {
    e.preventDefault();
    if (files.length !== 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const checkFiles = (data) => {
        if (files.length !== data.files.length) {
        }
        fetchData({
          url: `${process.env.REACT_APP_FETCH_LINK}/api/logfiles`,
          applyData: checkFiles,
          options: {
            method: "POST",
            body: formData,
          },
        });
      };
    }
  };

  return (
    <FormDiv>
      <form onSubmit={fileSubmitHandler}>
        <h3>Upload log files!</h3>
        <div>
          <input type="file" multiple onChange={uploadFileHandler} />
          <span>{filesArrayError}</span>
        </div>
        <button type="submit">Upload</button>
      </form>
    </FormDiv>
  );
};
export default UploadForm;

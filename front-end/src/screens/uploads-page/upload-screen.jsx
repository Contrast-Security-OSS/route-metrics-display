import React, {useState} from "react";
import {FormDiv} from "./upload-screen.styles";

const UploadForm = () => {
  const [files, setFiles] = useState("");
  const [fileSize, setFileSize] = useState(true);

  const uploadFileHandler = (e) => {
    setFiles([...e.target.files]);
  };

  const fileSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      // if (files[i].size > 1024) {
      //   setFileSize(false);
      //   return;
      // }
      formData.append("file", files[i]);
    }
    fetch(`${process.env.REACT_APP_FETCH_LINK}/api/logfiles`, {
      method: "POST",
      body: formData,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <FormDiv>
      <form onSubmit={fileSubmitHandler}>
        <h3>Upload log files!</h3>
        <div>
          <input type="file" multiple onChange={uploadFileHandler} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </FormDiv>
  );
};
export default UploadForm;

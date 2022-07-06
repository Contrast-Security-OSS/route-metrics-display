import React, {useState} from "react";
import {FormDiv} from "./upload-screen.styles";

const UploadForm = () => {
  const [files, setFiles] = useState("");

  const uploadFileHandler = (e) => {
    console.log([...e.target.files]);
    setFiles(e.target.files);
  };

  const fileSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    files.map((file) => {
      console.log(file);
      formData.append("files", file);
    });
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

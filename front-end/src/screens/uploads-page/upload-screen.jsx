import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {addFiles} from "../../redux/slices/filesListSlice";
import {useFetch} from "../../utils/useFetch";
import {FormDiv} from "./upload-screen.styles";

const UploadForm = () => {
  const [files, setFiles] = useState("");
  const [filesArrayError, setFilesArrayError] = useState("");
  const {error, loading, fetchData} = useFetch();
  const dispatch = useDispatch();

  const uploadFileHandler = (e) => {
    setFiles([...e.target.files]);
    setFilesArrayError("");
  };

  const fileSubmitHandler = (e) => {
    e.preventDefault();
    if (files.length !== 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const checkFiles = (data) => {
        const rejectedFiles = data.files
          .filter((file) => !file.status.uploaded)
          .map((file) => file.originalname)
          .join();
        rejectedFiles.length > 0 &&
          setFilesArrayError(
            rejectedFiles + " were rejected for being invalid!"
          );
      };
      fetchData({
        url: "logfiles",
        applyData: checkFiles,
        options: {
          method: "POST",
          body: formData,
        },
      }).then(() => {
        const applyData = (data) => {
          dispatch(addFiles(data));
        };
        fetchData({
          url: "logfiles",
          applyData: applyData,
        });
      });
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

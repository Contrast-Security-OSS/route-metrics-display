import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addFiles} from "../../redux/slices/filesListSlice";
import {useFetch} from "../../utils/useFetch";
import FilesList from "./components/files-list";
import {StyledPageDiv} from "./files-list-page.styles";

const FilesListPage = () => {
  const [testLoading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const {error, loading, fetchData} = useFetch();

  useEffect(() => {
    const applyData = (data) => {
      dispatch(addFiles(data));
      setLoading(false);
    };
    fetchData({
      url: "logfiles",
      applyData: applyData,
    });
  }, []);

  if (testLoading) {
    return <StyledPageDiv>Loading...</StyledPageDiv>;
  }

  return (
    <div>
      {!testLoading && (
        <StyledPageDiv>
          <FilesList/>
        </StyledPageDiv>
      )}
    </div>
  );
};

export default React.memo(FilesListPage);

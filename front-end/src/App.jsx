import React from 'react';

import {HashRouter, Routes, Route} from 'react-router-dom';
import {ContentDiv} from './App.styles';
import ChartsPage from './screens/charts-page/charts-page';
import FilesListPage from './screens/files-list-page/files-list-page';
import NavBar from './screens/navbar/navigation-menu';
import UploadForm from './screens/uploads-page/upload-screen';

const App = () => {
  return (
    <div>
      <ContentDiv>
        <HashRouter>
          <NavBar />
          <Routes>
            <Route
              path='/live'
              element={
                <>
                  <ChartsPage type={'liveFile'} />
                </>
              }
            />
            <Route
              path='/upload-files'
              element={
                <>
                  <FilesListPage />
                  <UploadForm />
                  <ChartsPage type={'staticFile'} />
                </>
              }
            />
            <Route
              path='*'
              element={
                <main style={{padding: '1rem'}}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </HashRouter>
      </ContentDiv>
    </div>
  );
};

export default App;

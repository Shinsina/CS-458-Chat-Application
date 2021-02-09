import React from 'react';
//import AuthProvider from './components/AuthContext'
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import {Editor} from '@tinymce/tinymce-react';
function App() {
  return (
    <>
    <BrowserRouter>
    <Switch> 
    <p className="block xl:text-9xl lg:text-7xl md:text-4xl sm-text-3xl break-words text-center">TESTING</p>
    </Switch>
    </BrowserRouter>
    </>
  );
}

export default App;

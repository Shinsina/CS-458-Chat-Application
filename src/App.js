import React from 'react';
import AuthProvider from './components/AuthContext'
import LogInScreen from './components/LogInScreen'
import ChatView from './components/ChatView'
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import {Editor} from '@tinymce/tinymce-react';
function App() {
  return (
    <>
    <BrowserRouter>
    <AuthProvider>
    <Switch> 
    <Route exact path="/" component={LogInScreen}/>
    <Route exact path="/:chatId" component={ChatView}/>
    </Switch>
    </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;

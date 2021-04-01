import React from 'react';
import AuthProvider from './components/AuthContext'
import LogInScreen from './components/LogInScreen'
import ChatView from './components/ChatView'
import MainScreen from './components/MainScreen'
import ProfileScreenRenderer from './components/ProfileScreenRenderer'
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import BotView from './components/BotView'
import ContactScreen from './components/ContactScreen'
import ReactHtmlParser from 'react-html-parser';
import MapContainer from './components/Map'
import {Editor} from '@tinymce/tinymce-react';

function App() {
  return (
    <>
    <BrowserRouter>
    <AuthProvider>
    <Switch> 
    <Route exact path="/" component={LogInScreen}/>
    <Route exact path="/Chat/:userId/:chatId" component={ChatView}/>
    <Route exact path="/mainMenu" component={MainScreen}/>
    <Route exact path="/ProfileScreen/:userId" component={ProfileScreenRenderer}/>
    <Route exact path="/BotView" component={BotView}/>
    <Route exact path="/Contacts" component={ContactScreen}/>
    <Route exact path="/Map" component={MapContainer}/>
    </Switch>
    </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;

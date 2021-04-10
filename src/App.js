import React from 'react';
import AuthProvider from './components/AuthContext'
import LogInScreen from './components/LogInScreen'
import ChatView from './components/ChatView'
import MainScreen from './components/MainScreen'
import ProfileScreenRenderer from './components/ProfileScreenRenderer'
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import BotView from './components/BotView'
import ContactScreenWrapper from './components/ContactScreenWrapper'
import CurrentLocationMapFilter from './components/CurrentLocationMapFilter';
import ContactListMapWrapper from './components/ContactListMapWrapper';

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
    <Route exact path="/Contacts" component={ContactScreenWrapper}/>
    <Route exact path="/Map" component={ContactListMapWrapper}/>
    <Route exact path ="/CurrentLocation/:username/:lat/:lng" component={CurrentLocationMapFilter}/>
    </Switch>
    </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;

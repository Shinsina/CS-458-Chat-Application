import React from 'react'
import {AuthConsumer} from './AuthContext'

/**
 * This class is for the overall main menu screen, including naviagation, a chats section, and a stories section
 * @author Tanner Bakken
 */

//Gets the state that the login was successful
class MainScreen extends React.Component {
    displayNameInput = React.createRef();
    emailInput = React.createRef();
    passwordInput = React.createRef();

    state = {
        formToggle: true,
        imageFile: '',
        imageUrl: ''
    }

//Attempt to use the did mount featuer to fetch the chats automatically
    componentDidMount(){
        <AuthConsumer>
            {({fetchChats, userChats, goToChat}) => (
                <>
                    fetchChats();
                    
                    {Object.keys(userChats).map(key =>
                        <div key={key}>
                            <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(userChats[key])}>Go to Chat: {userChats[key]}</button>
                        </div>
                        )}
                </>

            )}
        </AuthConsumer>

    }

    /**
     * The render function ensures the following information is getting on screen
     */
    render() {
        
    return (
        <AuthConsumer>
            {/*Provides the needed information to use later on*/}
            {({signUp, logIn, user, authMessage, logOut, createChat, fetchChats, userChats, goToChat, chatBot, goToProfile, goToContacts}) => (
             <>
             {/*The stories section of the page, differentiated appearance*/}
             <div className='storyScreen bg-gray-300 h-32'>
             <div className="storyHeader flex flex-col h-32 w-full bg-gray-300 font-mono py-4">
                    <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Stories</p>
                    <span className="FormHeader text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> <p>"Create Story"</p>}>Create Story</button> </span>
                    </div>
                    </div>
                    {/*The main menu section*/}
                        <div className='mainScreen bg-gray-500 h-screen'>
                    <div className="mainScreenHeader flex flex-col h-1/3 w-full bg-gray-500 font-mono py-4">
                    <p className="block lg:text-9xl md:text-6xl sm-text-5xl break-words text-center">Main Menu</p>
                    
                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        {/*All of the buttons used for naviagtion*/}
                    <button className="border-black border-2 bg-yellow-500"  onClick={(e)=> createChat("N8kGtE5uqcgQVfHycKUuTuSU1uI3")}>New Chat</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> fetchChats()}>Get Chats</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> goToProfile()}>Settings</button> 
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> chatBot()}>Chat Bot</button> 
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> goToContacts()}>Contacts</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> logOut()}>Log Out</button>
                    </span>
                    {/*Possible section for the friends, and also the chats section*/}
                    <p className="block lg:text-4xl md:text-3xl sm-text-2xl break-words text-right">Friends List Here?</p>
                    <p className="block lg:text-2xl md:text-2xl sm-text-1xl break-words text-right">Each friend could have a create chat</p>
                    <p className="block lg:text-2xl md:text-2xl sm-text-1xl break-words text-right">could be able to search for new friends</p>
                    <p className="block lg:text-7xl md:text-4xl sm-text-3xl break-words text-left">Chats</p>
                    <br/>
                    <span className="FormHeader block text-left text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        {/*Gets chats if the get chats button is hit*/}
                    {Object.keys(userChats).map(key =>
                        <div key={key}>
                            <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(userChats[key])}>Go to Chat: {userChats[key]}</button>
                        </div>
                        )}
                        </span>
                    </div>
                    </div>
            </>
            )}
        </AuthConsumer>
    )
    }


}

export default MainScreen;
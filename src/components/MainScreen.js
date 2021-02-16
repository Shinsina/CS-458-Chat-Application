import React from 'react'
import {AuthConsumer} from './AuthContext'


class MainScreen extends React.Component {
    displayNameInput = React.createRef();
    emailInput = React.createRef();
    passwordInput = React.createRef();

    state = {
        formToggle: true,
        imageFile: '',
        imageUrl: ''
    }

    //componentDidMount(){
    //    (e) => fetchChats()
    //}


    
    render() {
        
    return (
        <AuthConsumer>
            {({signUp, logIn, user, authMessage, logOut, createChat, fetchChats, userChats, goToChat}) => (
             <>
             <div className='storyScreen bg-gray-300 h-48'>
             <div className="storyHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                    <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Stories</p>
                    <span className="FormHeader text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> <p>"Create Story"</p>}>Create Story</button> </span>
                    </div>
                    </div>
                    
                        <div className='mainScreen bg-gray-500 h-screen'>
                    <div className="mainScreenHeader flex flex-col h-1/3 w-full bg-gray-500 font-mono py-16">
                    <p className="block lg:text-9xl md:text-6xl sm-text-5xl break-words text-center">Main Menu</p>
                    </div>
                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        
                    <button className="border-black border-2 bg-yellow-500" onClick={(e)=> createChat("N8kGtE5uqcgQVfHycKUuTuSU1uI3")}>Create Chat</button>
                        {Object.keys({userChats}).map(key =>
                        <div key={key}>
                            <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat({userChats}[key])}>Go to Chat</button>
                        </div>
                        )}
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e) => fetchChats()}>Fetch Chats</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> "Profile Settings"}>Profile Settings</button> 
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> logOut()}>Log Out</button> </span>
                    <span text-center>Will update button appearance eventually, and get it to fetch the chats automatically</span>
                    </div>
            </>
            )}
        </AuthConsumer>
    )
    }


}

export default MainScreen;
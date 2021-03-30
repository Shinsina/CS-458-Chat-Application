import React from 'react'
import {AuthConsumer} from './AuthContext'
import {firebaseAuth, usersRef, chatsRef, storage} from '../firebase'
import ReactHtmlParser from 'react-html-parser'

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
        imageUrl: '',
        test: false,
        isImage:true,
        userImages: []
    }

//Attempt to use the did mount featuer to fetch the chats automatically
    componentDidMount(){
        

    }
    //Need HTML event make in auth context, define other variable
    //user info, and the storage ref option

    handleImage = (userInfo, e) => {
        console.log(userInfo.storyImages[0])
        //e.preventDefault()
        const image = e.target.files[0]
        //this.state.imageFile = image;
        this.setState({imageFile: image})

        //The else of the sign up goes here
        const uploadTask = storage.ref(`/images/${image.name}`).put(image)
            uploadTask.on('state_changed', 
            (snapShot) => {
                //console.log(snapShot)
            }, (err) => {
                //console.log(err)
            }, async () => {
                await storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseURL => {
                    this.setState({imageUrl:fireBaseURL})
                    //console.log(this.state.imageUrl)
                    //console.log(fireBaseURL)


                    //Write a function to access the current user, and access the storyImages
                    //array, and do a spread operator, reupload with new item appended to it

                    //Access database, upload URL, put in their storyImages array the new url
                    //Subsequent fetch will update userInfo
                    //Uploads to storage container, not attached to a user
                    //Go to storage, folder called images
                    //Chat view at the bottom

                    //Send media function in chat view
                    //.then call next async function
                    //Look between uploadMedia and sendMedia

                    //Pass functions into this, recall in auth context, recall fetchUser
                    //Pass fetchUser into the function, and then call it
                                                            
                })
            })
            this.showcaseImage(userInfo)
    }
    showcaseImage = (userInfo)=>{
        this.setState({test:true})
        if(userInfo.storyImages.includes("image/gif", "image/jpeg", "image/png")){
            this.setVar(userInfo)
            this.setState({isImage:true})
        }
        else{
            this.setVar(userInfo)
            this.setState({isImage:false})
        }
    }

    setVar = (userInfo)=>{
        this.setState({userImages:userInfo.storyImages})
    }

    displayUnreadInfo =  async (unreadInfo, userInfo, chat) => {
        try {
            //Get the correct database document
            const chatData = await chatsRef.doc(chat).get()
            const chatRef = chatsRef.doc(chatData.id)
            let tempStore = chatData.data().chat.messages
            chatData.data().chat.messages.forEach((message,index) => {
                //If a message is unread, not sent by the current user and is a visible message (Not scheduled for future viewing)
                if(message.unread === true && message.userId !== userInfo.uniqueId && new Date(message.createdAt.seconds * 1000) < new Date()) {
                    //Update the appropriate temporary local message store at the correct location
                    tempStore[index].unread = false
                }
            })
            //Update the database document
            chatRef.update({'chat.messages': [...tempStore]})
            unreadInfo.messages.forEach(message =>{
                alert(message.postingUser + " said: " + ReactHtmlParser(message.content)[0].props.children[0])
            })
        } catch(error) {
            console.log(error)
        }
    }

    /**
     * The render function ensures the following information is getting on screen
     */
    render() {
  
    return (
        <AuthConsumer>
            {/*Provides the needed information to use later on*/}
            {({signUp, logIn, user, authMessage, logOut, createChat, fetchChats, userChats, goToChat, chatBot, goToProfile, goToContacts, deleteChat, userInfo, overallUserUnread}) => (
             <>
             {/*The stories section of the page, differentiated appearance*/}
             <div className='storyScreen bg-gray-300 h-48'>
             <div className="storyHeader flex flex-col h-32 w-full bg-gray-300 font-mono py-4">
                    
                    <span className="FormHeader text-center text-black lg:text-1xl md:text-1xl sm:text-xl font-mono">
                    <label for="myfile">Upload Story: </label>
                    <input type="file" id="myfile" name="myfile" accept="image/*, video/*" onChange={(e)=>this.handleImage(userInfo, e)}/>
                        <p align="left">{userInfo.displayName}'s Story</p>
                        {this.state.isImage===true ?(<div>
                        <img src={userInfo.storyImages[36]} width="150px" height="150px"/>
                        </div>):(<iframe width = "150px" height = "150px" src = {userInfo.storyImages[36]}></iframe>)}
                     </span>
                    </div>
                    </div>
                    {/*Set the userInfo variable to a local variable*/}
                    {/*The main menu section*/}
                        <div className='mainScreen bg-gray-500 h-screen'>
                    <div className="mainScreenHeader flex flex-col h-1/3 w-full bg-gray-500 font-mono py-4">
                    <p className="block lg:text-9xl md:text-6xl sm-text-5xl break-words text-center">Main Menu</p>
                    
                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        {/*All of the buttons used for naviagtion*/}
                    <button className="border-black border-2 bg-yellow-500"  onClick={(e)=> createChat("N8kGtE5uqcgQVfHycKUuTuSU1uI3")}>New Chat</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> goToProfile()}>Settings</button> 
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> chatBot()}>Chat Bot</button> 
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> goToContacts()}>Contacts</button>
                    <button className="border-black border-2 bg-yellow-500 " onClick={(e)=> logOut()}>Log Out</button>
                    </span>
                    {/*Possible section for the friends, and also the chats section*/}
                    <p className="block lg:text-7xl md:text-4xl sm-text-3xl break-words text-left">Chats</p>
                    <br/>
                    <span className="FormHeader block text-left text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        {/*Gets chats if the get chats button is hit*/}
                    {Object.keys(userChats).map(key =>
                        <div key={key}>
                            <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(userChats[key])}>Go to Chat: {userChats[key]}</button>
                            {overallUserUnread[key] !== undefined && overallUserUnread[key].count > 0 ? (
                            <button className="border-black border-2 bg-yellow-500" onClick={(e) => this.displayUnreadInfo(overallUserUnread[key], userInfo, userChats[key])} type="button">You have {overallUserUnread[key].count} unread messages here</button>
                            ) : (<></>)}
                            <button className="border-black border-2 bg-yellow-500" onClick={(e)=> deleteChat(userChats[key])}>Delete</button>
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
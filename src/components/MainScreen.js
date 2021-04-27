import React from 'react'
import {AuthConsumer} from './AuthContext'
import {firebaseAuth, usersRef, chatsRef, storage} from '../firebase'
import ReactHtmlParser from 'react-html-parser'
import firebase from 'firebase/app';
import 'firebase/firestore';

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

    /**
     * This function sends the media being uploaded to the user story in our firebase database
     * 
     * @author Tanner Bakken
     * @param {The URL of the image or video being uploaded} URL 
     * @param {The user doing the uploading} uploader 
     * @param {Get the user information} fetchUser 
     */
    sendMedia = async (URL, uploader, fetchUser) => {
        try{
            console.log(URL)
            const userData = await usersRef
        .   where('user.uniqueId', '==', uploader.uniqueId)
            .get()
        userData.forEach(doc => {
            usersRef.doc(doc.id).update({ 'user.storyImages': firebase.firestore.FieldValue.arrayUnion(URL) })
             //Indicate to the user that their media item uploaded successfully
            alert('Your media item uploaded successfully!')
        })
        } catch(error) {
            console.log(error)
        }
        console.log(uploader)
        fetchUser(uploader.uniqueId)
        console.log(uploader)
    
    }

    /**
     * Sends story where it needs to go, and calls the showcase method
     * 
     * @author Tanner Bakken
     * @param {The info the user has} userInfo 
     * @param {Used for technicality of getting the image} e 
     * @param {Get the user that is using} fetchUser 
     */
    handleImage = (userInfo, e, fetchUser) => {
        console.log(userInfo.storyImages[0])
        //e.preventDefault()
        const image = e.target.files[0]
        //this.state.imageFile = image;
        this.setState({imageFile: image})
        console.log(this.imageFile)
        //The else of the sign up goes here
        const uploadTask = storage.ref(`/images/${image.name}`).put(image)
            uploadTask.on('state_changed', 
            (snapShot) => {
                console.log(snapShot)
            }, (err) => {
                console.log(err)
            }, async () => {
                await storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseURL => {
                    this.setState({imageUrl:fireBaseURL})

                    this.sendMedia(fireBaseURL, userInfo, fetchUser)
                    
                })
            })
            
            this.showcaseImage(userInfo)
    }
    /**
     * This method tells whether you are using an image or a video
     * 
     * @author Tanner Bakken
     * @param {The user's information} userInfo 
     */
    showcaseImage = (userInfo)=>{
        this.setState({test:true})
        if(userInfo.storyImages[userInfo.storyImages.length-1].includes("GIF", "JPEG", "PNG", "JPG", "gif", "jpeg", "png", "jpg")){
            this.setVar(userInfo)
            this.setState({isImage:true})
        }
        else{
            this.setVar(userInfo)
            this.setState({isImage:false})
        }
        // console.log(isImage)
    }

    /**
     * This method sets the state to the story image being used
     * 
     * @author Tanner Bakken
     * @param {The users information} userInfo 
     */
    setVar = (userInfo)=>{
        this.setState({userImages:userInfo.storyImages})
    }

    displayUnreadInfo =  async (unreadInfo, userInfo, chat) => {
        /**
         * @author Jake Collins
         * Display the unread messages for the conversation that was clicked on
         */
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
     * 
     * @author Tanner Bakken
     */
    render() {
  
    return (
        <AuthConsumer>
            {/*Provides the needed information to use later on*/}
            {({signUp, logIn, user, authMessage, logOut, createChat, fetchChats, userChats, goToChat, chatBot, goToProfile, goToContacts, deleteChat, userInfo, overallUserUnread, fetchUser, colorScheme}) => (
             <>
             {/*The stories section of the page, differentiated appearance*/}
             <div className={`storyScreen h-48${colorScheme.primary}`}>
             <div className={`storyHeader flex flex-col h-full w-full font-mono py-4 ${colorScheme.primary} ${colorScheme.text}`}>
                    
                    <span className="FormHeader text-center lg:text-1xl md:text-1xl sm:text-xl font-mono">
                    <label for="myfile">Upload Story: </label>
                    <input type="file" id="myfile" name="myfile" accept="image/*, video/*" onChange={(e)=>this.handleImage(userInfo, e, fetchUser)}/>
                        <p align="left">{userInfo.displayName}'s Story</p>
                    
                        {userInfo.storyImages!==undefined ?
                        (this.state.isImage===true?
                            (<img height = "150px" width="200px" src = {userInfo.storyImages[userInfo.storyImages.length-1]}></img>):
                            (<iframe scrolling="no" src = {userInfo.storyImages[userInfo.storyImages.length-1]}></iframe>)   
                        ):(<></>)}
                    
                    </span>
                    </div>
                    </div>
                    {/*Set the userInfo variable to a local variable*/}
                    {/*The main menu section*/}
                        <div className={`mainScreen h-screen ${colorScheme.secondary}`}>
                    <div className={`mainScreenHeader flex flex-col h-1/3 w-full font-mono py-4 ${colorScheme.secondary} ${colorScheme.text}`}>
                    <p className="block lg:text-9xl md:text-6xl sm-text-5xl break-words text-center">Main Menu</p>
                    
                    <span className="FormHeader block text-center lg:text-4xl md:text-2xl sm:text-xl font-mono">
                        {/*All of the buttons used for naviagtion*/}
                    <button className={`border-black border-2 ${colorScheme.primary}`}  onClick={(e)=> createChat("N8kGtE5uqcgQVfHycKUuTuSU1uI3")}>New Chat</button>
                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e)=> goToProfile()}>Settings</button> 
                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e)=> chatBot()}>Chat Bot</button> 
                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e)=> goToContacts()}>Contacts</button>
                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e)=> logOut()}>Log Out</button>
                    </span>
                    {/*Possible section for the friends, and also the chats section*/}
                    <p className="block lg:text-7xl md:text-4xl sm-text-3xl break-words text-left">Chats</p>
                    <br/>
                    <span className={`FormHeader block text-left lg:text-4xl md:text-2xl sm:text-xl font-mono ${colorScheme.text}`}>
                        {/*Gets chats if the get chats button is hit*/}
                    {Object.keys(userChats).map(key =>
                        <div key={key}>
                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => goToChat(userChats[key])}>Go to Chat: {userChats[key]}</button>
                            {overallUserUnread[key] !== undefined && overallUserUnread[key].count > 0 ? (
                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => this.displayUnreadInfo(overallUserUnread[key], userInfo, userChats[key])} type="button">You have {overallUserUnread[key].count} unread messages here</button>
                            ) : (<></>)}
                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e)=> deleteChat(userChats[key])}>Delete</button>
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
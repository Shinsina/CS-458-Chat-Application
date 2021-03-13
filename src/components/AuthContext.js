import React from 'react'
import {firebaseAuth, usersRef, chatsRef, storage} from '../firebase'
import {withRouter} from 'react-router-dom' 

import firebase from 'firebase/app'
import 'firebase/firestore'

const AuthContext = React.createContext()

/**
 * This class is designed to create functions and store information that will likely be used in various places throughout the application
 * @author Jake Collins
 */
class AuthProvider extends React.Component {
    /**
     * user: Stores a unique user id and the user's email when they log in
     * authMessage: Contains an authentication error message related to creation of an account or logging into one
     * imageURL: Will store the user's profile picture URL from the database when a user is created
     * userInfo: Stores all user information contained on the currently logged in user's respective database object including:
     * A URL to their profile picture (profilePicture)
     * A display name to be shown throughout the application (displayName)
     * A unique ID to uniquely identify them in various locations of the application (uniqueId)
     * A contact list containing all the contacts for the logged in user (contactList)
     * A block list containing all the users the currently logged in user has blocked (blockList)
     * A boolean indicator if the user has dark mode enabled or not (darkMode)
     * A boolean indicator if the user has location tracking enabled (locationTracking)
     * A boolean indicator for whether the user is logged in currently or not (onlineStatus)
     * A string storing a user set activity status (activityStatus)
     * botInfo: The user info for the bot account (displayName; Waffle Cone)
     */
    state = {
        user: {},
        authMessage: '',
        imageUrl: '',
        userInfo: {},
        userChats: [],
        botInfo: {
            profilePicture: "https://firebasestorage.googleapis.com/v0/b/chat-app-8b206.appspot.com/o/images%2Favatardefault_92824.png?alt=media&token=716c8089-4bbe-4e41-96bb-80e1d336a815",
            displayName: "Waffle Cone",
            uniqueId: "jDODSSntxgPUk1awehVq2XmJGGv2",
            contactList: [],
            blockList: [],
            darkMode: true,
            locationTracking: false,
            onlineStatus: true,
            activityStatus: "",
        }
    }

    componentDidMount() {
        firebaseAuth.onAuthStateChanged((user) => {
            //If the user is logged in
            if(user) {
                this.setState({
                    user: {
                        id: user.uid,
                        email: user.email
                    }
                })
                //Fetch the appropriate information for userInfo state variable
                this.fetchUser(this.state.user.id);
                //IF the user isn't logged in
            } else {
                this.setState({
                    user: {}
                })
            }
        })
        
    }
    
    signUp = async (displayName, email, password, image, e) => {
        try {
            e.preventDefault()
            //Create the user in the database
            await firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            )
            //If the user does not provide an image give them the default image
            if (image === '') {
                const user = {
                    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/chat-app-8b206.appspot.com/o/images%2Favatardefault_92824.png?alt=media&token=716c8089-4bbe-4e41-96bb-80e1d336a815',
                    displayName: displayName,
                    uniqueId: this.state.user.id,
                    contactList: [],
                    blockList: [],
                    darkMode: true,
                    locationTracking: false,
                    onlineStatus: true,
                    activityStatus: ''
                }
                usersRef.add({user})
            }
            //If the user does provide an image upload it and then set a state variable to store it 
            else {
                
            const uploadTask = storage.ref(`/images/${image.name}`).put(image)
            uploadTask.on('state_changed', 
            (snapShot) => {
                //console.log(snapShot)
            }, (err) => {
                //console.log(err)
            }, async () => {
                await storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseURL => {
                    this.state.imageUrl = fireBaseURL
                })
                //Create the user object to store in the database
                const user = {
                    profilePicture: this.state.imageUrl,
                    displayName: displayName,
                    uniqueId: this.state.user.id,
                    contactList: [],
                    blockList: [],
                    darkMode: true,
                    locationTracking: false,
                    onlineStatus: true,
                    activityStatus: ''
                }
                usersRef.add({user})
            })
        }
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logIn = async (email, password, e) => {
        try {
            e.preventDefault()
            //Authenticate the user on log in
            await firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            )
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logOut = () => {
        try {
            //Set the user as being offline
            this.setOfflineStatus()
            firebaseAuth.signOut()
            this.setState ({
                user: {},
                userInfo: {}
            })
            //Return them to the log in page
            this.props.history.push(`/`)
        } catch(error) {
            this.setState({
                authMessage: error.messages
            })
        }
    }
    //When a user logs out set their onlineStatus to false
    setOfflineStatus = async () => {
        try {
            const currentUser = await usersRef
            .where('user.uniqueId','==', this.state.user.id)
            .get()
            currentUser.forEach(doc => {
                usersRef.doc(doc.id).update({'user.onlineStatus': false})
            })
        } catch(error) {
            console.log(error)
        }
    }

    goToMainMenu = ()=>{
        try{
            this.props.history.push(`/mainMenu`)
        }
        catch(error){
            this.setState({
            authMessage: error.message
            })
        }
    }
    //Fetchs the currently logged in users information from the database to store in state variables
    fetchUser = async userId => {
        try {
            const currentUser = await usersRef
            .where('user.uniqueId','==',userId)
            .get()
            currentUser.forEach(doc => {
                this.setState({
                userInfo: {
                    profilePicture: doc.data().user.profilePicture,
                    displayName: doc.data().user.displayName,
                    uniqueId: doc.data().user.uniqueId,
                    contactList: doc.data().user.contactList,
                    blockList: doc.data().user.blockList,
                    darkMode: doc.data().user.darkMode,
                    locationTracking: doc.data().user.locationTracking,
                    onlineStatus: true,
                    activityStatus: doc.data().user.activityStatus,
                }
                })
                usersRef.doc(doc.id).update({'user.onlineStatus': true})       
            })
            //Fetch the chats for the currently logged in user
           this.fetchChats();
        }
        catch (error) {
            console.log(error)
        }
    }


    //Create a chat with the userId passed into this function in addition to the currently logged in user and the bot
    createChat = async (chatterId) => {
        const botId = "jDODSSntxgPUk1awehVq2XmJGGv2"
        try {
            const chat = {
                chatters: [this.state.userInfo.uniqueId,chatterId,botId],
                messages: [],
            }
            chatsRef.add({chat})
        }
        catch(error){
            console.log(error)
        }
        //Refetch the chats to update the local state variable for the chats
        this.fetchChats()
    }

    //Delete the selected chat by the ID
    deleteChat = async(chatId)=>{

        const chatRef = await chatsRef.doc(chatId).get()

        console.log(chatRef.data())

        try{
            chatsRef.doc(chatId).delete()
        }
        catch(error){
            console.log(error)
        }
        this.fetchChats()
    }

    //Fetch all conversations the user is currently in
    fetchChats = async () => {
        try {
        this.setState({userChats: []})
        const test = await chatsRef
        .get()
        test.forEach(doc => {
            if (doc.data().chat.chatters.toString().includes(this.state.userInfo.uniqueId)){
              this.setState({userChats: [...this.state.userChats, doc.id]})
            }
        })
        }
        catch(error) {
            console.log(error)
        }
    }
    //Go the chat view for the chat by the ID passed into this function
    goToChat = (chatId) => {
        this.props.history.push(`/Chat/${this.state.user.id}/${chatId}`)
    }
    //Go the the currently logged in users profile
    goToProfile = () => {
        this.props.history.push(`/ProfileScreen/${this.state.user.id}`)
    }
    //Go to the contacts page
    goToContacts = () => {
        this.props.history.push(`/Contacts`)
    }
    //Go to the bot view
    chatBot = () => {
        this.props.history.push(`/BotView`)
    }
//PRovides the functions and data stored in this class to be "consumed" by other classes
    render () {
        return (
            <AuthContext.Provider
            value = {{ 
                user: this.state.user, 
                signUp: this.signUp,
                logIn: this.logIn,
                logOut: this.logOut,
                authMessage: this.state.authMessage,
                userInfo: this.state.userInfo,
                botInfo: this.state.botInfo,
                userChats: this.state.userChats,
                createChat: this.createChat,
                deleteChat: this.deleteChat,
                fetchChats: this.fetchChats,
                goToChat: this.goToChat,
                goToProfile: this.goToProfile,
                goToContacts: this.goToContacts,
                chatBot: this.chatBot,
                fetchUser: this.fetchUser
                }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer
export default withRouter(AuthProvider)
export { AuthConsumer }
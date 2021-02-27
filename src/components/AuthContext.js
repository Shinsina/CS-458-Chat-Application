import React from 'react'
import {firebaseAuth, usersRef, chatsRef, storage} from '../firebase'
import {withRouter} from 'react-router-dom' 

import firebase from 'firebase/app'
import 'firebase/firestore'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        user: {},
        authMessage: '',
        imageUrl: '',
        userInfo: {},
        userChats: []
    }

    componentDidMount() {
        firebaseAuth.onAuthStateChanged((user) => {
            if(user) {
                this.setState({
                    user: {
                        id: user.uid,
                        email: user.email
                    }
                })
                this.fetchUser(this.state.user.id);
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
            //console.log(image)
            await firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            )
            if (image === '') {
                //console.log(`not an image, the image file is a ${typeof(image)}`)
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
                    //console.log(this.state.imageUrl)
                    //console.log(fireBaseURL)
                })
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
            /*if(window.confirm("Would you like to be redirected to your profile?")) {
                this.props.history.push(`/${this.state.user.id}/profile`)
            }*/
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logIn = async (email, password, e) => {
        try {
            e.preventDefault()
            await firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            )
            //console.log(this.state.user.id)
            /*if(window.confirm("Would you like to be redirected to your profile?")) {
                this.props.history.push(`/${this.state.user.id}/profile`)
            }*/
            //this.fetchUser(this.state.user.id)
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logOut = () => {
        try {
            this.setOfflineStatus()
            firebaseAuth.signOut()
            this.setState ({
                user: {},
                userInfo: {}
            })
            this.props.history.push(`/`)
            //console.log('signed out')
        } catch(error) {
            this.setState({
                authMessage: error.messages
            })
        }
    }

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
           this.fetchChats();
        }
        catch (error) {
            console.log(error)
        }
    }



    createChat = async (chatterId) => {
        try {
            const chat = {
                chatters: [this.state.userInfo.uniqueId,chatterId],
                messages: [],
            }
            chatsRef.add({chat})
        }
        catch(error){
            console.log(error)
        }
    }

    fetchChats = async () => {
        try {
        this.setState({userChats: []})
        const test = await chatsRef
        .get()
        test.forEach(doc => {
            //console.log(doc.id, '=>', doc.data().chat.chatters.toString())
            if (doc.data().chat.chatters.toString().includes(this.state.userInfo.uniqueId)){
                //console.log("HELLO")
              this.setState({userChats: [...this.state.userChats, doc.id]})
            }
        })
        //console.log(this.state.userChats)
        }
        catch(error) {
            console.log(error)
        }
    }

    goToChat = (chatId) => {
        this.props.history.push(`/${this.state.user.id}/${chatId}`)
    }

    goToProfile = () => {
        this.props.history.push(`/ProfileScreen`)
    }

    goToContacts = () => {
        this.props.history.push(`/Contacts`)
    }

    chatBot = () => {
        this.props.history.push(`/BotView`)
    }

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
                userChats: this.state.userChats,
                createChat: this.createChat,
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
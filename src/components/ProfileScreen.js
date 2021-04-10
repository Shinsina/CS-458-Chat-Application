import { Editor } from "@tinymce/tinymce-react"
import React, { Component } from "react"
import { usersRef, chatsRef } from '../firebase'
import { AuthConsumer } from './AuthContext'
import firebase from 'firebase/app';
import 'firebase/firestore';

/**
 * @author Logan Peterson, Jake Collins
 */

let count = 0
class ProfileScreen extends React.Component {
    statusInput = React.createRef();
    state = {
        status: "Double click to change status",
        isInEditMode: false,
        loggedInUser: false,
        userInfo: {},
        userChats: [],
        isUserBlocked: false,
        updateCount: 0,
    }


    componentDidUpdate() {
        if (this.props.userInfo.profilePicture && this.state.updateCount === 0) {
            this.setState({ updateCount: 1 })
            // console.log(this.props)
            // console.log(count)
            this.fetchOtherUser(this.props.urlID)
            this.isUserBlocked(this.props.userInfo.uniqueId)
        }
    }
    componentDidMount() {
        this.setState({ updateCount: 0 })
    }

    changeEditMode = () => {
        this.setState({
            isInEditMode: !this.state.isInEditMode
        })
    }

    updateDbStatus = async (chatter, userFetch) => {
        try {
            const currentUser = await usersRef
                .where('user.uniqueId', '==', chatter.uniqueId)
                .get()
            currentUser.forEach(doc => {
                //console.log(doc.id)
                usersRef.doc(doc.id).update({ 'user.activityStatus': this.state.status })
            })
            userFetch(chatter.uniqueId)
        }
        catch (error) {
            console.log(error)
        }
    }

    updateStatus = (chatter, userFetch) => {
        this.setState({
            isInEditMode: false,
            status: this.statusInput.current.value
        })
        //console.log(chatter.activityStatus)
        this.updateDbStatus(chatter, userFetch)
    }

    renderEditView = (chatter, userFetch, colorScheme) => {
        return <div className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
            <input
                type="text"
                defaultValue={chatter.activityStatus}
                ref={this.statusInput}
            />
            <button className={`${colorScheme.text}`} onClick={this.changeEditMode}>X</button>
            <button className={`${colorScheme.text}`} onClick={(e) => this.updateStatus(chatter, userFetch)}>OK</button>

        </div>
    }

    renderDefaultView = (chatter, colorScheme) => {
        return <div className={`FormHeader block text-center lg:text-4xl md:text-2xl sm:text-xl font-mono ${colorScheme.text}`} onDoubleClick={this.changeEditMode}>
            <p>{chatter.activityStatus}</p>
        </div>
    }

    //this method grabs all data of the other user
    fetchOtherUser = async userId => {
        try {
            const currentUser = await usersRef
                .where('user.uniqueId', '==', userId)
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
                usersRef.doc(doc.id).update({ 'user.onlineStatus': true })
            })
            this.fetchSameChats();
        }
        catch (error) {
            console.log(error)
        }
    }

    fetchSameChats = async () => {
        try {
            this.setState({ userChats: [] })
            const test = await chatsRef
                .get()
            test.forEach(doc => {
                //console.log(doc.id, '=>', doc.data().chat.chatters.toString())
                if (doc.data().chat.chatters.toString().includes(this.state.userInfo.uniqueId) && doc.data().chat.chatters.toString().includes(this.props.urlID)) {
                    //console.log("HELLO")
                    this.setState({ userChats: [...this.state.userChats, doc.id] })
                }
            })
            //console.log(this.state.userChats)
        }
        catch (error) {
            console.log(error)
        }
    }
    //this method adds the other user id to the logged in user's array list of blocked people
    blockOtherUser = async (loggedInUser) => {
        const currentUser = await usersRef
            .where('user.uniqueId', '==', loggedInUser)
            .get()
        currentUser.forEach(doc => {
            usersRef.doc(doc.id).update({
                'user.blockList': firebase.firestore.FieldValue.arrayUnion(this.props.urlID)
            })
        })
        //console.log(this.state.isUserBlocked)
    }

    unBlockOtherUser = async (loggedInUser) => {
        const currentUser = await usersRef
            .where('user.uniqueId', '==', loggedInUser)
            .get()
        currentUser.forEach(doc => {
            usersRef.doc(doc.id).update({
                'user.blockList': firebase.firestore.FieldValue.arrayRemove(this.props.urlID)
            })
        })
    }

    isUserBlocked = async (loggedInUser) => {
        const currentUser = await usersRef
            .where('user.uniqueId', '==', loggedInUser)
            .get()
        currentUser.forEach(doc => {
            //console.log(doc.data().user)
            //console.log(this.props.urlID)
            if (doc.data().user.blockList.toString().includes(this.props.urlID)) {
                console.log("anything")
                this.setState({ isUserBlocked: true })
            }
        })
    }

    goBack() {
        console.log("test go back")
        window.history.back();
      }

    render() {
        return (
            <AuthConsumer>
                {({ userInfo, fetchUser, goToChat, colorScheme, toggleDarkMode}) => (
                    <>
                        {/*this turnary opperator checks if we are passing the other user id as a paramater*/}
                        {this.props.urlID == userInfo.uniqueId ? (
                            //Logged in user profile

                            <>
                                {console.log("Current User?")}
                                <div className={`${colorScheme.secondary} ${colorScheme.text} h-screen`}>
                                <div className={`${colorScheme.primary} ${colorScheme.text} w-full`}><a href='/' className="fa fa-home">Home</a></div>
                                    <div className={`profileHeader flex flex-col h-52 w-full font-mono py-16 ${colorScheme.primary}`}>
                                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">{userInfo.displayName}
                                        <div className="flex justify-center">
                                            <img src={userInfo.profilePicture} width="60px" height="60px"></img>
                                            <br></br>
                                            </div>
                                            </p>
                                            {this.state.isInEditMode ? this.renderEditView(userInfo, fetchUser, colorScheme) : this.renderDefaultView(userInfo, colorScheme)}
                                        
                                        
                                    </div>
                                    


                                    <div><br></br>
                                        


                                        <br></br>
                                        <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => ""}>Contact List</button></span>
                                        <br></br>
                                        <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => toggleDarkMode(userInfo)}>Dark Mode</button></span>
                                        <br></br>
                                        <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => ""}>Location Toggle</button></span>
                                        <br></br>
                                        <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => ""}>Blocked Users</button></span>

                                    </div>
                                </div>


                            </>
                        ) : (
                            //this is the second part of the turnary that renders all functionality of the other user profile screen
                            <>
                                <div className={`${colorScheme.secondary} ${colorScheme.text} h-screen`}>
                                <div className={`${colorScheme.primary} ${colorScheme.text} w-full`}><a href='/' className="fa fa-home">Home</a></div>
                                    <div className={`profileHeader flex flex-col h-48 w-full font-mono py-16 ${colorScheme.primary}`}>
                                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">{this.state.userInfo.displayName}
                                        

                                        <div className="flex justify-center">
                                            <img src={this.state.userInfo.profilePicture} width="60px" height="60px"></img>
                                        </div>
                                        </p>

                                    </div>

                                    <br></br>
                                    <h3>{this.state.userInfo.activityStatus}</h3>

                                    <br></br>
                                    <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                        <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => ""}>Add to Contacts</button></span>
                                    <br></br>

                                    {this.state.isUserBlocked == false ?
                                        (
                                            <>
                                                <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => this.blockOtherUser(userInfo.uniqueId)}>Block User</button></span>
                                                <br></br>
                                            </>
                                        ) : (
                                            <>
                                                <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                                    <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => this.unBlockOtherUser(userInfo.uniqueId)}>Unblock User</button></span>
                                                <br></br>
                                            </>
                                        )}


                                    {this.state.userChats.length == 0 ? (<>
                                        <span className="FormHeader block text-center  lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => ""}>New Chat</button></span>
                                        <br></br>
                                    </>

                                    ) : (
                                        <>
                                            {
                                                Object.keys(this.state.userChats).map(key =>
                                                    <div key={key}>
                                                        <button className={`border-black border-2 ${colorScheme.primary}`} onClick={(e) => goToChat(this.state.userChats[key])}>Go to Chat: {this.state.userChats[key]}</button>
                                                    </div>
                                                )
                                            }
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </AuthConsumer>
        )
    }



}

export default ProfileScreen;
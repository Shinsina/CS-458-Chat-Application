import { Editor } from "@tinymce/tinymce-react"
import React, { Component } from "react"
import { usersRef, chatsRef } from '../firebase'
import { AuthConsumer } from './AuthContext'
import firebase from 'firebase/app';
import 'firebase/firestore';


class ProfileScreen extends React.Component {
    statusInput = React.createRef();

    state = {
        status: "Double click to change status",
        isInEditMode: false,
        loggedInUser: false,
        userInfo: {},
        userChats: [],

    }

    componentDidMount() {
        this.fetchOtherUser(this.props.match.params.userId)

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

    renderEditView = (chatter, userFetch) => {
        return <div className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
            <input
                type="text"
                defaultValue={chatter.activityStatus}
                ref={this.statusInput}
            />
            <button onClick={this.changeEditMode}>X</button>
            <button onClick={(e) => this.updateStatus(chatter, userFetch)}>OK</button>

        </div>
    }

    renderDefaultView = (chatter) => {
        return <div className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono" onDoubleClick={this.changeEditMode}>
            <p>{chatter.activityStatus}</p>
        </div>
    }

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
                if (doc.data().chat.chatters.toString().includes(this.state.userInfo.uniqueId) && doc.data().chat.chatters.toString().includes(this.props.match.params.userId)) {
                    console.log("HELLO")
                    this.setState({ userChats: [...this.state.userChats, doc.id] })
                }
            })
            //console.log(this.state.userChats)
        }
        catch (error) {
            console.log(error)
        }
    }
    blockOtherUser = async (loggedInUser) => {
        const currentUser = await usersRef
            .where('user.uniqueId', '==', loggedInUser)
            .get()
        currentUser.forEach(doc => {
            usersRef.doc(doc.id).update({
                'user.blockList': firebase.firestore.FieldValue.arrayUnion(this.props.match.params.userId)
            })
        })
    }


    render() {
        return (
            <AuthConsumer>
                {({ userInfo, fetchUser, goToChat }) => (
                    <>
                        {this.props.match.params.userId == userInfo.uniqueId ? (
                            //Logged in user profile

                            <>
                                {console.log("Current User?")}
                                <div className="bg-gray-500 h-screen">
                                    <div className="profileHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">{userInfo.displayName}</p>
                                        <div className="flex justify-center">
                                            <img src={userInfo.profilePicture} width="60px" height="60px"></img>
                                        </div>
                                    </div>


                                    <div><br></br>
                                        <div>
                                            <p>{this.state.isInEditMode ? this.renderEditView(userInfo, fetchUser) : this.renderDefaultView(userInfo)}</p>
                                        </div>


                                        <br></br>
                                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Contact List</button></span>
                                        <br></br>
                                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Dark Mode</button></span>
                                        <br></br>
                                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Location Toggle</button></span>


                                    </div>
                                </div>


                            </>
                        ) : (
                            //other user
                            <>
                                {console.log("Other User?")}
                                <div className="bg-gray-500 h-screen">
                                    <div className="profileHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">{this.state.userInfo.displayName}
                                        </p>

                                        <div className="flex justify-center">
                                            <img src={this.state.userInfo.profilePicture} width="60px" height="60px"></img>
                                        </div>

                                    </div>

                                    <br></br>
                                    <h3>{this.state.userInfo.activityStatus}</h3>

                                    <br></br>
                                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                        <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Add to Contacts</button></span>
                                    <br></br>
                                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                        <button className="border-black border-2 bg-yellow-500 " onClick={(e) => this.blockOtherUser(userInfo.uniqueId)}>Block User</button></span>
                                    <br></br>

                                    {this.state.userChats.length == 0 ? (<>
                                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>New Chat</button></span>
                                        <br></br>
                                    </>

                                    ) : (
                                        <>
                                        {
                                            Object.keys(this.state.userChats).map(key =>
                                                <div key={key}>
                                                    <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(this.state.userChats[key])}>Go to Chat: {this.state.userChats[key]}</button>
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
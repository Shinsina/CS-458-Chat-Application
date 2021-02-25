import { Editor } from "@tinymce/tinymce-react"
import React, { Component } from "react"
import { usersRef } from '../firebase'
import { AuthConsumer } from './AuthContext'


class ProfileScreen extends React.Component {
    statusInput = React.createRef();

    state = {
        status: "Double click to change status",
        isInEditMode: false,

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
                usersRef.doc(doc.id).update({'user.activityStatus': this.state.status})
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
        this.updateDbStatus(chatter,userFetch)
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

    render() {
        return (
            <AuthConsumer>
                {({ userInfo, fetchUser }) => (
                    <>
                        <div className="bg-gray-500 h-screen">
                            <div className="profileHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                                <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Profile</p>
                            </div>
                            <div><br></br>

                                <div>
                                    <p>{this.state.isInEditMode ? this.renderEditView(userInfo, fetchUser) : this.renderDefaultView(userInfo)}</p>
                                </div>

                                <br></br>
                                <p>{userInfo.activityStatus}​​</p>
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
                )}
            </AuthConsumer>
        )
    }



}

export default ProfileScreen;
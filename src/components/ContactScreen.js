import React from 'react';
import { AuthConsumer } from './AuthContext'
import { usersRef, chatsRef } from '../firebase';
import 'firebase/firestore';

class ContactScreen extends React.Component {

    state = {
        addingID: "",
        addResponse: " ",
    }

    mapContactToChatID = async (userInfo, k) => {
        console.log("mapContactToChatID");

        var chats = new Array();
        var backward = new Map();
        await chatsRef.get().then((results) => {
            results.forEach(doc => {
                chats.push(doc.data());
                backward[doc.data()] = doc.id;
                console.log(`Pushed { data=${doc.data()}, id=${doc.id} }.`)
            });
        });
        console.log(chats);

        const chat = chats.filter(data => data.chat.chatters.toString().includes(userInfo.uniqueId))
            .filter(data => data.chat.chatters.toString().includes(userInfo.contactList[k]))

        if (!chat.length) {
            return false;
        } else {
            const chatid = backward[chat];
            console.log(`Going to chat: ${chatid}`)
            return chatid;
        }
    }

    addContact = async (userInfo) => {
        console.log("addContact")

        if (this.state.addingID == null || this.state.addingID == "") {
            this.setState({
                addingID: this.state.addingID,
                addResponse: "Please enter an id."
            });
            return;
        }
        if (this.state.addingID == userInfo.uniqueId) {
            this.setState({
                addingID: this.state.addingID,
                addResponse: "This is your own user ID. You can't be friends with yourself."
            });
            return;
        }

        var present = false
        await usersRef.where("user.uniqueId", "==", this.state.addingID)
            .get().then(results => results.forEach(doc => {
                present = true;
            }));
        const response = present ? "Contact successfully added." : "Failed to add contact. No user has that ID.";



        if (!present) return;
        else {
            if (!userInfo.contactList.includes(this.state.addingID)) {
                userInfo.contactList.push(this.state.addingID)
                this.setState({ addingID: this.state.addingID, addResponse: response });

                // update db
                // Create chat
            }
        }
    }

    boxChange = (e) => {
        console.log("boxChange")
        this.setState({
            addingID: e.target.value,
            addResponse: " "
        });
    }

    render() {
        return (
            <AuthConsumer>
                {({ userInfo, goToChat }) => (
                    <>
                        <h1><b>Add a Contact:</b></h1>
                        <h4>Enter their id below:</h4>
                        <input type="text" value={this.state.addingID} onChange={this.boxChange} />
                        <h4>Your unique id: {userInfo.uniqueId}</h4>
                        <button className="border-black border-2 bg-yellow-500" onClick={(e) => this.addContact(userInfo)}>Add Contact</button>
                        <p>{this.state.addResponse}</p>
                        <br /><br /><br />


                        <h1><b>Contacts:</b></h1>
                        {Object.keys(userInfo.contactList).map(async k => {
                            let userobj;
                            await usersRef.where('user.uniqueId', '==', userInfo.contactList[k]).get()
                                .then(results => {
                                    results.forEach((r) => {
                                        userobj = r.data();
                                    });
                                });
                            console.log(userobj);

                            const displayName = userobj.user.displayName;
                            console.log(displayName);


                            return (<div key={k}><h3>
                                <button className="border-black border-2 bg-yellow-500" onClick={
                                    async () => {
                                        const n = this.mapContactToChatID(userInfo, k)
                                        if (n) goToChat(n);
                                        else console.error("Couldn't go to chat because couldn't find chat for user.")
                                    }}>
                                    {userobj}
                                </button>
                            </h3></div>);
                        })}
                    </>
                )}
            </AuthConsumer>
        )
    }
}

export default ContactScreen;
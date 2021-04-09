import React from 'react';
import { AuthConsumer } from './AuthContext'
import { usersRef, chatsRef } from '../firebase';
import 'firebase/firestore';

class ContactScreen extends React.Component {

    constructor(props) {
        super(props);
        this.userInfo = props.userInfo;

    }

    state = {
        changed: true,
        addingID: "",
        addResponse: " ",
        buttonInfo: undefined
    }

    async componentDidMount() {
        console.log("componentDidMount()");

        await this.fetchButtonInfo();
    }

    async componentDidUpdate() {
        if (this.state.changed) {
            console.log("componentDidUpdate()");
            await this.fetchButtonInfo();
        }
    }

    async fetchButtonInfo() {
        console.log("fetchButtonInfo()");

        let userInfo = this.userInfo;
        let userInformation = new Array();

        const keys = Object.keys(userInfo.contactList);
        for (const k in keys) {
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

            userInformation.push([k, displayName, await this.mapContactToChatID(userInfo, k)])
        }

        console.log("Buttons updated. User information:");
        console.log(userInformation);
        this.setState({ buttonInfo: userInformation, changed: false });
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
        console.log("chats:");
        console.log(chats);

        const chat = chats.filter(data => data.chat.chatters.toString().includes(userInfo.uniqueId))
            .filter(data => data.chat.chatters.toString().includes(userInfo.contactList[k]))
        console.log("chat:" + chat);

        if (!chat.length) {
            return false;
        } else {
            const chatid = backward[chat[0]];
            console.log(`Going to chat: ${chatid}`)
            return chatid;
        }
    }


    render() {
        return (
            <AuthConsumer>
                {({ userInfo, createChat, goToChat, colorScheme }) => (
                    <>
                        {/*These divs are for consistency with the styling of the other pages.*/}
                        <div className={`${colorScheme.secondary} h-screen`}>
                        <div className={`${colorScheme.primary} ${colorScheme.text} w-full`}><a href='/' className="fa fa-home">Home</a></div>
                            <div className={`${colorScheme.primary} ${colorScheme.text} profileHeader flex flex-col h-48 w-full font-mono py-16`}></div>

                            <br />
                            <div className={`${colorScheme.text}`}>
                            <h1><b>Add a Contact:</b></h1><br />
                            <h4>Enter their id below:</h4>
                            <input type="text" value={this.state.addingID} onChange={this.boxChange} />
                            <h4>Your unique id: {userInfo.uniqueId}</h4>
                            <button className={`${colorScheme.primary} border-black border-2`} onClick={(e) => this.addContact(userInfo, createChat)}>Add Contact</button>
                            <p>{this.state.addResponse}</p>
                            
                            <br /><br /><br />


                            <h1><b>Contacts:</b></h1>
                            {this.state.buttonInfo ? this.state.buttonInfo.map((info) => this.makeButton(info, goToChat, colorScheme)) : <></>}
                            </div>
                        </div>
                    </>
                )}
            </AuthConsumer>
        )
    }

    makeButton(info, goToChat, colorScheme) {
        // These get wrapped in a closure packaged with the button.
        const k = info[0];
        const displayName = info[1];
        const chatID = info[2];

        return (<div key={k}><h3>
            <button className={`${colorScheme.primary} border-black border-2`} onClick={
                () => {
                    if (chatID) goToChat(chatID);
                    else console.error("Couldn't go to chat because couldn't find chat for user.")
                }}>
                {displayName}
            </button>
        </h3><br /></div>);
    }

    /************************/
    /* Adding a contact box */
    /************************/

    addContact = async (userInfo, createChat) => {
        console.log("addContact")

        if (this.state.addingID == null || this.state.addingID == "") {
            this.setState({
                addResponse: "Please enter an id."
            });
            return;
        }
        if (this.state.addingID == userInfo.uniqueId) {
            this.setState({
                addResponse: "This is your own user ID. You can't be friends with yourself."
            });
            return;
        }

        var present = false
        await usersRef.where("user.uniqueId", "==", this.state.addingID)
            .get().then(results => results.forEach(doc => {
                present = true;
            }));

        if (!present)
            this.setState({
                addResponse: "Failed to add contact. No user has that ID."
            });
        else {
            if (!userInfo.contactList.includes(this.state.addingID)) {
                userInfo.contactList.push(this.state.addingID)
                this.setState({
                    addResponse: "Contact successfully added.",
                    changed: true // This triggers a re-fetch of the buttons
                });

                // Create the chat
                createChat(this.state.addingID);
            }
        }
    };

    boxChange = (e) => {
        console.log("boxChange")
        this.setState({
            addingID: e.target.value,
            addResponse: " "
        });
    };
}

export default ContactScreen;
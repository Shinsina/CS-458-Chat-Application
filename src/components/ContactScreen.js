import React from 'react';
import { AuthConsumer } from './AuthContext'
import { usersRef, chatsRef } from '../firebase';
import 'firebase/firestore';

// This debug flag and anything depending on it being true will 
// hopefully be optimized away by the bundler.
const debug = false;

/**
 * As the name suggests, this is a component that displays all of the currently 
 * logged in user's contacts. A user may add new contacts from here, or they may 
 * go chat with one of their contacts by clicking on a button with the contact's 
 * name on it.
 * 
 * This component corresponds to the path /Contacts.
 * 
 * @todo Currently, linking directly to this page is broken. This is because 
 * AuthContext loads asynchrounously (It has to because of database calls), 
 * and we don't have a synchronization mechanism protecting it until it's 
 * loaded yet. It would require a little bit of research, and we may or may 
 * not decide to fix it.
 * 
 * @author Aaron Pazdera
 */
class ContactScreen extends React.Component {

    /**
     * @param props This component takes AuthContext's userInfo as a 
     *              prop. All the other props are thrown away after 
     *              being passed to the superclass.
     */
    constructor(props) {
        super(props);
        this.userInfo = props.userInfo;
    }

    /**
     * For contact/chat buttons:
     * changed: Set this to true if you want to rebuild the list of buttons on update, false otherwise.
     * buttonInfo: The information necessary to build the buttons.
     * 
     * For adding IDs:
     * addingID: The ID of the user to add to the database when the "Add Contact" button is clicked.
     * addResponse: What to tell the user once it's been clicked.
     */
    state = {
        changed: true,
        buttonInfo: undefined,
        addingID: "",
        addResponse: " "
    }

    /**
     * Handles the database fetching involved with the initial rendering of this component. Do not call this directly.
     */
    async componentDidMount() {
        /* This is a react life-cycle method. Technically (due to some specifics 
        about how they're executed that were explained to me) you're not supposed 
        to call a life-cycle method inside of another. Otherwise I would just call 
        componentDidUpdate directly here. */
        if (debug) console.log("componentDidMount()");
        await this.fetchButtonInfo();
    }


    /**
     * Handles the database fetching involved with the re-rendering the list of buttons. Do not call this directly.
     */
    async componentDidUpdate() {
        if (this.state.changed) {
            if (debug) console.log("componentDidUpdate()");
            await this.fetchButtonInfo();
        }
    }

    /**
     * This method updates the component's list of buttons. Triggers 
     * on update when this.state.changed = true.
     * 
     * Uses this.state.userInfo to make database requests and update 
     * this.state.buttonInfo, then sets changed back to false as to 
     * not trigger more re-renders.
     */
    async fetchButtonInfo() {
        if (debug) console.log("fetchButtonInfo()");

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
            if (debug) console.log(userobj);

            const displayName = userobj.user.displayName;
            if (debug) console.log(displayName);

            userInformation.push([k, displayName, await this.mapContactToChatID(userInfo, k)])
        }

        if (debug) console.log("Buttons updated. User information:");
        if (debug) console.log(userInformation);
        this.setState({ buttonInfo: userInformation, changed: false });
    }

    /**
     * Returns the chat ID of a chat that this user and the userID stored at this.state.userInfo.contactList[k] are both in. 
     * 
     * @param userInfo The global userInfo context from AuthContext
     * @param k The position of the context to map in userInfo.contactList. Expect some UB if this is out of bounds.
     * @returns A chat ID that both this user and the user located at 
     *          userInfo.contactList[k] are in, or false if no such chat exists. 
     */
    mapContactToChatID = async (userInfo, k) => {
        if (debug) console.log("mapContactToChatID");

        // Fetch all the chats from the database and rip out the data 
        // from the documents and their document IDs.
        var chats = new Array();
        var backward = new Map();
        await chatsRef.get().then((results) => {
            results.forEach(doc => {
                chats.push(doc.data());
                backward[doc.data()] = doc.id;
                if (debug) console.log(`Pushed { data=${doc.data()}, id=${doc.id} }.`)
            });
        });
        if (debug) console.log("chats:");
        if (debug) console.log(chats);

        // Run all the chats and filter them down to just the ones that both this user and the target
        // user are in. Ideally we would be able to do this server/database side, but unfortunately
        // the Firebase API is really, really awful.
        const chat = chats.filter(data => data.chat.chatters.toString().includes(userInfo.uniqueId))
            .filter(data => data.chat.chatters.toString().includes(userInfo.contactList[k]));
        if (debug) console.log("chat:" + chat);

        // If no results were found return false. Otherwise, return the first chat ID found.
        if (!chat.length) {
            if (debug) console.log(`No chat found for user IDs: ${userInfo.uniqueId}, ${userInfo.contactList[k]}.`);
            return false;
        } else {
            // Use the map from before to go from the chat that was found back to its ID.
            const chatid = backward[chat[0]];
            if (debug) console.log(`Found chat: ${chatid}`);
            return chatid;
        }
    }

    /**
     * Renders out this component based its state.
     * 
     * This is a React hook, don't call it directly. 
     * 
     * @returns The JSX for the view of this component.
     */
    render() {
        return (
            <AuthConsumer>
                {({ userInfo, createChat, goToChat, colorScheme }) => (
                    <>
                        {/*These divs are for consistency with the styling of the other pages.*/}
                        <div className={`${colorScheme.secondary} h-screen`}>
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

<<<<<<< HEAD
    /**
     * Creates a button. When this button is pressed, it takes the user to the corresponding chat.
     * 
     * @param buttonInfo An array containing [uniqueDOMID, displayName, chatID]. For more 
     *                   information, refer to the implementation of ContactScreen#fetchButtonInfo().
     * @param goToChat The goToChat() method from AuthContext.
     * @returns The JSX correspoinding to the button 
     */
    makeButton(buttonInfo, goToChat) {
        if (debug) console.log(makeButton);
        if (debug) console.log(buttonInfo);

=======
    makeButton(info, goToChat, colorScheme) {
>>>>>>> 1b5cd92aebe7c7649fab9cddf3025549886be304
        // These get wrapped in a closure packaged with the button.
        const k = buttonInfo[0];
        const displayName = buttonInfo[1];
        const chatID = buttonInfo[2];

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

    /**
     * Handles the "Add Contact" being clicked. Adds the ID in the box as a friend 
     * for this user. Does not update the database.
     * 
     * @param userInfo The global userInfo context from AuthContext
     * @param createChat The createChat() function, also from AuthContext
     * @returns An empty promise. I feel like there's a joke to be made somewhere.
     */
    addContact = async (userInfo, createChat) => {
        if (debug) console.log("addContact")

        // Catch definitely invalid or empty IDs immediately.
        if (this.state.addingID == null || this.state.addingID == "") {
            this.setState({ addResponse: "Please enter an id." });
            return;
        }
        if (this.state.addingID == userInfo.uniqueId) {
            this.setState({ addResponse: "This is your own user ID. You can't be friends with yourself." });
            return;
        }
        if (userInfo.contactList.includes(this.state.addingID)) {
            this.setState({ addResponse: "You are already friends with this user." });
            return;
        }

        // Make a request to the database. See if a user actually has that ID.
        var present = false
        await usersRef.where("user.uniqueId", "==", this.state.addingID)
            .get().then(results => results.forEach(doc => {
                present = true;
            }));
        if (!present) {
            this.setState({ addResponse: "Failed to add contact. No user has that ID." });
            return;
        }


        // Now that everything has been validated, update this user's contact list 
        // and inform the user of the change. The change will be pushed to the 
        // database when userInfo is backed up.

        // Also, remember to create the chat so the newly created contact button has a target when it re-renders.
        await createChat(this.state.addingID);

        userInfo.contactList.push(this.state.addingID);

        this.setState({
            addResponse: "Contact successfully added.",
            changed: true // This triggers a re-fetch of the buttons
        });
    };

    /**
     * Puts the contents of the ID text box into the state and re-renders 
     * the component whenever the contents of the text box changes.
     * 
     * @param e The DOM onChange() event being handled. Or something like that.
     */
    boxChange = (e) => {
        if (debug) console.log("boxChange: " + e.target.value);

        /* 
         * This method only exists because of a peculiarity of text boxes 
         * where they have to have an onChange(). I'm not sure why, but
         * in every React tutorial that I saw, they took the value from 
         * here set state with it. Even if they never planned to do 
         * anything with this new state until some other event happened, 
         * they always called setState() instead of setting directly. I 
         * assume that's a style thing and setState() is wasted computation, 
         * but I'll follow the convention this time.
         */

        this.setState({ addingID: e.target.value });
    };
}

export default ContactScreen;

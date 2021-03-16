import React from 'react';
import { AuthConsumer } from './AuthContext'
import { chatsRef } from '../firebase';
import 'firebase/firestore';

class ContactScreen extends React.Component {

    mapContactToChatID(userInfo, k) {
        // const contactID = userInfo.contactList[k];
        // const contact = await usersRef.where('user.uniqueId', '==', contactID).get().map(doc => doc.data());

        const chat = chatsRef.get()
            .map(doc => doc.data().chat.chatters)
            .filter(chatters => chatters.includes(userInfo.uniqueId))
            .filter(chatters => chatters.includes(userInfo.contactList[k]))

        return chat[0];
    }

    render() {
        return (
            <AuthConsumer>
                {({ userInfo, goToChat }) => (
                    <>
                        <h1><b>Contacts:</b></h1>
                        {Object.keys(userInfo.contactList).map(k =>
                            <div key={k}><h3>
                                <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(this.mapContactToChatID(userInfo, k))}>
                                    {userInfo.contactList[k].displayName}
                                </button>
                            </h3></div>
                        )}
                    </>
                )}
            </AuthConsumer>
        )
    }
}

export default ContactScreen;
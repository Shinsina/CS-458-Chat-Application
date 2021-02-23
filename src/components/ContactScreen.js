import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
  
import firebase from 'firebase/app';
import 'firebase/firestore';

class ContactScreen extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <AuthConsumer>{
                <>
                {({userInfo}) => (
                    <>
                    <h1><b>Contacts:</b></h1>
            
                    {Object.keys(userInfo.contactList).map(k => 
                    <div key={k}><h3>
                    <button className="border-black border-2 bg-yellow-500" onClick={(e) => goToChat(userInfo.contactList[k])}>
                        {userInfo.contactList[k].displayName}
                    </button>
                    </h3></div>
                    
                    )}
                    </>
                )}
                </>
            }</AuthConsumer>)
    }
}

export default ContactScreen;
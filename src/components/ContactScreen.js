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

        this.state = {
            currentUser: '',
            contacts: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
        <AuthConsumer>
        {({user}) => (<></>)}
        </AuthConsumer>
        )
    }
}

export default ContactScreen;
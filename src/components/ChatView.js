import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
  
import firebase from 'firebase/app';
import 'firebase/firestore';

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props.match.params)
        this.state = {
            chatId: '',
            content: '',
            messages: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.setState({chatId: this.props.match.params.chatId})
        //console.log(this.state.chatId)
        this.fetchMessages(this.props.match.params.chatId)
    }
    handleChange(content, editor) {
        this.setState({content});
      }
    handleSubmit = (e,chatter) => {
        e.preventDefault();
        const message = {
            content: this.state.content,
            postingUser: chatter.displayName,
            userImage: chatter.profilePicture, 
            userId: chatter.uniqueId,
            createdAt: new Date(),
            unread: true,
            chatId: this.state.chatId
        }
        this.setState({messages: [...this.state.messages, message]})
        //chatsRef.add({message})
        chatsRef.doc(this.state.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        })
      }

    fetchMessages = async chatId => {
        try {
            const chat = chatsRef.doc(chatId);
            const doc = await chat.get();
            //console.log(doc.data().messages)
            this.setState({messages: doc.data().messages})
        }
        catch(error) {
            console.log(error)
        }
    }
      
    render () {
        return (
            
            <AuthConsumer>
            {({userInfo})=> (
            <>
            <div className="bg-gray-500 h-screen">
            <div className="h-3/4">
            <div className="h-14 text-center text-lg w-full bg-yellow-500"><p className="py-3">{this.state.chatId}</p></div>
            {Object.keys(this.state.messages).map(key => 
                <div key={key}>
                    <div>{ReactHtmlParser(this.state.messages[key].content)}</div>
                </div>
                )}
            </div>
            <form onSubmit={(e) => this.handleSubmit(e,userInfo)}>
            <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-full" type="submit">Submit</button></span>
            <span className="block h-full"><Editor value={this.state.content} init={{resize: false, plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'],
           toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'}}
            onEditorChange={this.handleChange} className="overflow-y-scroll w-full h-full"></Editor>
            </span>
            </form>
            </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}

export default ChatView
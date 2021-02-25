import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
import BotView from './BotView';
  
import firebase from 'firebase/app';
import 'firebase/firestore';

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props.match.params)
        this.state = {
            chatId: '',
            content: '',
            messages: [],
            schedulingMessage: false,
            months: ['January','February','March','April','May','June','July','August','September','October','November', 'December']
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
            'chat.messages': firebase.firestore.FieldValue.arrayUnion(message)
        })

        var comment = this.state.content.toLowerCase();
        var parse = comment.includes("!help");
        if (parse === true) {
            alert("How can I help you? this still a work in progress")
        }


      }

    fetchMessages = async chatId => {
        try {
            const chat = chatsRef.doc(chatId);
            const doc = await chat.get();
            //console.log(doc.data().messages)
            this.setState({messages: doc.data().chat.messages})
           //
        }
        catch(error) {
            console.log(error)
        }
    }

    scheduleMessage = async () => {
        try  {
            let sent = false
            while (!sent) {
                let scheduledTime = prompt('When should this message be sent? (Date should be of form MM/DD/YYYY HH:MM:SS (Timezone)', Date().toString())
                if (scheduledTime !== null) {
                const parseDate = Date.parse(scheduledTime)
                const setDate = new Date(parseDate)
                console.log(setDate)
                if (setDate == 'Invalid Date') {
                    sent = false;
                }
                else {
                    sent = true;
                }
            }
            else {
                sent = true;
            }
            }
        } catch (error) {

        }
    }
      
    render () {
        return (
            
            <AuthConsumer>
            {({userInfo})=> (
            <>
            <div className="bg-gray-500 h-screen">
            <div className="h-2/3">
            <div className="h-14 text-center text-lg w-full bg-yellow-500"><p className="py-3">{this.state.chatId}</p></div>
            {this.state.schedulingMessage === true ? (
                <form className="h-full text-center">
                    <select id="month">

                    </select>
                    <select id="day">

                    </select>
                    <select id="year">

                    </select>
                    <select id="hour">

                    </select>
                    <select id="minute">

                    </select>
                    <select id="second">

                    </select>
                    <select id="timezone">

                    </select>
                </form>
            ) : (
            <div className="h-full overflow-y-scroll">
            {Object.keys(this.state.messages).map(key => 
                
                <div key={key}>
                    {this.state.messages[key].userId === userInfo.uniqueId ? (
                    <div className="flex justify-end py-4">
                    <div className="bg-yellow-500">{ReactHtmlParser(this.state.messages[key].content)}</div>
                    </div>) 
                    : (
                    <div className="flex justify-start py-4">
                    <div className="bg-green-500">{ReactHtmlParser(this.state.messages[key].content)}</div>
                    </div>
                    )}
                    
                </div>
                )}
            </div>
    )}
            <form onSubmit={(e) => this.handleSubmit(e,userInfo)}>
            <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-1/2" type="submit">Submit</button><button className="w-1/2" type="button" onClick={(e) => this.setState({schedulingMessage: true})}>Schedule This Message</button></span>
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
            </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}

export default ChatView
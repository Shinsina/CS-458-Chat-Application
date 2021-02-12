import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            messages: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            createdAt: new Date()
            //TODO: Need an indication for what chat this message is sent in presumably linked to the props parameters passed via the URL
        }
        this.setState({messages: [...this.state.messages, message]})
      }
    render () {
        return (
            
            <AuthConsumer>
            {({userInfo})=> (
            <>
            <div className="bg-gray-500 h-screen">
            <div className="h-3/4">
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
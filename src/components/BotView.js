import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ChatBot from 'react-simple-chatbot';


class BotView extends React.Component {
    render() {
        return (
            <>
                <div className="bg-gray-500 h-screen">
                    <div className="profileHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Bot View</p>
                    </div>
                    <div> <br></br>
                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => alert("lol")}>IDK</button></span>
                        

                    </div>
                </div>
            </>
        )
    }
}



export default BotView;
import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ChatView from './ChatView';


class BotView extends React.Component {

    Parse(props) {
        try {

            

            
        }
        catch(error) {
            console.log(error)
        }
    };

    

    render() {
        return (
            <AuthConsumer>
                {({colorScheme})=> (
            <>
                <div className={`${colorScheme.secondary} h-screen`}>
                <div className={`${colorScheme.primary} ${colorScheme.text} w-full`}><a href='/' className="fa fa-home">Home</a></div>
                    <div className={`${colorScheme.primary} ${colorScheme.text} profileHeader flex flex-col h-48 w-full font-mono py-16`}>
                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Bot View</p>
                    </div>
                    <div> <br></br>
                        <span className={`${colorScheme.text} FormHeader block text-center lg:text-4xl md:text-2xl sm:text-xl font-mono`}>
                            <button className={`${colorScheme.primary} border-black border-2`} onClick={(e) => "" }>IDK</button></span>
                        

                    </div>
                    <div>
                        
                        
                    </div>
                </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}



export default BotView;

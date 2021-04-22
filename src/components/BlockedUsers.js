import { Editor } from "@tinymce/tinymce-react"
import React, { Component } from "react"
import { usersRef, chatsRef } from '../firebase'
import { AuthConsumer } from './AuthContext'
import firebase from 'firebase/app';
import 'firebase/firestore';

class BlockedUsers extends React.Component {

    render() {
        return (
            <AuthConsumer>
                {({ userInfo, colorScheme }) => (
                    <>

                        {console.log("Current User?")}
                        <div className={`${colorScheme.secondary} ${colorScheme.text} h-screen`}>
                            <div className={`${colorScheme.primary} ${colorScheme.text} w-full`}><a href='/' className="fa fa-home">Home</a></div>
                            <div className={`profileHeader flex flex-col h-52 w-full font-mono py-16 ${colorScheme.primary}`}>
                                <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">{userInfo.displayName}
                                    <div className="flex justify-center">
                                        <br></br>
                                    </div>
                                </p>
                            </div>


                            <div><br></br>
                                {userInfo.blockList ? 
                                (
                                <div>
                                    {Object.keys(userInfo.blockList).map(key =>
                                        <div key={key} id={key}>
                                            {userInfo.blockList[key]}
                                        </div>
                                    )}
                                </div>
                                ) : (
                                    <>
                                    <h2 className = "text-center">No Blocked Users</h2>
                                    </>
                                )

    }
                            </div>
                        </div>


                    </>
                )}
            </AuthConsumer>
        )
    }

}

export default BlockedUsers;
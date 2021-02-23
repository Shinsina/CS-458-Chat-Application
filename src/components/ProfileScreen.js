import React from 'react'
import { AuthConsumer } from './AuthContext'



class ProfileScreen extends React.Component {


    render() {
        return (
            <AuthConsumer>
                {({userInfo}) => (
            <>
                <div className="bg-gray-500 h-screen">
                    <div className="profileHeader flex flex-col h-48 w-full bg-gray-300 font-mono py-16">
                        <p className="lg:text-5xl md:text-3xl sm-text-xl break-words text-center">Profile</p>
                    </div>
                    <div><br></br>
                    <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                     <p>{userInfo.activityStatus}​​</p>
                    </span>
                        <br></br>
                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Contact List</button></span>
                            <br></br>
                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Dark Mode</button></span>
                            <br></br>
                        <span className="FormHeader block text-center text-black lg:text-4xl md:text-2xl sm:text-xl font-mono">
                            <button className="border-black border-2 bg-yellow-500 " onClick={(e) => ""}>Location Toggle</button></span>

                    </div>
                </div>
            </>
                )}
            </AuthConsumer>
        )
    }



}

export default ProfileScreen;
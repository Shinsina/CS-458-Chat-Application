import React from 'react'
import {AuthConsumer} from './AuthContext'


class LogInScreen extends React.Component {
    displayNameInput = React.createRef();
    emailInput = React.createRef();
    passwordInput = React.createRef();

    state = {
        formToggle: true,
        imageFile: '',
        imageUrl: ''
    }

    setForm = (e,toggle) => {
        e.preventDefault()
        this.setState({formToggle:toggle})
    }


    handleImage = (e) => {
        e.preventDefault()
        const image = e.target.files[0]
        this.state.imageFile = image;
    }
    
    render() {
    return (
        <AuthConsumer>
            {({signUp, logIn, user, authMessage, logOut}) => (
                <>
                {!user.id ? (
                    <div className='signUpForm bg-gray-500 h-screen'>
                    <div className="signUpHeader flex flex-col h-1/3 w-full bg-gray-500 font-mono py-16">
                    <p className="block lg:text-9xl md:text-6xl sm-text-5xl break-words text-center">Welcome to FaceChat</p>
                    <p className="block lg:text-6xl md:text-3xl sm:text:2xl break-words text-center">A chatting application for you and your friends</p>
                    </div>
                    <span className="FormHeader block text-center text-black lg:text-6xl md:text-3xl sm:text-xl font-mono"><button className="border-black border-2 bg-yellow-500 " onClick={(e)=> this.setForm(e,true)}>Sign in</button> or <button className="border-black border-2 bg-yellow-500" onClick={(e)=> this.setForm(e,false)}>Sign Up</button></span>
                        <p>{this.state.formToggle}</p>
                        {(this.state.formToggle) ? (
                        <div className="FormContent block text-center space-y-4 2xl:text-4xl">
                        <span className="block">{authMessage ? <span>{authMessage}</span> : ''}</span>
                        <span className="block"><input ref={this.emailInput} type='email' placeholder='Enter your email'/></span>
                        <span className="block"><input ref={this.passwordInput} type='password' placeholder='Enter your password'/></span>
                        <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-full" onClick={(e) => logIn(this.emailInput.current.value, this.passwordInput.current.value, e)}>Sign In</button></span>
                        </div>
                        ) :
                            (<div className="FormContent block text-center space-y-4 2xl:text-4xl">
                            <span className="block">{authMessage ? <span>{authMessage}</span> : ''}</span>
                            <span className="block"><input type="file" onChange={this.handleImage} /></span>
                            <span className="block"><input ref={this.displayNameInput} type="text" placeholder='Enter a Display Name'/></span>
                            <span className="block"><input ref={this.emailInput} type='email' placeholder='Enter your email'/></span>
                            <span className="block"><input ref={this.passwordInput} type='password' placeholder='Enter your password'/></span>
                            <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-full" onClick={(e) => signUp(this.displayNameInput.current.value, this.emailInput.current.value, this.passwordInput.current.value, this.state.imageFile, e)}>Sign Up</button></span>
                            </div>)
                    }
                    </div>
                ) : (
                    <>
                    <p>LOGGED IN {user.id}</p>
                    <button onClick={(e)=> logOut()}>Log Out</button>
                    </>
                 )}
            </>
                )}
        </AuthConsumer>
    )
    }


}

export default LogInScreen;
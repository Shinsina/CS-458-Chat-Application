import React from 'react'
import {firebaseAuth, usersRef, storage} from '../firebase'
import {withRouter} from 'react-router-dom' 

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        user: {},
        authMessage: '',
        imageUrl: '',
    }

    componentDidMount() {
        firebaseAuth.onAuthStateChanged((user) => {
            if(user) {
                this.setState({
                    user: {
                        id: user.uid,
                        email: user.email
                    }
                })
            } else {
                this.setState({
                    user: {}
                })
            }
        })
    }
    
    signUp = async (displayName, email, password, image, e) => {
        try {
            e.preventDefault()
            console.log(image)
            await firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            )
            if (image === '') {
                console.log(`not an image, the image file is a ${typeof(image)}`)
            } 
            const uploadTask = storage.ref(`/images/${image.name}`).put(image)
            uploadTask.on('state_changed', 
            (snapShot) => {
                //console.log(snapShot)
            }, (err) => {
                //console.log(err)
            }, async () => {
                await storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseURL => {
                    this.state.imageUrl = fireBaseURL
                    console.log(this.state.imageUrl)
                    console.log(fireBaseURL)
                })
                const user = {
                    profilePicture: this.state.imageUrl,
                    displayName: displayName,
                    uniqueId: this.state.user.id,
                    contactList: [],
                    blockList: [],
                    darkMode: true,
                    locationTracking: false,
    
                }
                usersRef.add({user})
            })
            /*if(window.confirm("Would you like to be redirected to your profile?")) {
                this.props.history.push(`/${this.state.user.id}/profile`)
            }*/
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logIn = async (email, password, e) => {
        try {
            e.preventDefault()
            await firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            )
            /*if(window.confirm("Would you like to be redirected to your profile?")) {
                this.props.history.push(`/${this.state.user.id}/profile`)
            }*/
        } catch(error) {
            this.setState({
                authMessage: error.message
            })
        }
    }
    logOut = () => {
        try {
            firebaseAuth.signOut()
            this.setState ({
                user: {}
            })
            this.props.history.push(`/`)
            console.log('signed out')
        } catch(error) {
            this.setState({
                authMessage: error.messages
            })
        }
    }
    
    render () {
        return (
            <AuthContext.Provider
            value = {{ 
                user: this.state.user, 
                signUp: this.signUp,
                logIn: this.logIn,
                logOut: this.logOut,
                authMessage: this.state.authMessage
                }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer
export default withRouter(AuthProvider)
export { AuthConsumer}
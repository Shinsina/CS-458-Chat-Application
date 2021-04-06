import React from 'react'
import { AuthConsumer } from './AuthContext'
import ContactScreen from './ContactScreen'

class ContactScreenWrapper extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <AuthConsumer>
                {({ userInfo }) => (<ContactScreen userInfo={userInfo} />)}
            </AuthConsumer>
        )
    }
}

export default ContactScreenWrapper;
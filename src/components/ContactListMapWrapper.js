import React from 'react'
import ContactListMapFilter from './ContactListMapFilter'
import { AuthConsumer } from './AuthContext'

class ProfileScreenRenderer extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      mounted: false
    }
  }
  render() {
    return (
      <AuthConsumer>
        {({userInfo}) => (
      <>
      {this.state.mounted === false ? (
      <ContactListMapFilter userInfo={userInfo}/>
      ): (<></>) }
      </>
      )}
      </AuthConsumer>
    )
  }
}

export default ProfileScreenRenderer
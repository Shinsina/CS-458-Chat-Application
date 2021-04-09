import React from 'react'
import ContactListMapFilter from './ContactListMapFilter'
import { AuthConsumer } from './AuthContext'

/**
 * This class is a wrapper for the filtered version of the Map making sure userInfo can be used within componentDidMount
 * @author Jake Collins
 */

class ProfileScreenRenderer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mounted: true
    }
  }
  render() {
    return (
      <AuthConsumer>
        {({userInfo}) => (
      <>
      {this.state.mounted === true ? (
      <ContactListMapFilter userInfo={userInfo}/>
      ): (<></>) }
      </>
      )}
      </AuthConsumer>
    )
  }
}

export default ProfileScreenRenderer
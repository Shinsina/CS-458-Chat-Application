import React from 'react'
import ProfileScreen from './ProfileScreen'
import { AuthConsumer } from './AuthContext'

/**
 * This class is a wrapper to the profile screen in order to ensure userInfo is being passed in so it can be utilized in functions inside componentDidMount
 * @author Jake Collins
 */
class ProfileScreenRenderer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
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
      <ProfileScreen userInfo={userInfo} urlID={this.props.match.params.userId}/>
      ): (<></>) }
      </>
      )}
      </AuthConsumer>
    )
  }
}

export default ProfileScreenRenderer
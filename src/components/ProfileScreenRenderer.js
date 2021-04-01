import React from 'react'
import ProfileScreen from './ProfileScreen'
import { AuthConsumer } from './AuthContext'

class ProfileScreenRenderer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  state = {
    mounted: false
  }
  render() {
    return (
      <AuthConsumer>
        {({userInfo}) => (
      <>
      {this.state.mounted === false ? (
      <ProfileScreen userInfo={userInfo} urlID={this.props.match.params.userId}/>
      ): (<></>) }
      </>
      )}
      </AuthConsumer>
    )
  }
}

export default ProfileScreenRenderer
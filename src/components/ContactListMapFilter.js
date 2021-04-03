import React from 'react'
import GoogleApiWrapper from './Map'
import { AuthConsumer } from './AuthContext'

class ContactListMapFilter extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  state = {
    mounted: true
  }
  render() {
    return (
      <>
      <AuthConsumer>
        {({userInfo}) => (
      <>
      {this.state.mounted === false ? (
      <ProfileScreen userInfo={userInfo} urlID={this.props.match.params.userId}/>
      ): (<></>) }
      </>
      )}
      </AuthConsumer>
      <GoogleApiWrapper lat={this.props.match.params.lat} lng={this.props.match.params.lng} username={this.props.match.params.username}/>
      </>
    )
  }
}

export default ContactListMapFilter
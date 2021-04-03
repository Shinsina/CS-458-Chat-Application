import React from 'react'
import GoogleApiWrapper from './Map'

class CurrentLocationMapFilter extends React.Component {
  render() {
    return (
      <>
      <GoogleApiWrapper lat={this.props.match.params.lat} lng={this.props.match.params.lng} username={this.props.match.params.username}/>
      </>
    )
  }
}

export default CurrentLocationMapFilter
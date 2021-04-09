import React from 'react'
import GoogleApiWrapper from './Map'

/**
 * This class is sent Location version of the map by which will render a single marker at the appropriate location on screen.
 * @author Jake Collins
 */

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
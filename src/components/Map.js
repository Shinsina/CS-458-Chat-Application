import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { mapsAPI } from '../firebase'

const containerStyle = {
  position: 'absolute',  
  width: '100%',
  height: '100%'
}
export class MapContainer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
    mapStyles: {width: '100%', height: '100%'},
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    center: {}
    }
  }

  componentDidMount() {
    if(this.props.lat && this.props.lng && this.props.username){
      this.setState({sentLocation: {lat: this.props.lat, lng: this.props.lng, username: this.props.username}})
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    return (
      <Map google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter={{lat:this.props.lat, lng: this.props.lng}}>
        {this.state.sentLocation ? (
        <Marker onClick={this.onMarkerClick}
                name={`${this.state.sentLocation.username} Sent location`} position={{lat: this.state.sentLocation.lat, lng: this.state.sentLocation.lng}}/>): (<></>)}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: mapsAPI
})(MapContainer);
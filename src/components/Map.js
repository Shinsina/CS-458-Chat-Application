import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { mapsAPI } from '../firebase'

/**
 * This class is for the map view of the application utilziing the Google Maps JavaScript SDK in order to render google maps on screen with the usual features and some according markers
 * @author Jake Collins
 */

export class MapContainer extends React.Component {
  constructor(props) {
    super(props)
    /**
     * mapStyles: CSS styling for the map
     * showingInfoWindow: If the user is currently looking at the Info Window
     * activeMarker: The current marker location that has been clicked by the user
     * selectedPlace: properties associated with the selected markers location (coordinates and name mainly)
     * updated: whether or not the component has been updated or not
     * locationList: List of all the locations that need to be placed on the ContactList version of the map
     */
    this.state = {
    mapStyles: {width: '100%', height: '100%'},
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    center: {},
    updated: false,
    locationsList: []
    }
  }

  componentDidMount() {
    if(this.props.lat && this.props.lng && this.props.username){ //If given a sent location from a message
      this.setState({sentLocation: {lat: this.props.lat, lng: this.props.lng, username: this.props.username}})
    } else if (this.props.locationsList) { //If given the contact list version of the map
      this.setState({locationsList: this.props.locationsList})
    } else { //If somehow either of the following were not true
      this.setState({updated: false})
    }
  }

  
  //Display the info associated with a location when clicked on
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  //Hide the info window when the map is clicked
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
      <>
      {this.state.sentLocation ? (
      <Map google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter={{lat:this.props.lat, lng: this.props.lng}}>
        
        <Marker onClick={this.onMarkerClick}
                name={`${this.state.sentLocation.username} Sent location`} position={{lat: this.state.sentLocation.lat, lng: this.state.sentLocation.lng}}/>

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
      ): (
      <>
      {this.state.locationsList.length ? (
        <Map google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter={{lat:44.873375, lng: -91.929249}}>
        {Object.keys(this.state.locationsList).map(key => 
          <Marker key={key} id={key} onClick={this.onMarkerClick} name={`${this.state.locationsList[key].postingUser} Most Recent Location`} position={{lat: this.state.locationsList[key].location.latitude, lng: this.state.locationsList[key].location.longitude}}/>)}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
      ) : (<><Map google={this.props.google}
        onClick={this.onMapClicked}
        initialCenter={{lat:44.873375, lng: -91.929249}} /></>)}
      </>)}
      </>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: mapsAPI
})(MapContainer);
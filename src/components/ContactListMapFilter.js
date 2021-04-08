import React from 'react'
import GoogleApiWrapper from './Map'
import { chatsRef, usersRef } from '../firebase'

/**
 * This class is a filter for the version of the map screen which will show only the most recent locations of the currently logged in users on the renderers contact list
 * @author Jake Collins
 */

class ContactListMapFilter extends React.Component {
  constructor(props) {
    /**
     * mounted: verification if the component has been mounted or not
     * updated: verification for if the location list has been updated to include all currently logged in contacts on the users contact list most recently sent locations
     */
    super(props)
    this.state = {
      mounted: false,
      updated: false
    }
  }

  componentDidUpdate() {
    if(this.props.userInfo.profilePicture && this.state.updated === false) {
      this.fetchMarkers(this.props.userInfo) //Fetch the appropriate on screen markers ONCE per render
      this.setState({updated: true}) //component has been updated following marker fetching
    }
  }
  //Get the markers of most recently sent locations by contacts on the currently logged in users contact list.
  fetchMarkers = async (userInfo) => {
    const database = (await chatsRef.get()).docs
    let tempMarkerStore = []
    database.forEach(doc => {
      userInfo.contactList.forEach(contact =>{
        if(doc.data().chat.chatters.toString().includes(contact)){
          doc.data().chat.messages.forEach(message => {
            if(message.userId ===  contact && message.location) {
              tempMarkerStore = [...tempMarkerStore, message]
            }
          })
        }
      })
    })
    this.setState({locationsList: tempMarkerStore}) //Store the retrieved messages with locations into state
    this.getNewestLocation(userInfo) //Filter the list to get the most recent one for each contact
  }

  getNewestLocation = async (userInfo) => {
    let tempStoreMessages = []
    userInfo.contactList.forEach(contact => {
      const currentDate = new Date()
      let newestLocation = {}
      let currentLocationMessage = {}
    this.state.locationsList.forEach((message, index) => {
      if (index === 0 && message.userId === contact) {
        newestLocation = currentDate - message.createdAt
        currentLocationMessage = message
      } else if (currentDate - message.createdAt < newestLocation && message.userId === contact) {
        newestLocation = currentDate - message.createdAt
        currentLocationMessage = message
      }
    })
    tempStoreMessages = [...tempStoreMessages, currentLocationMessage]
    })
    const usersData = await usersRef.get()
    let finalStoreMessages = []
    tempStoreMessages.forEach(message => {
      usersData.forEach(doc => {
        if(doc.data().user.uniqueId === message.userId && doc.data().user.onlineStatus) {
          finalStoreMessages = [...finalStoreMessages, message]
        }
      })
    })
    this.setState({locationsList: finalStoreMessages, mounted: true}) //Finalize the message with the locations and mount the component
  }
  render() {
    return (
      <>
      <>
      {this.state.mounted === true ? (
        <GoogleApiWrapper locationsList={this.state.locationsList}/>
      ): (<></>) }
      </>
      )}
      
      
      </>
    )
  }
}

export default ContactListMapFilter
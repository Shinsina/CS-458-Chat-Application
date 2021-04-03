import React from 'react'
import GoogleApiWrapper from './Map'
import { AuthConsumer } from './AuthContext'
import { chatsRef, usersRef } from '../firebase'

class ContactListMapFilter extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      mounted: false,
      updated: false
    }
  }

  componentDidUpdate() {
    if(this.props.userInfo.profilePicture && this.state.updated === false) {
      this.fetchMarkers(this.props.userInfo)
      this.setState({updated: true})
    }
  }

  fetchMarkers = async (userInfo) => {
    const database = (await chatsRef.get()).docs
    let tempMarkerStore = []
    database.forEach(doc => {
      // console.log(doc.data().chat.chatters.toString())
      userInfo.contactList.forEach(contact =>{
        if(doc.data().chat.chatters.toString().includes(contact)){
          // console.log(doc.data().chat.messages)
          doc.data().chat.messages.forEach(message => {
            if(message.userId ===  contact && message.location) {
              // console.log(message)
              tempMarkerStore = [...tempMarkerStore, message]
            }
          })
        }
      })
    })
    this.setState({locationsList: tempMarkerStore})
    this.getNewestLocation(userInfo)
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
    // console.log(tempStoreMessages)
    const usersData = await usersRef.get()
    let finalStoreMessages = []
    tempStoreMessages.forEach(message => {
      usersData.forEach(doc => {
        if(doc.data().user.uniqueId === message.userId && doc.data().user.onlineStatus) {
          // console.log(doc.data().user.uniqueId)
          // console.log(doc.data().user.onlineStatus)
          finalStoreMessages = [...finalStoreMessages, message]
        }
      })
    })
    this.setState({locationsList: finalStoreMessages, mounted: true})
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
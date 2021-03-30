import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import AuthContext, {AuthConsumer} from './AuthContext'
import { chatsRef, usersRef, storage} from '../firebase';
import ImageViewer from './ImageViewer'
import BotView from './BotView';

  
import firebase from 'firebase/app';
import 'firebase/firestore';
import { wait } from '@testing-library/react';

/**
 * This class is for the chat view part of the application, letting chatters chat and perform various related functions
 * @author Jake Collins
 */

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props.match.params)
        /**
         * chatId: Stores the ID of the current chat as a string
         * content: The content of the message editor
         * messages: All of the messages in the current conversation
         * schedulingMessage: Determining whether or not a chatter is trying to schedule their message for a particular time
         * months,days,years,hours,minutes,seconds,timezones: Used to fill in the select boxes found while a chatter is scheduling a message
         * updateCount: Used to determine how many times the page has been updated (This is used as a control mechanism for toggling to the scheduling a message view see componentDidUpdate lifecycle method)
         * firstUnreadMessage: Stores the location in the messages array for the first unread message sent by a user other than the current one
         * rootURL: Stores the base URL for the chatview page allowing for navigation to the first unread message to occur upon loading/refreshing the page if there is an unread message
         * mediaFile: Stores the image uploaded via the file uploader to allow the user to add and image which they can then use in a message whenever they please
         * otherChatters: Stores the unique ID's of chatters as strings so they can be used to fetch display names for the chatHeader (see chatHeader)
         * chatHeaders: String of all display names of otherChatters for use at the top of the page view 
         */
        this.state = {
            chatId: '',
            content: '',
            messages: [],
            schedulingMessage: false,
            months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'],
            days: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
            years: ['2021','2022','2023','2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036','2037','2038','2039','2040','2041','2042','2043','2044','2045','2046','2047','2048','2049','2050'],
            hours: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
            minutes:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31', '32', '33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
            seconds: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31', '32', '33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
            timezones: ['EST', 'CST', 'MST', 'PST'],
            updateCount: 0,
            firstUnreadMessage: null,
            rootUrl: '',
            mediaFile: null,
            otherChatters: [],
            chatHeader: '',
            userImages: [],
            viewingImages: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //console.log(this.state.timezone)
    }

    componentDidMount(){
        this.setState({chatId: this.props.match.params.chatId, rootUrl: window.location.href})
        this.fetchChatHeader()
        //console.log(this.state.chatId)
        //console.log(this.state.rootUrl)
        this.fetchMessages(this.props.match.params.chatId)
        //console.log(this.state.chatHeader)
        //this.deleteMessage()
    }
    componentDidUpdate(){
        //console.log(this.state.updateCount)
        //If the user is trying to schedule a message and the page hasn't yet been updated    
        if(this.state.schedulingMessage && this.state.updateCount === 0){
        //Retrieve the various select box elements to put options into
        const monthList = document.getElementById('month')
        const dayList = document.getElementById('day')
        const yearList = document.getElementById('year')
        const hourList = document.getElementById('hour')
        const minuteList = document.getElementById('minute')
        const secondList = document.getElementById('second') 
        const timezoneList = document.getElementById('timezone')
        //For each one of those select boxes fill it with the appropriate options
        this.state.months.forEach(month =>
            monthList.add(
                new Option(month, month)
            )
            )
        this.state.days.forEach(day =>
            dayList.add(
                new Option(day, day)
            )
            )
        this.state.years.forEach(year =>
            yearList.add(
                new Option(year, year)
            )
            )
        this.state.hours.forEach(hour =>
            hourList.add(
                new Option(hour, hour)
            )
            )
        this.state.minutes.forEach(minute =>
            minuteList.add(
                new Option(minute, minute)
            )
            )
        this.state.seconds.forEach(second =>
            secondList.add(
                new Option(second, second)
            )
            )
        this.state.timezones.forEach(timezone =>
            timezoneList.add(
                new Option(timezone, timezone)
            )
            )      
        }   
    }
    //When the message editor has new content do this:
    handleChange(content, editor) {
        this.setState({updateCount: 1})
        this.setState({content});

        const mentions = content.includes("@")
        if(mentions === true ){
            alert("Who you wanna mention?")
        }
      }
    //When a message is to be submitted do this:  
    handleSubmit = (e,chatter,timeToSend = new Date()) => {

        
        e.preventDefault();
        try {
        //Create a message object to store in local state array as well as in NoSQL Database
        const message = {
            content: this.state.content,
            postingUser: chatter.displayName,
            userImage: chatter.profilePicture, 
            userId: chatter.uniqueId,
            createdAt: timeToSend,
            unread: true,
            chatId: this.state.chatId
        }
        //Update the messages array and NoSQL Database (Firebase)
        this.setState({messages: [...this.state.messages, message],content: ''})
        this.fetchMessages(this.state.chatId,true)
        chatsRef.doc(this.state.chatId).update({
            'chat.messages': firebase.firestore.FieldValue.arrayUnion(message)
        })

        const comment = this.state.content.toLowerCase();
        const parse = comment.includes("!help");
        if (parse === true) {
           
           // alert("How can I help you? this still a work in progress")
            //alert(botInfo.displayName);
            //console.log(this.chatter.displayName.toString())

            this.botSubmit(e, chatter);
            
        }
    } catch(error) {
        console.log(error)
        alert('Message failed to send')
    }
      }

      botSubmit = (e, chatter, timeToSend = new Date()) => {
        e.preventDefault();
        try {
        //Create a message object to store in local state array as well as in NoSQL Database
        const message = {
            content: "\n How can I help you? \n",
            postingUser: "\n Waffle Cone BOT: \n",
            userImage: chatter.profilePicture, 
            userId: chatter.uniqueId,
            createdAt: timeToSend,
            unread: true,
            chatId: this.state.chatId
        }
        //Update the messages array and NoSQL Database (Firebase)
        this.setState({messages: [...this.state.messages, message],content: ''})
        this.fetchMessages(this.state.chatId,true)
        chatsRef.doc(this.state.chatId).update({
            'chat.messages': firebase.firestore.FieldValue.arrayUnion(message)
        })

        
    } catch(error) {
        console.log(error)
        alert('Message failed to send')
    }
      }

    //Retrieve the messages for the current chat, has optional parameter for if this is not the initial load of the page (Thus when called on subsequent times pass true over the default false)
    fetchMessages = async (chatId, updatingMessages = false) => {
        try {
            //Get the correct database document
            const chat = chatsRef.doc(chatId);
            const doc = await chat.get();
            //Update local array of messages
            this.setState({messages: doc.data().chat.messages})
            //Scroll to bottom of where the message are displayed window
            const messageArea = document.getElementById("messageArea");
            messageArea.scrollTop = messageArea.scrollHeight;
            //Look for an unread message from users other than the current user
            let firstUnread = null
            let iterator = 0
            while(firstUnread==null && iterator<=this.state.messages.length){
                //If you find an unread message do this 
                if(this.state.messages[iterator].unread===true && this.state.messages[iterator].userId !== this.props.match.params.userId && new Date(this.state.messages[iterator].createdAt.seconds * 1000) < new Date()){
                    firstUnread = iterator
                    this.setState({firstUnreadMessage: '#'+firstUnread})
                }
                iterator++
            }
            //If this is the first time loading the messages
            if(updatingMessages===false){            
            const goToFirstUnread = window.confirm("Would you like to go to the first unread message?")
            this.setState({rootUrl: this.state.rootUrl.match(/[^#]*/)[0]})
            if (goToFirstUnread) {
                window.location.href=this.state.rootUrl + this.state.firstUnreadMessage
            }
        }
        //Following checking for unread messages mark the messages read
        this.markAsRead()
        }
        catch(error) {
            console.log(error)
        }
    }

    scheduleMessage = (e,chatter) => {
                //Update the update count (as the schedule message view has already been updated)
                this.setState({updateCount: this.state.updateCount++})
                //Retrieve values for the dateString for the time the user wishes their message to be sent
                const currentMonth = document.getElementById("month")
                const currentDay = document.getElementById("day")
                const currentYear = document.getElementById("year")
                const currentHour = document.getElementById("hour")
                const currentMinute = document.getElementById("minute")
                const currentSecond = document.getElementById("second")
                const currentTimezone = document.getElementById("timezone")
                const dateString = currentDay.value +  ' ' + currentMonth.value + ' ' + currentYear.value + ' ' + currentHour.value + ':' + currentMinute.value + ':' + currentSecond.value + ' ' +  '' + currentTimezone.value + ''
                const formattedDate = new Date(dateString)
                const currentDate = new Date()
                //If the date indicates a date that has already passed
                if(formattedDate < currentDate){
                    alert('You can\'t schedule a message into the past!')
                }
                //IF the message has nothing in it
                else if (this.state.content === ''){
                    alert('The message is empty!')
                }
                //If the message has something in it and is to a future date/time
                else {
                    this.setState({schedulingMessage: !this.state.schedulingMessage})
                    this.handleSubmit(e,chatter,formattedDate)
                }
    }

    //Delete messages sent by the current user upon clicking on the message
    deleteMessage = async(messageKey) => {
        //Make sure they want to delete it
        const confirmation = window.confirm('Are you sure you would like to delete this message?')
        if (confirmation) {
        try {
            //Get the correct database document
           const chatData = await chatsRef.doc(this.props.match.params.chatId).get()
           const chatRef = chatsRef.doc(chatData.id)
           let tempStore = chatData.data().chat.messages
           let filteredTemp = []
           chatData.data().chat.messages.forEach((message,index) =>{
               //Get the correct message and remove it from the temporary local array of messages
               if(index.toString()===messageKey.key){
                   delete tempStore[index]
                   for(let i of tempStore) {
                       i && filteredTemp.push(i)
                   }
                   tempStore = filteredTemp
                   //Update database with new array of messsages
                   chatRef.update({'chat.messages': [...tempStore]})
               }
           })
           //Update the messages on screen once one has been deleted (This is a subsequent render thus passed true)
           this.fetchMessages(this.props.match.params.chatId,true)
        } catch(error) {
            console.log(error)
        }
    }
    }
    //Update the database messages to indicate a message as being read
    markAsRead = async() => {
        try {
            //Get the correct database document
            const chatData = await chatsRef.doc(this.props.match.params.chatId).get()
            const chatRef = chatsRef.doc(chatData.id)
            let tempStore = chatData.data().chat.messages
            chatData.data().chat.messages.forEach((message,index) => {
                //If a message is unread, not sent by the current user and is a visible message (Not scheduled for future viewing)
                if(message.unread === true && message.userId !== this.props.match.params.userId && new Date(message.createdAt.seconds * 1000) < new Date()) {
                    //Update the appropriate temporary local message store at the correct location
                    tempStore[index].unread = false
                }
            })
            //Update the database document
            chatRef.update({'chat.messages': [...tempStore]})
            //Update the messages on screen once messages have been marked as read (This is a subsequent render thus passed true)
            this.fetchMessages(this.props.match.params.chatId,true)
        } catch(error) {
            console.log(error)
        }
    }
    //Allow for the upload of a picture/gif/video
    uploadMedia = (media,uploader) =>{ 
        //Upload the media item
        const uploadTask = storage.ref(`/images/${media.name}`).put(media)
            uploadTask.on('state_changed', 
            (snapShot) => {
                //console.log(snapShot)
            }, (err) => {
                //console.log(err)
            }, async () => {
                //Get the URL reference to that uploaded item
                await storage.ref('images').child(media.name).getDownloadURL()
                .then(fireBaseURL => {
                   this.sendMedia(fireBaseURL,uploader)
                })
            })
        }


    sendMedia = async (URL, uploader) => {
        try{
            const userData = await usersRef
        .   where('user.uniqueId', '==', uploader.uniqueId)
            .get()
        userData.forEach(doc => {
            usersRef.doc(doc.id).update({ 'user.userImages': firebase.firestore.FieldValue.arrayUnion(URL) })
             //Indicate to the user that their media item uploaded successfully
            alert('Your media item uploaded successfully!')
        })
        } catch(error) {
            console.log(error)
        }
    
    }

    //Handle a media file being uploaded to the page to pass off to a database update function (uploadMedia)
    handleImage = (e) => {
        e.preventDefault()
        const media = e.target.files[0]
        this.setState({mediaFile: media})
    }

    //Set the chat header wtih the appropriate chatters display names
    fetchChatHeader = async () => {
        //Get the appropriate database document
        const chat = await chatsRef.doc(this.props.match.params.chatId).get()
        const currentChatters = chat.data().chat.chatters
        currentChatters.forEach(chatter => {
            //If the chatter is not the current one or the Bot account (see botInfo in AuthContext.js)
            if(chatter !== this.props.match.params.userId && chatter !== "jDODSSntxgPUk1awehVq2XmJGGv2"){
                this.setState({otherChatters: [...this.state.otherChatters, chatter]})
            }
        })
        await this.fetchDisplayNames()
    }
    //Helper function to get the appropriate display names via the otherChatters stored uniqueIds
    fetchDisplayNames = async () => {
            try {
            const userRef = await usersRef.get()
            userRef.forEach(doc => {
                //If the document includes the userID of another chatter in this conversation add it to the chatHeader state variable
                if (this.state.otherChatters.toString().includes(doc.data().user.uniqueId)) {
                    this.setState({chatHeader: this.state.chatHeader + doc.data().user.displayName + ' '})
                }
            })
            }
            catch (error) {
                console.log(error)
            }
    }
     
    //Sets route to the profile page of the chatter by whom the current chatter has clicked on the button of
    fetchUserProfile = (userId) => {
        this.props.history.push(`/ProfileScreen/${userId}`)
    }

    setUserImages = (userInfo) => {
        this.setState({userImages: userInfo.userImages, viewingImages: true})
    }

    returnToMessages = () => {
        this.setState({viewingImages: false})
    }

    render () {
        return (
            <AuthConsumer>
            {({userInfo, botInfo})=> (
            <>
            <div className="bg-gray-500 h-screen">
            <div className="h-2/3">
            <div className="bg-yellow-500 w-full"><a href='/' className="fa fa-home">Home</a></div>
            <div className="h-12 py-3 text-lg w-full bg-yellow-500"><p className="text-center">{this.state.chatHeader}</p></div>
            {/*IF the user is scheduling a message render this*/ }
            {this.state.schedulingMessage === true ? (
                <form className="h-full text-center">
                    <div>{ReactHtmlParser(this.state.content)}</div>
                    <select id="month"></select>
                    <select id="day"></select>
                    <select id="year"></select>
                    <select id="hour"></select>
                    <select id="minute"></select>
                    <select id="second"></select>
                    <select id="timezone"></select>
                    <br/>
                    <button className="" type="button" onClick={(e) => this.scheduleMessage(e,userInfo)}>Send Scheduled Message</button>
                </form>
            ) : (
            <div className="h-full overflow-y-scroll" id="messageArea">
            {/*Otherwise render the message area as normal*/}
            {Object.keys(this.state.messages).map(key => 
                <div key={key} id={key}>
                    {/*Make sure the message should be visible (not scheduled for a time in the future)*/}
                    {new Date(this.state.messages[key].createdAt.seconds * 1000) < new Date() ? (
                    <>
                    {/*If the message was sent by the current chatter*/}
                    {this.state.messages[key].userId === userInfo.uniqueId ? (
                    <div className="flex justify-end py-4">
                    {this.state.messages[key].unread ? (<p>&#10062;</p>) : (<p>&#9989;</p>)}
                    <div className="bg-yellow-500" onClick={(e) => this.deleteMessage({key})}>
                        {this.state.messages[key].postingUser}
                        {ReactHtmlParser(this.state.messages[key].content)}
                    </div>
                    <button onClick={(e)=> this.fetchUserProfile(userInfo.uniqueId)}><img src={this.state.messages[key].userImage} width="50px" height="50px" alt="Profile"></img></button>
                    </div>) 
                    : (
                    <div className="flex justify-start py-4">
                    {/*If the message wasn't sent by the current chatter*/}
                    <button onClick={(e)=> this.fetchUserProfile(this.state.messages[key].userId)}><img src={this.state.messages[key].userImage} width="50px" height="50px" alt="Profile"></img></button>
                    <div className="bg-green-500">
                        {this.state.messages[key].postingUser}
                        {ReactHtmlParser(this.state.messages[key].content)}    
                    </div>
                    {this.state.messages[key].unread ? (<p>&#10062;</p>) : (<p>&#9989;</p>)}
                    </div>
                    )}
                    </>
                    ) : (console.log(new Date(this.state.messages[key].createdAt.seconds * 1000)))}
                </div>
                )}
            </div>
    )}
    {!this.state.viewingImages ? (
            <form onSubmit={(e) => this.handleSubmit(e,userInfo)}>
            <div className="align-center text-center w-full bg-yellow-500 text-black border-black box-border border-2">
                <button className="w-1/4" type="submit">Submit</button>
                <span className="w-1/4" type="button">Upload Media Here:<input type="file" onChange={this.handleImage}/>
                    {this.state.mediaFile !== null ? (<button onClick={(e) => this.uploadMedia(this.state.mediaFile,userInfo)} type="button">Upload</button>) : (<></>)}
                </span>
                <button className="w-1/4" type="button" onClick={(e) => this.setUserImages(userInfo)}>View Your Media</button>
                <button className="w-1/4" type="button" onClick={(e) => this.setState({schedulingMessage: !this.state.schedulingMessage, updateCount: 0})}>Schedule This Message</button>
            </div>
            <span className="block h-full"><Editor value={this.state.content} init={{resize: false, plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount'],toolbar:'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'}}onEditorChange={this.handleChange} className="overflow-y-scroll w-full h-full"></Editor>
            </span>
            </form>
            ) : (<ImageViewer userImages={this.state.userImages} returnToMessages={this.returnToMessages}/>)}
            </div>
            </div>
            <div>
                Chatters in this chat:  {botInfo.displayName + "(BOT) " } {userInfo.displayName}
            </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}

export default ChatView
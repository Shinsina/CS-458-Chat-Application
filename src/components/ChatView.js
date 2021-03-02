import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
import BotView from './BotView';
  
import firebase from 'firebase/app';
import 'firebase/firestore';
import { wait } from '@testing-library/react';

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props.match.params)
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
            rootUrl: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //console.log(this.state.timezone)
    }

    componentDidMount(){
        this.setState({chatId: this.props.match.params.chatId, rootUrl: window.location.href})
        //console.log(this.state.chatId)
        //console.log(this.state.rootUrl)
        this.fetchMessages(this.props.match.params.chatId)
        //this.deleteMessage()
    }
    componentDidUpdate(){
        //console.log(this.state.updateCount)    
        if(this.state.schedulingMessage && this.state.updateCount === 0){
        const monthList = document.getElementById('month')
        const dayList = document.getElementById('day')
        const yearList = document.getElementById('year')
        const hourList = document.getElementById('hour')
        const minuteList = document.getElementById('minute')
        const secondList = document.getElementById('second') 
        const timezoneList = document.getElementById('timezone')

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
    handleChange(content, editor) {
        this.setState({updateCount: 1})
        this.setState({content});
      }
    handleSubmit = (e,chatter,timeToSend = new Date()) => {
        e.preventDefault();
        try {
        const message = {
            content: this.state.content,
            postingUser: chatter.displayName,
            userImage: chatter.profilePicture, 
            userId: chatter.uniqueId,
            createdAt: timeToSend,
            unread: true,
            chatId: this.state.chatId
        }
        this.setState({messages: [...this.state.messages, message],content: ''})
        //chatsRef.add({message})
        this.fetchMessages(this.state.chatId,true)
        chatsRef.doc(this.state.chatId).update({
            'chat.messages': firebase.firestore.FieldValue.arrayUnion(message)
        })

        var comment = this.state.content.toLowerCase();
        var parse = comment.includes("!help");
        if (parse === true) {
            alert("How can I help you? this still a work in progress")
        }
    } catch(error) {
        console.log(error)
        alert('Message failed to send')
    }
      }

    fetchMessages = async (chatId, updatingMessages = false) => {
        try {
            const chat = chatsRef.doc(chatId);
            const doc = await chat.get();
            //console.log(doc.data().messages)
            this.setState({messages: doc.data().chat.messages})
            const messageArea = document.getElementById("messageArea");
            messageArea.scrollTop = messageArea.scrollHeight;
            //console.log(this.state.messages)
            //console.log(this.props.match.params.userId)
            let firstUnread = null
            let iterator = 0
            while(firstUnread==null && iterator<=this.state.messages.length){
                //console.log(this.state.messages[iterator])
                if(this.state.messages[iterator].unread==true && this.state.messages[iterator].userId !== this.props.match.params.userId){
                    firstUnread = iterator
                    //console.log(firstUnread)
                    this.setState({firstUnreadMessage: '#'+firstUnread})
                    //console.log(this.state.firstUnreadMessage)
                    //console.log(this.state.firstUnreadMessage)
                }
                iterator++
            }
            //console.log(updatingMessages)
            if(updatingMessages===false){            
            const goToFirstUnread = window.confirm("Would you like to go to the first unread message?")
            this.setState({rootUrl: this.state.rootUrl.match(/[^#]*/)[0]})
            if (goToFirstUnread) {
                //console.log(this.state.rootUrl)
                window.location.href=this.state.rootUrl + this.state.firstUnreadMessage
            }
        }
        }
        catch(error) {
            console.log(error)
        }
    }

    scheduleMessage = (e,chatter) => {
                this.setState({updateCount: this.state.updateCount++})
                const currentMonth = document.getElementById("month")
                const currentDay = document.getElementById("day")
                const currentYear = document.getElementById("year")
                const currentHour = document.getElementById("hour")
                const currentMinute = document.getElementById("minute")
                const currentSecond = document.getElementById("second")
                const currentTimezone = document.getElementById("timezone")
                /*console.log(currentMonth.value)
                console.log(currentDay.value)
                console.log(currentYear.value)
                console.log(currentHour.value)
                console.log(currentMinute.value)
                console.log(currentSecond.value)
                console.log(currentTimezone.value)
                const event = new Date('14 Jun 2017 00:00:00 PDT');
                console.log(event.toUTCString());*/
                const dateString = currentDay.value +  ' ' + currentMonth.value + ' ' + currentYear.value + ' ' + currentHour.value + ':' + currentMinute.value + ':' + currentSecond.value + ' ' +  '' + currentTimezone.value + ''
                //console.log(dateString)
                const formattedDate = new Date(dateString)
                const currentDate = new Date()
                //console.log(formattedDate);
                //console.log(currentDate)
                if(formattedDate < currentDate){
                    alert('You can\'t schedule a message into the past!')
                }
                else if (this.state.content === ''){
                    alert('The message is empty!')
                }
                else {
                    //alert('Message Sent!')
                    this.setState({schedulingMessage: !this.state.schedulingMessage})
                    this.handleSubmit(e,chatter,formattedDate)
                }
    }

    deleteMessage = async(messageKey) => {
        //console.log(messageKey)
        const confirmation = window.confirm('Are you sure you would like to delete this message?')
        //console.log(confirmation)
        if (confirmation) {
        try {
           const chatData = await chatsRef.doc(this.props.match.params.chatId).get()
           const chatRef = chatsRef.doc(chatData.id)
           //console.log(chatRef)
           let tempStore = chatData.data().chat.messages
           let filteredTemp = []
           chatData.data().chat.messages.forEach((message,index) =>{
               if(index==messageKey.key){
                   //console.log(message)
                   delete tempStore[index]
                   for(let i of tempStore) {
                       i && filteredTemp.push(i)
                   }
                   tempStore = filteredTemp
                   chatRef.update({'chat.messages': [...tempStore]})
               }
           })
           this.fetchMessages(this.props.match.params.chatId,true)
        } catch(error) {
            console.log(error)
        }
    }
    }
      
    render () {
        return (
            
            <AuthConsumer>
            {({userInfo})=> (
            <>
            <div className="bg-gray-500 h-screen">
            <div className="h-2/3">
            <div className="h-14 text-center text-lg w-full bg-yellow-500"><p className="py-3">{this.state.chatId}</p></div>
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
            {Object.keys(this.state.messages).map(key => 
                <div key={key} id={key}>
                    {new Date(this.state.messages[key].createdAt.seconds * 1000) < new Date() ? (
                    <>
                    {this.state.messages[key].userId === userInfo.uniqueId ? (
                    <div className="flex justify-end py-4">
                    {this.state.messages[key].unread ? (<p>&#10062;</p>) : (<p>&#9989;</p>)}
                    <div className="bg-yellow-500" onClick={(e) => this.deleteMessage({key})}>
                        {this.state.messages[key].postingUser}
                        {ReactHtmlParser(this.state.messages[key].content)}
                    </div>
                    <button><img src={this.state.messages[key].userImage} width="50px" height="50px"></img></button>
                    </div>) 
                    : (
                    <div className="flex justify-start py-4">
                    <button><img src={this.state.messages[key].userImage} width="50px" height="50px"></img></button>
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
            <form onSubmit={(e) => this.handleSubmit(e,userInfo)}>
            <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-1/2" type="submit">Submit</button><button className="w-1/2" type="button" onClick={(e) => this.setState({schedulingMessage: !this.state.schedulingMessage, updateCount: 0})}>Schedule This Message</button></span>
            <span className="block h-full"><Editor value={this.state.content} init={{resize: false, plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'],
           toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'}}
            onEditorChange={this.handleChange} className="overflow-y-scroll w-full h-full"></Editor>
            </span>
            </form>
            <a href={this.state.firstUnreadMessage}>HELLO</a>
            </div>
            </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}

export default ChatView
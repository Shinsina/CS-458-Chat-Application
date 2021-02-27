import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';
import {AuthConsumer} from './AuthContext'
import { chatsRef } from '../firebase';
import BotView from './BotView';
import timezone from '../timezone'
  
import firebase from 'firebase/app';
import 'firebase/firestore';

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
            hours: ['01','02','03','04','05','06','07','08','09','10','11','12'],
            minutes:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31', '32', '33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
            seconds: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31', '32', '33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
            AMorPM: ['AM','PM'],
            timezones: timezone
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //console.log(this.state.timezone)
    }

    componentDidMount(){
        this.setState({chatId: this.props.match.params.chatId})
        //console.log(this.state.chatId)
        this.fetchMessages(this.props.match.params.chatId)
    }
    componentDidUpdate(){
        if(this.state.schedulingMessage){
        const monthList = document.getElementById('month')
        const dayList = document.getElementById('day')
        const yearList = document.getElementById('year')
        const hourList = document.getElementById('hour')
        const minuteList = document.getElementById('minute')
        const secondList = document.getElementById('second') 
        const AMorPMList = document.getElementById('AMorPM')
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
        this.state.AMorPM.forEach(AMorPM =>
            AMorPMList.add(
                new Option(AMorPM, AMorPM)
            )
            )
        this.state.timezones.forEach(timezone =>
            timezoneList.add(
                new Option(timezone.value, timezone.abbr)
            )
            )    
            
        }
    }
    handleChange(content, editor) {
        this.setState({content});
      }
    handleSubmit = (e,chatter) => {
        e.preventDefault();
        const message = {
            content: this.state.content,
            postingUser: chatter.displayName,
            userImage: chatter.profilePicture, 
            userId: chatter.uniqueId,
            createdAt: new Date(),
            unread: true,
            chatId: this.state.chatId
        }
        this.setState({messages: [...this.state.messages, message]})
        //chatsRef.add({message})
        chatsRef.doc(this.state.chatId).update({
            'chat.messages': firebase.firestore.FieldValue.arrayUnion(message)
        })

        var comment = this.state.content.toLowerCase();
        var parse = comment.includes("!help");
        if (parse === true) {
            alert("How can I help you? this still a work in progress")
        }


      }

    fetchMessages = async chatId => {
        try {
            const chat = chatsRef.doc(chatId);
            const doc = await chat.get();
            //console.log(doc.data().messages)
            this.setState({messages: doc.data().chat.messages})
           //
        }
        catch(error) {
            console.log(error)
        }
    }

    scheduleMessage = async () => {
        try  {
            let sent = false
            //while (!sent) {
                //const test = prompt('When should this message be sent? (Date should be of form MM/DD/YYYY HH:MM:SS (Timezone)', Date().toString())
                
                const currentMonth = document.getElementById("month")
                const currentDay = document.getElementById("day")
                const currentYear = document.getElementById("year")
                const currentHour = document.getElementById("hour")
                const currentMinute = document.getElementById("minute")
                const currentSecond = document.getElementById("second")
                const currentAMorPM = document.getElementById("AMorPM")
                const currentTimezone = document.getElementById("timezone")
                console.log(currentMonth.value)
                console.log(currentDay.value)
                console.log(currentYear.value)
                console.log(currentHour.value)
                console.log(currentMinute.value)
                console.log(currentSecond.value)
                console.log(currentAMorPM.value)
                console.log(currentTimezone.value)
                const event = new Date('14 Jun 2017 00:00:00 PDT');
                console.log(event.toUTCString());
                const dateString = currentDay.value +  ' ' + currentMonth.value + ' ' + currentYear.value + ' ' + currentHour.value + ':' + currentMinute.value + ':' + currentSecond.value + ' ' +  '' + currentTimezone.value + ''
                console.log(dateString)
                const formattedDate = new Date(dateString)
                console.log(formattedDate);
                console.log(new Date())
                //console.log(dateString.toISOString());
                //const parseDate = Date.parse(dateString)
                //const setDate = new Date(parseDate).toUTCString()
                //console.log(setDate)
                //console.log(Date().toUTCString())
                /*if (setDate == 'Invalid Date') {
                    sent = false;
                }
                else {
                    sent = true;
                }*/
            //}
        } catch (error) {

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
                    <select id="month">

                    </select>
                    <select id="day">

                    </select>
                    <select id="year">

                    </select>
                    <select id="hour">

                    </select>
                    <select id="minute">

                    </select>
                    <select id="second">

                    </select>
                    <select id="AMorPM">

                    </select>
                    <select id="timezone">

                    </select>
                    <br/>
                    <button className="" type="button" onClick={(e) => this.scheduleMessage()}>Schedule This Message</button>
                </form>
            ) : (
            <div className="h-full overflow-y-scroll">
            {Object.keys(this.state.messages).map(key => 
                
                <div key={key}>
                    {this.state.messages[key].userId === userInfo.uniqueId ? (
                    <div className="flex justify-end py-4">
                    <div className="bg-yellow-500">{ReactHtmlParser(this.state.messages[key].content)}</div>
                    </div>) 
                    : (
                    <div className="flex justify-start py-4">
                    <div className="bg-green-500">{ReactHtmlParser(this.state.messages[key].content)}</div>
                    </div>
                    )}
                    
                </div>
                )}
            </div>
    )}
            <form onSubmit={(e) => this.handleSubmit(e,userInfo)}>
            <span className="block text-center w-full bg-yellow-500 text-black"><button className="w-1/2" type="submit">Submit</button><button className="w-1/2" type="button" onClick={(e) => this.setState({schedulingMessage: !this.state.schedulingMessage})}>Schedule This Message</button></span>
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
            </div>
            </div>
            </>
                )}
            </AuthConsumer>
        )
    }
}

export default ChatView
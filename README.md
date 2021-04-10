# For information regarding initializing the project in a development environment see CreateReactApp.md

## FaceChat Project Overview (How things work and how things are set up)

FaceChat is built using React, Tailwind and Firebase (for database features and authentication)

It is laid out in a fashion that caters it to learning these technologies so if you are unfamiliar with how any of these work it would be simple to pick up and build upon in its features.

App.js houses the routes to all the various page views within the application, this gives you an idea of how to navigate to a particular page or variations of it (in particular for the map view)

index.js is the root of the project and what actually mounts the project to the browser.

NOTE: There is an additional file within the root of the source folder by the name of firebase.js which is not present in the repository for this project as it houses environment variables, if you are looking to further develop on this project and would like access to the pre-existing API key's and database email: shinsina@att.net

The remaining files within the root of the source folder are generated or unused.

If you are interested in seeing the list of dependencies for this application please consult package.json

### Getting into the actual components now

### AuthContext.js

 Utilizes the React Context API to provide various data and functions to other parts of the application the documentation within the file itself should do a decent job at explaining what is going on in here however it should be noted that many of the functions are "asking for" userId's this should be user.uniqueId from the database in all cases. You can see an example of this in botId as the bot is registered as just a regular user like anyone else. Almost every part of the application utilizes AuthContext (through AuthConsumer) in order to perform various functions.

### BotView.js

 Currently unutilized component but is intended to be used as a screen to show users the various commands and information associated with the bot itself. This will let users be able to interact with the bot as they need/see fit and get a better idea as to how to utilize the application itself.

### ChatView.js

Contains the bulk of the features of the application, it includes the chat header indicating who you are speaking with within the given conversation (currently one on one conversations are the only ones supported but this could be expanded to support multiple users in a single conversation and if tweaked/added allow for the conversation name to be changed to whatever the users decide to set it to). It includes a scheduling message window that will allow the chatter to schedule a message for anytime between now (present day) until the end of the year 2050 for the 4 continental US timezones (this was not built to account for daylight savings time but this could very well be expanded by adding those abbreviations to the state variable 'timezones'). The messages view is present in the center of the screen upon loading and will have the current chatters messages on the right and anyone elses on the left, each message will contain indicators alongside it indicating whether or not a message was read or not as well as if the message contains a sent location within it. The right side of each message contains a button with the chatters profile image that when clicked will navigate the chatter to that chatters profile. Above each message will have that chatters display name indicating who sent the message. Lastly if a message sent by the currently logged in chatter is clicked they will be asked if they would like to delete it or not. Below the message window are buttons to perform various functions within the chat view including, send message, upload media items, view uploaded media items via the Image Viewer component, schedule a message and lastly send the chatters location (which as stated previously will be included in a subsequently sent message by the chatter). Going further down the screen there is the message creation window on the left and the Giphy library integration which allows users to search for gifs and be given a URL which they can integrate into a message via adding an image to their message. The last feature of note is that if the conversation is loaded and contains unread messages for the currently logged in chatter they will be asked if they would like to go to the first unread message by which if they do will scroll the messages area to that first unread message and make all unread messages in the conversation as read This section of the application is largely feature complete aside from group conversations and adjusting conversation names, obviously nothing is ever truly finished but this largely accomplished the original vision for the project.

### ContactListMapFilter.js

This contains functions that filter through all sent messages by the currently logged in chatters contacts that contain a sent location filters them down to only the most recently sent ones by chatters who are on their contact list and online. This is then passed into the Map component in order to render the respective markers on screen with the chatters display name and location attached to each one.

### ContactListMapWrapper.js

This allows for the contactListMapFilter to have access to the local version of the currently logged in chatters info (userInfo) which is well documented as it is a carbon copy of their database object (it is outlined in the application side itself inside of AuthContext.js). This information is used to filter the messages correctly for the Contact List version of the map.

### ContactScreen.js 

This is the screen for adding contacts to the currently logged in chatters contact list in their respective database object. It will also allow for the user to go to any conversations they have with a contact already on their contact list or anyone they additionally add to their contact list. It will display the currently logged in chatters uniqueId so that they can share it with other users so they can add each other to their respective contact list. The in-file documentation reveals the remaining details of what has been implemented on that particular screen up to the point of this being written.

### ContactScreenWrapper.js

Due to needing access to userInfo within the componentDidMount() lifecycle method much like both the Map and Profile Screen this provides that data to the Contact Screen component.

### CurrentLocationMapFilter.js

This component is only called upon being routed to by when a chatter clicks on a indicator that the message contains a location and they wish to proceed to view that location. It takes the URL props of a display name, latitude and longitude and renders a marker on the Map showing that display name at the latitude and longitude.

### ImageViewer.js

This component/view currently takes the props of userInfo (currently logged in chatters info), a function called returnToMessages() that makes it so the message and gif windows are put back in the location that the Image Viewer hijacked in order to appear in the Chat View and lastly the colorScheme by which decides the colors that the Image Viewer should be rendered (see AuthContext.js state). It allows users to click on a respective image they have uploaded and receive a URL to it by which they can copy and paste into the image section of the message creation window in order to send it within a message.

### LogInScreen.js

This is the screen that will greet a chatter if they are not currently logged in or signed up for FaceChat. It includes simple text fields for an email and password to log chatters in and if they need to sign up it will also render a file to optionally upload a profile picture as well as enter in a display name to use throughout the application. It utilizes Firebase authentication in order to verify legit credentials to get into the application and will warn users if information is incorrect.

### MainScreen.js

This is the main screen or homepage for FaceChat by which stories containing either images or videos can be uploaded and the most recent of the uploads will be visible within the header of the screen. It includes a button to create a new conversation (currently creating a conversation with the account going by Jacob Collins) as well as buttons to navigate to the contacts screen (currently unattached/nonfunctional at time of writing), navigating to the profile screen of the currently logged in chatter allowing them to adjust various settings (see ProfileScreen.js), a button to go to the bot view page and a button to log out. Additionally it will show buttons for every conversation the user is in alongside a button to delete that conversation, additionally if that conversation has unread messages it will indicate the number of unread messages in the conversation and when clicked with alert the user of who sent the message and what it says for each message marking them as read within the database.

### Map.js

This simply implements the Google Maps JavaScript SDK allowing for various different maps to be rendered these are better described in the explanations for other files containing Map however it is worth noting that much of this component relies on conditional rendering which allows for this component to be reused in the currently 2 different situations it is being used (sent location and all logged in contacts mostly recently sent locations of the currently logged in chatter).

### Parser.js

Currently Empty at time of writing.

### ProfileScreen.js

Renders out a profile screen for either the currently logged in chatter or a chatter other than the current one using conditional rendering. If it is the profile of the currently logged in chatter this page will allow them to view their display name and profile picture as well as edit their activity status, additionally there are buttons to toggle dark mode and location services, go to their contacts page as well as their block list page (those last 3 buttons are currently non-functional and the block list page has yet to be created). If it is a different chatters profile the chatter that is logged in is given the ability to see that chatters display name, profile picture and activity status as well as go to any conversation they have with this particular chatter alongside blocking or unblocking this chatter and add them to their contact list. (Again at time of writing many of these buttons/features do not exist)

### ProfileScreenRenderer.js

Performs the same function as ContactScreenWrapper.js and ContactListMapWrapper.js (see those overviews for details)
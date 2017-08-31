import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import io from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';

//const USER_ID = '@userId';


export default class Chat extends Component {
    constructor(props) {
      super(props);

      this.state = {
        messages: [],
        userId: null
      };
      //this.determineUser = this.determineUser.bind(this);
      this.onReceivedMessage = this.onReceivedMessage.bind(this);
      this.onSend = this.onSend.bind(this);
      this._storeMessages = this._storeMessages.bind(this);
      
      //this.determineUser();
    }

    componentDidMount() {
      this.socket = io('http://192.168.56.1:3000');
      this.socket.on('message', this.onReceivedMessage);
      console.log('Component did mount entered');
    }


    // determineUser() {
    //   AsyncStorage.getItem(USER_ID)
    //     .then((userId) => {
    //       // If there isn't a stored userId, then fetch one from the server.
    //       if (!userId) {
    //         this.socket.emit('userJoined', null);
    //         this.socket.on('userJoined', (userId) => {
    //           AsyncStorage.setItem(USER_ID, userId);
    //           this.setState({ userId });
    //         });
    //       } else {
    //         this.socket.emit('userJoined', userId);
    //         this.setState({ userId });
    //       }
    //     })
    //     .catch((e) => alert(e));
    // }
  

    onReceivedMessage(messages=[]) {
      console.log('Message was recieved', messages);
      this._storeMessages(messages);
    }

    onSend(messages=[]) {
      console.log('Onsend messages ', messages);
      this.socket.emit('message', messages[0]);
      this._storeMessages(messages);
    }

    render() {
      var user = { _id: 1 || -1 };
      return (
          <GiftedChat
              messages={this.state.messages}
              onSend={this.onSend}
              user={user}
          />
      );
    }

    _storeMessages(messages) {   
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages)
        };
      });
    }
}
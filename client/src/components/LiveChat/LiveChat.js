import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalMessage, fetchListOfHeadphones } from '../../actions';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './LiveChat.css';

class LiveChat extends React.Component {
   state = {
      messages: null,
      headphoneNamesWithRegex: null
   };
   componentDidMount() {
      if (!this.props.headphones) {
         this.props.fetchListOfHeadphones();
      }
      this.fetchChatMessages();
      //Automatically refresh the livechat every 5 seconds
      this.intervalId = setInterval(() => this.fetchChatMessages(), 5000);
   }
   componentWillUnmount() {
      clearInterval(this.intervalId);
   }
   componentDidUpdate() {
      if (this.props.headphones && !this.state.headphoneNamesWithRegex) {
         this.convertHeadphoneNamesToRegex();
      }
      return null;
   }

   //Fetch the latest chat messages from the database
   fetchChatMessages = async () => {
      try {
         const response = await axios.get('/chat');
         this.setState({ messages: response.data });
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };
   renderChatMessages() {
      const { messages } = this.state;
      if (!messages) {
         return null;
      }

      return messages.map(message => (
         <ChatMessage
            key={message._id}
            message={message}
            //Pass headphone names and their respective regex down to ChatMessage component
            headphoneNamesWithRegex={this.state.headphoneNamesWithRegex ? this.state.headphoneNamesWithRegex : null}
         />
      ));
   }
   convertHeadphoneNamesToRegex() {
      if (!this.props.headphones) {
         return null;
      }
      const headphoneNamesWithRegex = this.props.headphones.map(headphone => {
         //Formulating Regular Expression
         var model = headphone.model;
         //Separate the alternative naming from model
         const alternative = /\((.*)\)/.exec(model);
         model = model.replace(/\s\(.*\)/g, '');
         model = model.replace(/(-|\s)/g, '');
         //Phrase matches if it contains all of the words from the model, regardless of the whitespaces in between
         const allModelWords = model.split('').join('.?');
         //Phrase also matches if it contains the exact string from the model or alternative naming
         if (alternative) {
            var requirement = `(${allModelWords}|${alternative[1]})`;
         } else {
            var requirement2 = `(${allModelWords})`;
         }
         //Churn out the regular expression and flag it to be case insensitive
         const regExp = new RegExp(requirement ? requirement : requirement2, 'i');
         return { regex: regExp, entry: headphone };
      });
      this.setState({ headphoneNamesWithRegex });
   }
   render() {
      return (
         <div className="live-chat">
            <div className="live-chat__title">LIVE CHAT</div>
            {this.renderChatMessages()}
            {/* Pass callback as a prop to ChatInput so that it can invoke fetchChatMessages after user posts a chat message */}
            <ChatInput fetchChatMessages={this.fetchChatMessages} />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { headphones: state.listOfHeadphones };
};
export default connect(
   mapStateToProps,
   { addGlobalMessage, fetchListOfHeadphones }
)(LiveChat);

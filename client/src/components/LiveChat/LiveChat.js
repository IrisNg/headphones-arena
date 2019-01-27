import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchListOfHeadphones, addGlobalError } from '../../actions';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './LiveChat.css';

class LiveChat extends React.Component {
   state = {
      messages: null
   };
   componentDidMount() {
      if (this.props.headphones.length === 0) {
         //Grab list of headphone names from server ONLY IF it has not been fetched before
         this.props.fetchListOfHeadphones();
      }
      this.fetchChatMessages();
      //Automatically refresh the livechat every 5 seconds
      this.intervalId = setInterval(() => this.fetchChatMessages(), 5000);
   }
   componentWillUnmount() {
      clearInterval(this.intervalId);
   }
   //Fetch the latest chat messages from the database
   fetchChatMessages = async () => {
      try {
         const response = await axios.get('/chat');
         this.setState({ messages: response.data });
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   renderChatMessages(messages) {
      //Reverse the array order such that the newest message is at the bottom
      messages.reverse();
      return messages.map(message => (
         <ChatMessage
            key={message._id}
            message={message}
            //Pass headphone names and their respective regex down to ChatMessage component
            headphoneNamesWithRegex={this.convertHeadphoneNamesToRegex()}
         />
      ));
   }
   convertHeadphoneNamesToRegex() {
      if (this.props.headphones.length > 0) {
         return this.props.headphones.map(headphone => {
            //Formulating Regular Expression
            var model = headphone.model;
            //Separate the alternative naming from model
            var alternative = /\((.*)\)/.exec(model);
            model = model.replace(/\s\(.*\)/g, '');
            //Phrase matches if it contains all of the words from the model, regardless of the whitespaces in between
            var allModelWords = model.split(' ').join('\\s*');
            //Phrase also matches if it contains the exact string from the model or alternative naming
            if (alternative) {
               var requirement = `(${allModelWords}|${alternative[1]})`;
            } else {
               var requirement2 = `(${allModelWords})`;
            }
            //Churn out the regular expression and flag it to be case insensitive
            var regExp = new RegExp(requirement ? requirement : requirement2, 'i');
            return { regex: regExp, entry: headphone };
         });
      }
      return null;
   }
   render() {
      const { messages } = this.state;
      return (
         <div className="live-chat">
            {messages ? this.renderChatMessages(messages) : null}
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
   { fetchListOfHeadphones, addGlobalError }
)(LiveChat);

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalError } from '../../actions';

class ChatInput extends React.Component {
   state = {
      message: '',
      //Randomly generate name for user
      author: `Anonymous${Math.floor(Math.random() * (999 - 1)) + 1}`,
      authorId: ''
   };
   static getDerivedStateFromProps(nextProps, prevState) {
      //Use Username as author if user is currently signed in
      if (nextProps.currentUser && prevState.author.includes('Anonymous')) {
         return { author: nextProps.currentUser.username, authorId: nextProps.currentUser.id };
      }
      return null;
   }
   postMessage = async () => {
      //Format object to be posted to server
      const postObj = {
         message: this.state.message,
         author: { username: this.state.author, id: this.state.authorId }
      };
      try {
         //Post message to server
         const response = await axios.post('/chat', postObj);
         console.log(response.data);
         // Empty stored message
         this.setState({ message: '' }, () => {
            //Invoke callback to refetch chat messages from server
            this.props.fetchChatMessages();
         });
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   render() {
      return (
         <div className="chat-input">
            {/* Message */}
            <div className="chat-input__fields">
               <textarea
                  className="chat-input__message"
                  value={this.state.message}
                  onChange={event => this.setState({ message: event.target.value })}
                  onKeyPress={event => (event.key === 'Enter' ? this.postMessage() : null)}
               />
               {/* Author */}
               <input
                  className="chat-input__author"
                  type="text"
                  value={this.state.author}
                  onChange={e => this.setState({ author: e.target.value })}
               />
               <i className="far fa-caret-square-right chat-input__button" onClick={this.postMessage} />
            </div>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { addGlobalError }
)(ChatInput);

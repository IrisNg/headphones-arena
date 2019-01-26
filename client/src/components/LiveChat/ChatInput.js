import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

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
      const postObj = { message: this.state.message, author: { username: this.state.author, id: this.state.authorId } };
      //Post message to server
      const response = await axios.post('/chat', postObj);
      console.log(response.data);
      this.props.fetchChatMessages();
   };
   render() {
      return (
         <div className="chat-input">
            {/* Message */}
            <textarea value={this.state.message} onChange={e => this.setState({ message: e.target.value })} />
            {/* Author */}
            <input type="text" value={this.state.author} onChange={e => this.setState({ author: e.target.value })} />
            <button onClick={this.postMessage}>Send</button>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(mapStateToProps)(ChatInput);

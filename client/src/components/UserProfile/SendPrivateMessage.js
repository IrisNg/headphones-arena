import React from 'react';
import { connect } from 'react-redux';
import Login from '../Authentication/Login';
import axios from 'axios';

class SendPrivateMessage extends React.Component {
   state = {
      subject: '',
      message: '',
      replyTo: null
   };
   //Load previous private message data if this is the owner trying to make a reply back to the sender
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.replyTo && !prevState.replyTo) {
         return {
            replyTo: { ...nextProps.replyTo },
            subject: nextProps.replyTo.subject.includes('RE:')
               ? nextProps.replyTo.subject
               : `RE: ${nextProps.replyTo.subject}`
         };
      }
      return null;
   }
   //Render sender's username if this is the owner replying
   renderReplyDetails = () => {
      const { fromUsername } = this.state.replyTo;
      return (
         <div>
            <div>Replying to {fromUsername}</div>
         </div>
      );
   };
   //Post private message to the server
   postPrivateMessage = async () => {
      //Format object to be posted to the server
      const postObj = {
         toUserId: this.state.replyTo ? this.state.replyTo.fromUserId : this.props.userId,
         body: {
            subject: this.state.subject,
            message: this.state.message,
            fromUsername: this.props.currentUser.username,
            fromUserId: this.props.currentUser.id
         }
      };
      const response = await axios.post(`/user-profile/message`, postObj);
      console.log(response);
      //Then turn off this interface
      this.props.turnOff();
   };
   render() {
      return (
         <div>
            {/* Make user log in if he is not */}
            {!this.props.currentUser ? <Login /> : null}
            {/* Render sender's username if this is a reply */}
            {this.state.replyTo ? this.renderReplyDetails() : null}
            {/* Subject */}
            <input type="text" value={this.state.subject} onChange={e => this.setState({ subject: e.target.value })} />
            {/* Message content */}
            <input type="text" value={this.state.message} onChange={e => this.setState({ message: e.target.value })} />
            <button onClick={this.postPrivateMessage}>Send</button>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};

export default connect(mapStateToProps)(SendPrivateMessage);

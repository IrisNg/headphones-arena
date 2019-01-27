import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addGlobalError } from '../../actions';
import Login from '../Authentication/Login';

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
   renderReplyUsername = () => {
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
      //Check for required fields
      if (!this.state.subject || !this.state.message) {
         this.props.addGlobalError(
            'Your message needs a subject and some content... Do not become a spammer...Or Else.'
         );
      } else {
         try {
            //Post private message
            const response = await axios.post(`/user-profile/${this.props.profileId}/message`, postObj);
            console.log(response);
            //Then turn off this interface when done
            this.props.turnOff();
         } catch (err) {
            this.props.addGlobalError(err.response.data);
         }
      }
   };
   render() {
      return (
         <div>
            {/* Make user log in if he is not */}
            {!this.props.currentUser ? <Login /> : null}
            {/* Render sender's username if this is a reply */}
            {this.state.replyTo ? this.renderReplyUsername() : null}
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

export default connect(
   mapStateToProps,
   { addGlobalError }
)(SendPrivateMessage);

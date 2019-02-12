import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addGlobalMessage, askLogin } from '../../actions';

class SendPrivateMessage extends React.Component {
   state = {
      subject: '',
      message: '',
      replyTo: null
   };
   //Load previous private message data if this is the owner trying to make a reply back to the sender
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.replyTo !== prevState.replyTo) {
         if (!nextProps.replyTo) {
            return { replyTo: null, subject: '' };
         }
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
      if (!this.state.replyTo) {
         return null;
      }
      const { fromUsername } = this.state.replyTo;
      return (
         <div>
            <div>Replying to {fromUsername}</div>
         </div>
      );
   };
   //Post private message to the server
   postPrivateMessage = async () => {
      const { replyTo, subject, message } = this.state;
      const { currentUser, userId } = this.props;
      //Get user to log in if he is not
      if (!currentUser) {
         this.props.askLogin(true);
      } else if (!subject || !message) {
         //Check for required fields
         this.props.addGlobalMessage(
            'Your message needs a subject and some content... Do not become a spammer...Or Else. *insert angry face*'
         );
      } else {
         //Format object to be posted to the server
         const postObj = {
            //Recipient's userId
            //If current user is the owner of the profile trying to reply back to a sender, then use the sender's userId
            //If current user is NOT the owner of the profile but trying to send a message to the owner, then use the owner's userId
            toUserId: replyTo ? replyTo.fromUserId : userId,
            body: {
               subject: subject,
               message: message,
               fromUsername: currentUser.username,
               fromUserId: currentUser.id
            }
         };
         try {
            //Post private message
            //profileId params here refers to the owner's user profile Id, just a route, does not matter much
            const response = await axios.post(`/user-profile/${this.props.profileId}/message`, postObj);
            console.log(response);
            this.props.addGlobalMessage('Private message has been sent. ssshhh ...');
            this.setState({ message: '' }, () => {
               //Then invoke callback to empty the reply details in the parent component too
               this.props.emptyReplyDetails();
            });
         } catch (err) {
            this.props.addGlobalMessage(err.response.data);
         }
      }
   };

   render() {
      const { isOwner } = this.props;
      const { replyTo } = this.state;
      if (isOwner && !replyTo) {
         return <div />;
      }
      return (
         <div>
            {/* Render sender's username if this is a reply */}
            {this.renderReplyUsername()}
            {/* Subject */}
            <input type="text" value={this.state.subject} onChange={e => this.setState({ subject: e.target.value })} />
            {/* Message content */}
            <input type="text" value={this.state.message} onChange={e => this.setState({ message: e.target.value })} />
            {/* Send button */}
            <div onClick={this.postPrivateMessage}>Send!</div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { addGlobalMessage, askLogin }
)(SendPrivateMessage);

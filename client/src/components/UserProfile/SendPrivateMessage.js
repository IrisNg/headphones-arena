import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addGlobalMessage, askLogin } from '../../actions';

class SendPrivateMessage extends React.Component {
   state = {
      subject: '',
      message: '',
      replyMessageId: '',
      replyTo: null
   };
   //Load previous private message data if this is the owner trying to make a reply back to the sender
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.replyTo && nextProps.replyTo._id !== prevState.replyMessageId) {
         return {
            replyMessageId: nextProps.replyTo._id,
            replyTo: { ...nextProps.replyTo },
            message: '',
            subject: nextProps.replyTo.subject.includes('RE:')
               ? nextProps.replyTo.subject
               : `RE: ${nextProps.replyTo.subject}`
         };
      } else if (!nextProps.replyTo && prevState.replyMessageId) {
         return { replyTo: null, subject: '', replyMessageId: '' };
      }
      return null;
   }
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
            this.setState({ message: '', subject: '' }, () => {
               //Then invoke callback to empty the reply details in the parent component too
               this.props.emptyReplyDetails();
            });
         } catch (err) {
            this.props.addGlobalMessage(err.response.data);
         }
      }
   };

   render() {
      const { isOwner, ownerUsername } = this.props;
      const { replyTo } = this.state;
      if (isOwner && !replyTo) {
         return <div />;
      }
      return (
         <div className="send-pm">
            {/* Subject */}
            <input
               type="text"
               className="send-pm__subject"
               value={this.state.subject}
               onChange={e => this.setState({ subject: e.target.value })}
               placeholder="Subject"
            />
            {/* Message content */}
            <textarea
               className="send-pm__message"
               value={this.state.message}
               onChange={e => this.setState({ message: e.target.value })}
               placeholder={!replyTo ? `Send a message @${ownerUsername}` : `Reply a message @${replyTo.fromUsername}`}
            />
            {/* Send button */}
            <div className="send-pm__button-container">
               <div onClick={this.postPrivateMessage} className="send-pm__send-button">
                  Send !
               </div>
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
   { addGlobalMessage, askLogin }
)(SendPrivateMessage);

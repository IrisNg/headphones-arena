import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { redirectToMainPost } from '../../actions';
import history from '../../history';
import AvatarUpload from './AvatarUpload';
import PersonalHeadphones from './PersonalHeadphones';
import SendPrivateMessage from './SendPrivateMessage';

class PageContent extends React.Component {
   state = {
      replyTo: null,
      userId: ''
   };
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.userId !== prevState.userId) {
         return {
            replyTo: null,
            userId: nextProps.userId
         };
      }
   }
   //Render posts created by this User
   renderPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            {/* If user clicks on the title of this post, redirect to this post's show page */}
            <h3 onClick={() => this.props.redirectToMainPost(post)} className="page-content__post-title">
               {post.title}
            </h3>
            <p>{post.content.substring(0, 100)}</p>
            <div>
               <span>Votes {post.vote.count} </span>
               {/* Date */}
               <Moment fromNow>{post.created}</Moment>
            </div>
            {/* Edit button (If current user is the owner) */}
            {this.renderEditButton(post)}
         </div>
      ));
   }
   //Render edit button for posts if user is owner
   renderEditButton(post) {
      const { currentUser } = this.props;
      if (!currentUser || post.author.id !== currentUser.id) {
         return null;
      }
      return <i className="fas fa-edit" onClick={() => history.push(`/edit-post/${post._id}`)} />;
   }

   renderMessagesPage() {
      const { replyTo } = this.state;
      const {
         isOwner,
         profile: { userId, _id, username }
      } = this.props;
      return (
         <div>
            {/* Interface to send private message to the owner or reply to the sender*/}
            <SendPrivateMessage
               userId={userId}
               profileId={_id}
               emptyReplyDetails={this.emptyReplyDetails}
               replyTo={replyTo}
               isOwner={isOwner}
               ownerUsername={username}
            />
            {/* Received private messages */}
            <div className="page-content__messages">{this.renderReceivedPrivateMessages()}</div>
         </div>
      );
   }
   //Render private messages received by this user
   //Current user can only see this if he is the owner of this profile
   renderReceivedPrivateMessages = () => {
      const { privateMessages } = this.props.profile;
      return privateMessages.map(message => {
         return (
            <div key={message._id} className="page-content__message">
               {/* Subject */}
               <h4 className="page-content__message-subject">{message.subject}</h4>
               {/* Content*/}
               <p className="page-content__message-content">{message.message}</p>
               <div className="page-content__message-metadata">
                  {/* Sender's username */}
                  {/* Redirect to sender's profile page if owner clicks on the sender's username */}
                  <h5
                     className="page-content__message-username"
                     onClick={() => {
                        history.push(`/user/${message.fromUserId}`);
                     }}
                  >
                     From {message.fromUsername}
                  </h5>
                  {/* Reply icon */}
                  {/* Clicking on this reply icon will allow owner to send a private message back to the sender */}
                  <i
                     className="fas fa-reply page-content__message-reply"
                     onClick={() =>
                        this.setState({
                           replyTo: { ...message }
                        })
                     }
                  />
               </div>
            </div>
         );
      });
   };
   //Callback to empty replyTo after private message is sent
   emptyReplyDetails = () => {
      this.setState({ replyTo: null });
   };
   render() {
      const {
         isOwner,
         page,
         profile: { headphones, _id, posts },
         fetchUserProfile
      } = this.props;
      return (
         <div className="page-content">
            <div className="page-content__page-title">{page}</div>
            {/* Interface to re-upload avatar picture */}
            {page === 'avatar' ? (
               <AvatarUpload profileId={_id} fetchUserProfile={fetchUserProfile} userId={this.state.userId} />
            ) : null}
            {/* Personal headphones preferences */}
            {page === 'ratings' ? (
               <PersonalHeadphones headphones={headphones} profileId={_id} isOwner={isOwner} />
            ) : null}
            {/* Posts created by the User */}
            {page === 'posts' ? this.renderPosts(posts) : null}
            {/* Private messages */}
            {page === 'messages' ? this.renderMessagesPage() : null}
         </div>
      );
   }
}

export default connect(
   null,
   { redirectToMainPost }
)(PageContent);

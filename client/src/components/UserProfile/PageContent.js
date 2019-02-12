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
         profile: { userId, _id }
      } = this.props;
      return (
         <div>
            {/* Received private messages */}
            {this.renderReceivedPrivateMessages()}
            {/* Interface to send private message to the owner or reply to the sender*/}
            <SendPrivateMessage
               userId={userId}
               profileId={_id}
               emptyReplyDetails={this.emptyReplyDetails}
               replyTo={replyTo}
               isOwner={isOwner}
            />
         </div>
      );
   }
   //Render private messages received by this user
   //Current user can only see this if he is the owner of this profile
   renderReceivedPrivateMessages = () => {
      const { privateMessages } = this.props.profile;
      return privateMessages.map(message => {
         return (
            <div key={message._id}>
               <h3>{message.subject}</h3>
               {/* Redirects to sender's profile page if user clicks on the sender's username */}
               <h6
                  onClick={() => {
                     history.push(`/user/${message.fromUserId}`);
                  }}
               >
                  From {message.fromUsername}
               </h6>
               {/* Clicking on this reply icon will allow owner to send a private message back to the sender */}
               <i
                  className="fas fa-reply"
                  onClick={() =>
                     this.setState({
                        replyTo: { ...message }
                     })
                  }
               />
               <p>{message.message}</p>
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

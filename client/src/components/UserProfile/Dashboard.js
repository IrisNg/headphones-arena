import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { fetchUserProfile, redirectToMainPost, askLogin } from '../../actions';
import history from '../../history';
import AvatarUpload from './AvatarUpload';
import PersonalHeadphones from './PersonalHeadphones';
import SendPrivateMessage from './SendPrivateMessage';
import LiveChat from '../LiveChat/LiveChat';
import './Dashboard.css';

class Dashboard extends React.Component {
   state = {
      page: 'ratings',
      privateMessageActive: false,
      replyTo: null,
      isOwner: null,
      userId: ''
   };
   //Fetch this user profile data
   componentDidMount() {
      this.setState({ userId: this.props.match.params.id }, () =>
         this.props.fetchUserProfile(this.props.match.params.id)
      );
   }
   //If current user owner clicks on a sender's username it will cause params in url to change but page does not reload cause it is technically showing the same component
   //So have to manually refresh, refetch profile data and reset state
   static getDerivedStateFromProps(nextProps, prevState) {
      //This checks if the currently displayed profile data's id is the same as the id in the url params
      if (prevState.userId !== nextProps.match.params.id) {
         nextProps.fetchUserProfile(nextProps.match.params.id);
         return { isOwner: null };
      }
      return null;
   }
   componentDidUpdate() {
      this.checkAuthorization();
   }
   //Check if user is logged in, and if user is the owner of this profile
   checkAuthorization = () => {
      if (this.state.isOwner === null && this.props.currentUser) {
         this.props.currentUser.id === this.props.match.params.id
            ? this.setState({ isOwner: true, userId: this.props.match.params.id })
            : this.setState({ isOwner: false, userId: this.props.match.params.id });
      }
   };
   //Render anonymous avatar if owner did not set a custom avatar
   renderAvatar(picture) {
      return picture ? picture : 'https://i.imgur.com/bwWPvQ9.jpg';
   }
   //Render posts created by this User
   renderPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            {/* If user clicks on the title of this post, redirect to this post's show page */}
            <h3 onClick={() => this.props.redirectToMainPost(post)} className="dashboard__post-title">
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
      return currentUser && post.author.id === currentUser.id ? (
         <i className="fas fa-edit" onClick={() => history.push(`/edit-post/${post._id}`)} />
      ) : null;
   }

   renderMessagesPage() {
      const { isOwner, privateMessageActive, replyTo } = this.state;
      const { privateMessages, userId, _id } = this.props.profile;
      if (!this.state.page === 'messages') {
         return null;
      }
      return (
         <div>
            {/* Private messages */}
            {this.renderReceivedPrivateMessages(privateMessages)}
            {/* Button to private message the owner of this profile */}
            {!isOwner ? <i className="fas fa-envelope" onClick={this.activatePrivateMessage} /> : null}
            {/* Interface to send private message to the owner or reply to the sender*/}
            {privateMessageActive ? (
               <SendPrivateMessage userId={userId} profileId={_id} turnOff={this.turnOffInterfaces} replyTo={replyTo} />
            ) : null}
         </div>
      );
   }
   //Render private messages sent to this user
   //Current user can only see this if he is the owner of this profile
   renderReceivedPrivateMessages = privateMessages => {
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
               {/* Clicking on this reply icon will allow user to send a private message back to the sender */}
               <i
                  className="fas fa-reply"
                  onClick={() =>
                     this.setState({
                        replyTo: { ...message },
                        privateMessageActive: true
                     })
                  }
               />
               <p>{message.message}</p>
            </div>
         );
      });
   };
   //Activate the interface that will allow current user to send a private message to the owner of this profile
   activatePrivateMessage = () => {
      //Ask user to log in if he is not
      if (!this.props.currentUser) {
         this.props.askLogin(true);
         //Activate interface if user is logged in and he is not the owner of this profile
      } else if (this.state.isOwner === false) {
         this.setState({ privateMessageActive: true });
      }
   };
   //Turn off the interfaces to re-upload avatar picture and send private message
   turnOffInterfaces = () => {
      this.setState({ privateMessageActive: false, replyTo: null });
      this.props.fetchUserProfile(this.props.match.params.id);
   };

   render() {
      if (!this.props.profile) {
         return <div />;
      }
      const { username, posts, picture, _id, headphones, created, userId, privateMessages } = this.props.profile;
      const { page, isOwner } = this.state;
      return (
         <div className="dashboard">
            <div className="dashboard__stats">
               {/* Date since user joined the forum */}
               <div className="dashboard__date">
                  <span className="dashboard__stats-label">JOINED</span>
                  <Moment fromNow>{created}</Moment>
               </div>
               {/* Number of posts */}
               <div className="dashboard__post-count">
                  <span className="dashboard__stats-label">NO. OF POSTS</span>
                  {posts.length}
               </div>
               {/* Number of headphones */}
               <div className="dashboard__headphone-count">
                  <span className="dashboard__stats-label">NO. OF HEADPHONES</span>
                  {headphones.length}
               </div>
            </div>
            {/* Avatar picture */}
            <img className="dashboard__avatar" src={this.renderAvatar(picture)} alt="profile" />
            {/* Username */}
            <h1 className="dashboard__username">{username}</h1>
            {/* Page selectors */}
            <div className="dashboard__page-selectors">
               <div className="dashboard__page-selector">
                  <h2 className="dashboard__page-label">avatar</h2>
                  <div className="dashboard__page-button" onClick={() => this.setState({ page: 'avatar' })}>
                     A
                  </div>
               </div>
               <div className="dashboard__page-selector">
                  <h2 className="dashboard__page-label">ratings</h2>
                  <div className="dashboard__page-button" onClick={() => this.setState({ page: 'ratings' })}>
                     R
                  </div>
               </div>
               <div className="dashboard__page-selector">
                  <h2 className="dashboard__page-label">messages</h2>
                  <div className="dashboard__page-button" onClick={() => this.setState({ page: 'messages' })}>
                     M
                  </div>
               </div>
               <div className="dashboard__page-selector">
                  <h2 className="dashboard__page-label">posts</h2>
                  <div className="dashboard__page-button" onClick={() => this.setState({ page: 'posts' })}>
                     P
                  </div>
               </div>
            </div>
            <div className="dashboard__page-content">
               {/* Interface to re-upload avatar picture */}
               {page === 'avatar' && isOwner ? <AvatarUpload profileId={_id} isOwner={this.state.isOwner} /> : null}
               {/* Personal headphones preferences */}
               {page === 'ratings' ? (
                  <PersonalHeadphones headphones={headphones} profileId={_id} isOwner={this.state.isOwner} />
               ) : null}
               {/* Posts created by the User */}
               {page === 'posts' ? this.renderPosts(posts) : null}
               {/* Private messages */}
               {page === 'messages' ? this.renderMessagesPage() : null}
            </div>
            <div className="dashboard__vertical-line" />
            <LiveChat />
         </div>
      );
   }
}

const mapStateToProps = state => {
   //Exclude private messages from the fetched profile data if the current user is not the owner of this user profile
   if (state.currentUser && state.userProfile && state.currentUser.id === state.userProfile.userId) {
      var profile = state.userProfile;
   } else if (state.userProfile) {
      var profile = { ...state.userProfile, privateMessages: [] };
   }
   return { profile, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchUserProfile, redirectToMainPost, askLogin }
)(Dashboard);

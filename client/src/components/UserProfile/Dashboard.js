import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import axios from 'axios';
import { fetchUserProfile } from '../../actions';
import history from '../../history';
import UploadPicture from './UploadPicture';
import PersonalHeadphones from './PersonalHeadphones';
import SendPrivateMessage from './SendPrivateMessage';
import Login from '../Authentication/Login';
import './Dashboard.css';

class Dashboard extends React.Component {
   state = {
      editActive: false,
      privateMessageActive: false,
      askLogin: false,
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
      this.askLogin();
   }
   //Check if user is logged in, and if user is the owner of this profile
   checkAuthorization = () => {
      if (this.state.isOwner === null && this.props.currentUser) {
         this.props.currentUser.id === this.props.match.params.id
            ? this.setState({ isOwner: true, userId: this.props.match.params.id })
            : this.setState({ isOwner: false, userId: this.props.match.params.id });
      }
   };
   //Make user log in
   askLogin() {
      if (this.state.askLogin && this.props.currentUser) {
         this.setState({ askLogin: false });
      } else if (this.state.askLogin) {
         return <Login />;
      }
   }
   //Render posts created by this User
   renderPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            POSTS
            <h3 onClick={() => this.redirectToMainPost(post)}>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <div>
               <span>Votes {post.vote.count} </span>
               {/* Date */}
               <Moment fromNow>{post.created}</Moment>
            </div>
            {/* Edit button (If current user is the owner) */}
            {this.props.currentUser && post.author.id === this.props.currentUser.id ? (
               <i className="fas fa-edit" onClick={() => history.push(`/posts/${post._id}/edit`)} />
            ) : null}
         </div>
      ));
   }

   //If user clicks on the title of this post, redirect to this post's show page
   redirectToMainPost = async post => {
      if (post.isMainPost) {
         history.push(`/posts/${post._id}`);
      } else {
         //If this post is a reply, find the main post and then redirect the user
         const response = await axios.post('/posts/find-main', { title: post.title });
         history.push(`/posts/${response.data._id}`);
      }
   };
   //Render private messages sent to this user
   //Current user can only see this if he is the owner of this profile
   renderPrivateMessages = privateMessages => {
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
         this.setState({ askLogin: true });
         //Activate interface if user is logged in and he is not the owner of this profile
      } else if (this.state.isOwner === false) {
         this.setState({ privateMessageActive: true });
      }
   };
   //Turn off the interfaces to re-upload avatar picture and send private message
   turnOffInterfaces = () => {
      this.setState({ editActive: false, privateMessageActive: false, replyTo: null });
      this.props.fetchUserProfile(this.props.match.params.id);
   };

   render() {
      if (!this.props.profile) {
         return <div>Loading</div>;
      }
      var { username, posts, picture, _id, headphones, created, userId, privateMessages } = this.props.profile;
      return (
         <div className="dashboard">
            {/* Username */}
            <h1>{username}</h1>
            {/* Date since user joined the forum */}
            <Moment fromNow>{created}</Moment>
            {/* Personal headphones preferences */}
            <PersonalHeadphones headphones={headphones} profileId={_id} isOwner={this.state.isOwner} />
            {/* Avatar picture */}
            {picture ? <img className="dashboard__picture" src={picture} alt="profile" /> : null}
            {/* Show private messages */}
            {this.renderPrivateMessages(privateMessages)}
            {/* Private message the owner of this profile */}
            {!this.state.isOwner ? <i className="fas fa-envelope" onClick={this.activatePrivateMessage} /> : null}
            {/* Interface to send private message */}
            {this.state.privateMessageActive ? (
               <SendPrivateMessage
                  userId={userId}
                  turnOff={this.turnOffInterfaces}
                  replyTo={this.state.replyTo ? this.state.replyTo : null}
               />
            ) : null}
            {/* Posts created by the User */}
            {this.renderPosts(posts)}
            {/* Interface to re-upload avatar picture */}
            {this.state.isOwner ? (
               <button onClick={() => this.setState({ editActive: true })}>Upload Avatar</button>
            ) : null}
            {this.state.editActive ? <UploadPicture profileId={_id} turnOff={this.turnOffInterfaces} /> : null}
         </div>
      );
   }
}

const mapStateToProps = state => {
   var profile;
   //Exclude private messages from the fetched profile data if the current user is not the owner of this user profile
   if (state.currentUser && state.userProfile && state.currentUser.id === state.userProfile.userId) {
      profile = state.userProfile;
   } else if (state.userProfile) {
      profile = { ...state.userProfile, privateMessages: [] };
   }
   return { profile, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchUserProfile }
)(Dashboard);

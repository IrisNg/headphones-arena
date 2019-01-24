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
      isOwner: null
   };
   //Fetch this user profile data
   componentDidMount() {
      this.props.fetchUserProfile(this.props.match.params.id);
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
   renderPrivateMessages = privateMessages => {
      return privateMessages.map(message => (
         <div key={message._id}>
            <h3>{message.subject}</h3>
            <h6>from {message.fromUsername}</h6>
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
      ));
   };
   //Activate the interface that will allow current user to send a private message to the owner of this profile
   activatePrivateMessage = () => {
      //Ask user to log in if he is not
      if (!this.props.currentUser) {
         this.setState({ askLogin: true });
         //Activate interface if user is logged in and he is not the owner of this profile
      } else if (this.props.currentUser.id !== this.props.profile.userId) {
         this.setState({ privateMessageActive: true });
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
   //Turn off the interfaces to re-upload avatar picture and send private message
   turnOffInterfaces = () => {
      this.setState({ editActive: false, privateMessageActive: false, replyTo: null });
      this.props.fetchUserProfile(this.props.match.params.id);
   };
   //Check if user is logged in, and if user is the owner of this profile
   checkAuthorization = () => {
      if (this.state.isOwner === null) {
         if (this.props.currentUser && this.props.currentUser.id === this.props.profile.userId) {
            this.setState({ isOwner: true });
         } else {
            this.setState({ isOwner: false });
         }
      }
   };
   render() {
      if (!this.props.profile) {
         return <div>Loading</div>;
      }
      const { username, posts, picture, _id, headphones, created, userId, privateMessages } = this.props.profile;
      return (
         <div className="dashboard">
            {this.checkAuthorization()}
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
            <i className="fas fa-envelope" onClick={this.activatePrivateMessage} />
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
            {/* Login */}
            {this.askLogin()}
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

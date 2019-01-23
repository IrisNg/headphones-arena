import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { fetchUserProfile } from '../../actions';
import UploadPicture from './UploadPicture';
import PersonalHeadphones from './PersonalHeadphones';
import './Dashboard.css';

class Dashboard extends React.Component {
   state = {
      editActive: false
   };
   componentDidMount() {
      this.props.fetchUserProfile(this.props.match.params.id);
   }
   renderPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            POSTS
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <div>
               <span>Votes {post.vote.count} </span>
               {/* Date */}
               <Moment fromNow>{post.created}</Moment>
            </div>
         </div>
      ));
   }
   turnOffEdit = () => {
      this.setState({ editActive: false });
      this.props.fetchUserProfile(this.props.match.params.id);
   };

   render() {
      if (!this.props.profile) {
         return <div>Loading</div>;
      }
      console.log(this.props.profile);
      const { username, posts, picture, _id, headphones } = this.props.profile;
      return (
         <div className="dashboard">
            {/* Username */}
            <h1>{username}</h1>
            {/* Personal headphones preferences */}
            <PersonalHeadphones headphones={headphones} profileId={_id} turnOffEdit={this.turnOffEdit} />
            {/* Avatar picture */}
            {picture ? <img className="dashboard__picture" src={picture} alt="profile" /> : null}
            {/* Posts created by the User */}
            {this.renderPosts(posts)}
            {/* Options to upload avatar picture */}
            <button onClick={() => this.setState({ editActive: true })}>Upload Avatar</button>
            {this.state.editActive ? <UploadPicture profileId={_id} turnOffEdit={this.turnOffEdit} /> : null}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { profile: state.userProfile };
};

export default connect(
   mapStateToProps,
   { fetchUserProfile }
)(Dashboard);

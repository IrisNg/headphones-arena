import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { fetchUserProfile } from '../../actions';
import PageSelectors from './PageSelectors';
import PageContent from './PageContent';
import LiveChat from '../LiveChat/LiveChat';
import './Dashboard.css';

class Dashboard extends React.Component {
   state = {
      page: 'ratings',
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
         return { isOwner: null, page: 'ratings' };
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
   //Callback passed as props to PageSelectors component
   selectPage = currentPage => {
      this.setState({ page: currentPage });
   };

   render() {
      if (!this.props.profile) {
         return <div />;
      }
      const { username, posts, picture, headphones, created } = this.props.profile;
      const { page, isOwner } = this.state;
      return (
         <div className="dashboard">
            <div className="dashboard__stats">
               {/* Username */}
               <h1 className="dashboard__username">{username}</h1>
               {/* Date since user joined the forum */}
               <div className="dashboard__item">
                  <span className="dashboard__stats-label">JOINED</span>
                  <Moment format="DD MMM YY" className="dashboard__date">
                     {created}
                  </Moment>
               </div>
               {/* Number of posts */}
               <div className="dashboard__item">
                  <span className="dashboard__stats-label">NO. OF POSTS</span>
                  {posts.length}
               </div>
               {/* Number of headphones */}
               <div className="dashboard__item">
                  <span className="dashboard__stats-label">NO. OF HEADPHONES</span>
                  {headphones.length}
               </div>
            </div>
            {/* Avatar picture */}
            <img className="dashboard__avatar" src={this.renderAvatar(picture)} alt="profile" />
            {/* Title */}
            <h1 className="dashboard__title">DASHBOARD</h1>
            {/* Page selectors */}
            <PageSelectors selectPage={this.selectPage} isOwner={isOwner} page={page} />
            {/* Page content */}
            <PageContent
               page={page}
               isOwner={isOwner}
               profile={this.props.profile}
               currentUser={this.props.currentUser}
               fetchUserProfile={this.props.fetchUserProfile}
               userId={this.state.userId}
            />
            <div className="dashboard__vertical-line" />
            <div className="dashboard__horizontal-line" />
            <LiveChat />
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

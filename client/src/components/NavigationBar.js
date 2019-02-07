import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import Logout from './Authentication/Logout';
import './NavigationBar.css';

class NavigationBar extends React.Component {
   state = {
      currentLocation: history.location.pathname
   };
   //Listen to changes in history, this affects which icon in the navigation bar will become 'active'
   componentDidMount() {
      history.listen(location => {
         this.setState({ currentLocation: location.pathname });
      });
   }
   render() {
      var { user } = this.props;
      var { currentLocation } = this.state;
      return (
         <div className="navigation-bar">
            {/* To Arena page */}
            <div
               className={`navigation-bar-icon ${
                  ['/arena', '-headphone'].some(path => currentLocation.includes(path) || currentLocation === '/')
                     ? 'navigation-bar--active'
                     : 'navigation-bar--inactive'
               }`}
               onClick={() => history.push('/arena')}
            >
               <img src="https://i.imgur.com/SZVF3SA.jpg" alt="To Arena Page" />
               <div className="navigation-bar--page-name">ARENA</div>
            </div>
            {/* To Forum page */}
            <div
               className={`navigation-bar-icon ${
                  ['/forum', '-post'].some(path => currentLocation.includes(path) || currentLocation === '/')
                     ? 'navigation-bar--active'
                     : 'navigation-bar--inactive'
               }`}
               onClick={() => history.push('/forum')}
            >
               <img src="https://i.imgur.com/sVQQml8.jpg" alt="To Forum Page" />
               <div className="navigation-bar--page-name">FORUM</div>
            </div>
            {/* To Login page or user's dashboard */}
            <div
               className={`navigation-bar-icon ${
                  ['/user', '/login'].some(path => currentLocation.includes(path) || currentLocation === '/')
                     ? 'navigation-bar--active'
                     : 'navigation-bar--inactive'
               }`}
               onClick={() => history.push(user ? `/user/${user.id}` : `/login`)}
            >
               <img src="https://i.imgur.com/c34xhYu.jpg" alt="To Login Page or Dashboard" />
               <div className="navigation-bar--page-name">ACCOUNT</div>
            </div>
            {/* Logout button */}
            {user ? (
               <div className="navigation-bar--inactive">
                  <Logout />
               </div>
            ) : null}
            <div className="navigation-bar__line" />
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { user: state.currentUser };
};
export default connect(mapStateToProps)(NavigationBar);

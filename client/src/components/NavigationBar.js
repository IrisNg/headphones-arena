import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { askLogin } from '../actions';
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
   onAccountIconClick = () => {
      var { user } = this.props;
      if (!user) {
         this.props.askLogin(true);
      } else {
         history.push(`/user/${user.id}`);
      }
   };
   manageArenaClass() {
      var { currentLocation } = this.state;
      return ['/arena', '-headphone'].some(path => currentLocation.includes(path) || currentLocation === '/')
         ? 'navigation-icon--active'
         : 'navigation-icon--inactive';
   }
   manageForumClass() {
      var { currentLocation } = this.state;
      return ['/forum', '-post'].some(path => currentLocation.includes(path) || currentLocation === '/')
         ? 'navigation-icon--active'
         : 'navigation-icon--inactive';
   }
   manageBlacksmithClass() {
      var { currentLocation } = this.state;
      return currentLocation === '/blacksmith' || currentLocation === '/'
         ? 'navigation-icon--active'
         : 'navigation-icon--inactive';
   }
   manageAccountClass() {
      var { currentLocation } = this.state;
      return ['/user'].some(path => currentLocation.includes(path) || currentLocation === '/')
         ? 'navigation-icon--active'
         : 'navigation-icon--inactive';
   }
   renderLoginOrAccount() {
      return this.props.user ? 'ACCOUNT' : 'LOGIN';
   }
   render() {
      var { user } = this.props;
      return (
         <div className="navigation-bar">
            {/* To Arena page */}
            <div className={`navigation-bar__icon ${this.manageArenaClass()}`} onClick={() => history.push('/arena')}>
               <img src="https://i.imgur.com/SZVF3SA.jpg" alt="To Arena Page" />
               <div className="navigation-bar__page-name">ARENA</div>
            </div>
            {/* To Forum page */}
            <div className={`navigation-bar__icon ${this.manageForumClass()}`} onClick={() => history.push('/forum')}>
               <img src="https://i.imgur.com/sVQQml8.jpg" alt="To Forum Page" />
               <div className="navigation-bar__page-name">FORUM</div>
            </div>
            {/* To Blacksmith page */}
            <div
               className={`navigation-bar__icon ${this.manageBlacksmithClass()}`}
               onClick={() => history.push('/blacksmith')}
            >
               <img src="https://i.imgur.com/6tiPqif.png" alt="To Blacksmith Page" />
               <div className="navigation-bar__page-name">
                  <span>BLACK SMITH</span>
               </div>
            </div>
            {/* To Login page or user's dashboard */}
            <div className={`navigation-bar__icon ${this.manageAccountClass()}`} onClick={this.onAccountIconClick}>
               <img src="https://i.imgur.com/c34xhYu.jpg" alt="To Login Page or Profile Page" />
               <div className="navigation-bar__page-name">{this.renderLoginOrAccount()}</div>
            </div>

            {/* Logout button */}
            {user ? (
               <div className="navigation-bar__logout">
                  <Logout />
               </div>
            ) : null}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { user: state.currentUser };
};
export default connect(
   mapStateToProps,
   { askLogin }
)(NavigationBar);

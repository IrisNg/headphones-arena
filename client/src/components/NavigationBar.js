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
      const { current } = this.props;
      return (
         <div className="navigation-bar">
            {/* Logout button */}
            {current ? <Logout /> : null}
            {/* To Arena page */}
            <div className={this.state.currentLocation === '/arena' ? 'active' : 'inactive'}>
               <img src="https://i.imgur.com/Urok6wJ.png" alt="To Arena Page" onClick={() => history.push('/arena')} />
            </div>
            {/* To Forum page */}
            <div
               className={
                  ['/forum', '/posts'].some(path => this.state.currentLocation.includes(path)) ? 'active' : 'inactive'
               }
            >
               <img src="https://i.imgur.com/Iv5jEih.png" alt="To Arena Page" onClick={() => history.push('/forum')} />
            </div>
            {/* To Login page or user's dashboard */}
            <div
               className={
                  ['/user', '/login'].some(path => this.state.currentLocation.includes(path)) ? 'active' : 'inactive'
               }
            >
               <img
                  src="https://i.imgur.com/Spthb5x.png"
                  alt="To Arena Page"
                  onClick={() => history.push(current ? `/user/${current.id}` : `/login`)}
               />
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { current: state.currentUser };
};
export default connect(mapStateToProps)(NavigationBar);

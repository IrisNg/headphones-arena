import React from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions';

class Logout extends React.Component {
   onButtonClick = () => {
      //Log out user
      this.props.logoutUser();
   };
   render() {
      return (
         <div className="logout">
            <div className="logout__button" onClick={this.onButtonClick}>
               LOGOUT
            </div>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { logoutUser }
)(Logout);

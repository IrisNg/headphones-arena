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
         <div>
            <button onClick={this.onButtonClick}>Logout</button>
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

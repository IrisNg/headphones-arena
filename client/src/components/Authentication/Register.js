import React from 'react';
import { connect } from 'react-redux';
import { registerUser, addGlobalError } from '../../actions';
import Logout from './Logout';

class Register extends React.Component {
   state = {
      username: '',
      password: ''
   };
   onSubmitClick = e => {
      e.preventDefault();
      if (!this.state.username || !this.state.password) {
         this.props.addGlobalError('Both username and password are required');
      } else {
         this.props.registerUser(this.state.username, this.state.password);
         if (this.props.redirectIfDone) {
            this.props.redirectIfDone();
         }
      }
   };
   render() {
      return (
         <div>
            REGISTER
            <form>
               <label>Username</label>
               <input
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
               />
               <label>Password</label>
               <input
                  type="text"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
               />
               <input type="submit" onClick={this.onSubmitClick} />
            </form>
            {/* {!this.props.currentUser ? <Login /> : null} */}
            LOGOUT
            <Logout />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { registerUser, addGlobalError }
)(Register);

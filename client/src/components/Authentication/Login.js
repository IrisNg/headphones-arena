import React from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';
import './Login.css';

class Login extends React.Component {
   state = {
      username: '',
      password: ''
   };
   onSubmitClick = e => {
      e.preventDefault();
      this.props.loginUser(this.state.username, this.state.password);
      if (this.props.redirectIfDone) {
         this.props.redirectIfDone();
      }
   };
   render() {
      return (
         <div className="login">
            <form className="login-form">
               <div>LOGIN</div>
               <label>Username</label>
               <input
                  type="text"
                  className="login-form__input"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
               />
               <label>Password</label>
               <input
                  type="text"
                  className="login-form__input"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
               />
               <input type="submit" className="login-form__input" onClick={this.onSubmitClick} />
            </form>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { loginUser }
)(Login);

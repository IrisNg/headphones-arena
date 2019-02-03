import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { loginUser, addGlobalError } from '../../actions';
import Register from './Register';
import './Login.css';
import { isNull } from 'util';

class Login extends React.Component {
   state = {
      username: '',
      password: '',
      registerIsActive: false
   };
   onSubmitClick = e => {
      e.preventDefault();
      //Check required fields
      if (!this.state.username || !this.state.password) {
         this.props.addGlobalError('Both username and password are required!');
      } else {
         //Log user in
         this.props.loginUser(this.state.username, this.state.password);
         if (this.props.redirectIfDone) {
            //Redirect back when done
            history.goBack();
         }
      }
   };
   onRefuseClick = () => {
      if (!this.props.turnOffLogin) {
         history.goBack();
      } else {
         this.props.turnOffLogin();
      }
   };
   renderRegister = () => {
      if (!this.state.registerIsActive) {
         return isNull;
      }
      return <Register />;
   };
   turnOffRegister = () => {
      this.setState({ registerIsActive: true });
   };
   render() {
      return (
         <div className="login">
            <div className="login__contents">
               <form className="login__form">
                  <div className="login__form-page-title"> LOG IN</div>
                  <label className="login__form-label">USERNAME</label>
                  <input
                     type="text"
                     className="login__form-input"
                     value={this.state.username}
                     onChange={e => this.setState({ username: e.target.value })}
                  />
                  <label className="login__form-label">PASSWORD</label>
                  <input
                     type="password"
                     className="login__form-input"
                     value={this.state.password}
                     onChange={e => this.setState({ password: e.target.value })}
                  />
                  <div className="login__form-button" onClick={this.onSubmitClick}>
                     LOG ME IN!
                  </div>
               </form>
               <div className="login__alternatives">
                  <h6
                     className="login__alternatives-register"
                     onClick={() => this.setState({ registerIsActive: true })}
                  >
                     But, I am not registered!
                  </h6>
                  <h6 className="login__alternatives-refuse" onClick={this.onRefuseClick}>
                     No Way! You can't make me!
                  </h6>
               </div>
               <div className="login__continuous-line" />
               <div className="login__vertical-line" />
               <div className="login__vertical-line-2" />
            </div>
            {this.renderRegister()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { loginUser, addGlobalError }
)(Login);

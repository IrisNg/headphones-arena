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
   onSubmitClick = () => {
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
         //If there is no parent component, then redirect back to the previous page
         history.goBack();
      } else {
         //Turn off this Login component using the callback from the parent component
         this.props.turnOffLogin();
      }
   };
   renderRegister = () => {
      if (!this.state.registerIsActive) {
         return isNull;
      }
      return <Register turnOffRegister={this.turnOffRegister} onRefuseClick={this.onRefuseClick} />;
   };
   turnOffRegister = () => {
      this.setState({ registerIsActive: false });
   };
   //Toggle between either displaying the Login component or Register component
   manageLoginDisplay() {
      return this.state.registerIsActive ? { display: 'none' } : null;
   }
   render() {
      return (
         <div className="login">
            <div className="login__contents" style={this.manageLoginDisplay()}>
               <form className="login__form">
                  {/* Title */}
                  <div className="login__form-page-title"> LOG IN</div>
                  {/* Username */}
                  <label className="login__form-label">USERNAME</label>
                  <input
                     type="text"
                     className="login__form-input"
                     value={this.state.username}
                     onChange={e => this.setState({ username: e.target.value })}
                  />
                  {/* Password */}
                  <label className="login__form-label">PASSWORD</label>
                  <input
                     type="password"
                     className="login__form-input"
                     value={this.state.password}
                     onChange={e => this.setState({ password: e.target.value })}
                     onKeyPress={e => (e.key === 'Enter' ? this.onSubmitClick() : null)}
                  />
                  {/* Login button */}
                  <div className="login__form-button" onClick={this.onSubmitClick}>
                     LOG ME IN!
                  </div>
               </form>
               <div className="login__alternatives">
                  {/* Switch to Register page when clicked */}
                  <h6
                     className="login__alternatives-register"
                     onClick={() => this.setState({ registerIsActive: true })}
                  >
                     But, I am not registered!
                  </h6>
                  {/* Exit out of this component when clicked */}
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

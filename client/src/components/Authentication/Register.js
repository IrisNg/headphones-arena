import React from 'react';
import { connect } from 'react-redux';
import { registerUser, addGlobalError, askLogin } from '../../actions';
import './Register.css';

class Register extends React.Component {
   state = {
      username: '',
      password: ''
   };
   onSubmitClick = () => {
      //Check required fields
      if (!this.state.username || !this.state.password) {
         this.props.addGlobalError('Both username and password are required');
      } else {
         //Register user
         this.props.registerUser(this.state.username, this.state.password);
      }
   };
   render() {
      return (
         <div className="register">
            <div className="register__contents">
               <form className="register__form">
                  {/* Title */}
                  <div className="register__form-page-title"> REGISTER</div>
                  {/* Username */}
                  <label className="register__form-label">USERNAME</label>
                  <input
                     type="text"
                     className="register__form-input"
                     value={this.state.username}
                     onChange={e => this.setState({ username: e.target.value })}
                  />
                  {/* Password */}
                  <label className="register__form-label">PASSWORD</label>
                  <input
                     type="password"
                     className="register__form-input"
                     value={this.state.password}
                     onChange={e => this.setState({ password: e.target.value })}
                     onKeyPress={e => (e.key === 'Enter' ? this.onSubmitClick() : null)}
                  />
                  {/* Register button */}
                  <div className="register__form-button" onClick={this.onSubmitClick}>
                     REGISTER ME!
                  </div>
               </form>
               <div className="register__alternatives">
                  {/* Switch to Login page when clicked */}
                  <h6 className="register__alternatives-login" onClick={this.props.turnOffRegister}>
                     Wait, I'm already a member!
                  </h6>
                  {/* Exit out of this component when clicked */}
                  <h6 className="register__alternatives-refuse" onClick={this.props.onRefuseClick}>
                     No Way! You can't make me!
                  </h6>
               </div>
               <div className="register__continuous-line" />
               <div className="register__vertical-line" />
               <div className="register__vertical-line-2" />
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
   { registerUser, addGlobalError, askLogin }
)(Register);

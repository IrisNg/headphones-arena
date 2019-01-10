import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../../actions';

class Login extends React.Component {
   state = {
      username: '',
      password: '',
      redirect: false
   };
   onSubmitClick = e => {
      e.preventDefault();
      this.props.loginUser(this.state.username, this.state.password);
      this.setState({ redirect: true });
   };
   render() {
      if (this.state.redirect) {
         return <Redirect to="/posts/new" />;
      }
      return (
         <div>
            LOGIN
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
         </div>
      );
   }
}
const mapStateToProps = state => {
   console.log(state.currentUser);
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { loginUser }
)(Login);

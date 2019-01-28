import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import Login from './Login';
import Register from './Register';

const redirectIfDone = () => {
   history.goBack();
};

const Authentication = ({ currentUser }) => {
   //If user is already logged in then redirect to user's profile page
   if (currentUser) {
      history.push(`/user/${currentUser.id}`);
   }
   return (
      <div>
         Are you new here?
         <Register redirectIfDone={redirectIfDone} />
         Or do you have an existing account?
         <Login redirectIfDone={redirectIfDone} />
      </div>
   );
};

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(mapStateToProps)(Authentication);

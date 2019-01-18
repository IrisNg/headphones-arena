import React from 'react';
import { connect } from 'react-redux';
import { checkUser } from '../../actions';
import './CheckAuth.css';

class CheckAuth extends React.Component {
   componentDidMount() {
      if (!this.props.currentUser) {
         this.props.checkUser();
      }
   }
   render() {
      return (
         <div className="check-auth">
            {this.props.currentUser ? `Log In status ${this.props.currentUser.username}` : 'log in LEH'}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { checkUser }
)(CheckAuth);

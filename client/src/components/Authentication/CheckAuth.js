import React from 'react';
import { connect } from 'react-redux';
import { checkUser } from '../../actions';
import './CheckAuth.css';

class CheckAuth extends React.Component {
   //Check if user is authenticated
   componentDidMount() {
      if (!this.props.current) {
         this.props.checkUser();
      }
   }
   //Display user's authentication status
   render() {
      return (
         <div className="check-auth">{this.props.current ? `Hi welcome there${this.props.current.username}!` : 'Unidentified'}</div>
      );
   }
}

const mapStateToProps = state => {
   return { current: state.currentUser };
};

export default connect(
   mapStateToProps,
   { checkUser }
)(CheckAuth);

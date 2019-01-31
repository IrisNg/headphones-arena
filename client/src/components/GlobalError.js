import React from 'react';
import { connect } from 'react-redux';
import { addGlobalError } from '../actions';
import './GlobalError.css';

class GlobalError extends React.Component {
   state = {
      currentError: ''
   };
   //Handle any new global error
   componentDidUpdate() {
      if (this.props.globalError !== this.state.currentError) {
         //If there is a new error then invoke count-down timer to automatically remove it from screen later
         if (this.props.globalError) {
            this.removeErrorAfterTimeOut();
         }
         //Update the new error to the component state
         //Or empty the state after timeout completes
         this.setState({ currentError: this.props.globalError });
      }
   }
   //Display the global error for 5 seconds, then remove it from redux state
   removeErrorAfterTimeOut = () => {
      setTimeout(() => this.props.addGlobalError(''), 5000);
   };
   render() {
      var { globalError } = this.props;
      if (!globalError) {
         return <div />;
      }
      return <div className="global-error">{globalError}</div>;
   }
}
const mapStateToProps = state => {
   return { globalError: state.globalError };
};

export default connect(
   mapStateToProps,
   { addGlobalError }
)(GlobalError);

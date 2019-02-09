import React from 'react';
import { connect } from 'react-redux';
import { addGlobalMessage } from '../actions';
import './GlobalMessage.css';

class GlobalMessage extends React.Component {
   state = {
      currentMessage: ''
   };
   //Handle any new global message
   componentDidUpdate() {
      if (this.props.globalMessage !== this.state.currentMessage) {
         //If there is a new message then invoke count-down timer to automatically remove it from screen later
         if (this.props.globalMessage) {
            this.removeMessageAfterTimeOut();
         }
         //Update the new message to the component state
         //Or empty the state after timeout completes
         this.setState({ currentMessage: this.props.globalMessage });
      }
   }
   //Display the global message for 5 seconds, then remove it from redux state
   removeMessageAfterTimeOut = () => {
      setTimeout(() => this.props.addGlobalMessage(''), 15000);
   };
   render() {
      var { globalMessage } = this.props;
      if (!globalMessage) {
         return <div />;
      }
      return (
         <div className="global-message">
            <div className="global-message__message">{globalMessage}</div>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { globalMessage: state.globalMessage };
};

export default connect(
   mapStateToProps,
   { addGlobalMessage }
)(GlobalMessage);

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalMessage } from '../../actions';
import history from '../../history';

class HeadphoneDelete extends React.Component {
   state = {
      confirmationIsActive: false
   };

   delete = async () => {
      try {
         const response = await axios.delete(`/headphones/${this.props.id}`);
         console.log(response.data);
         this.props.addGlobalMessage('Headphone entry successfully erased.');

         history.push('/create-headphone');
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };

   confirmation() {
      if (!this.state.confirmationIsActive) {
         return null;
      }
      return (
         <div className="delete-confirmation">
            <div className="delete-confirmation__box">
               <h5>Are you sure you want to delete this Headphone Entry?</h5>
               <div className="delete-confirmation__box-buttons">
                  <div onClick={this.delete}>Accept</div>
                  <div onClick={() => this.setState({ confirmationIsActive: false })}>Oopsie, go back</div>
               </div>
            </div>
         </div>
      );
   }
   render() {
      return (
         <div>
            <div className="headphone-delete__button" onClick={() => this.setState({ confirmationIsActive: true })}>
               Delete
            </div>
            {this.confirmation()}
         </div>
      );
   }
}
export default connect(
   null,
   { addGlobalMessage }
)(HeadphoneDelete);

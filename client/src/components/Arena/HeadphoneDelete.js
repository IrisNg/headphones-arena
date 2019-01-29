import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalError } from '../../actions';
import history from '../../history';
import './HeadphoneDelete.css';

class HeadphoneDelete extends React.Component {
   state = {
      confirmationIsActive: false
   };

   delete = async () => {
      try {
         const response = await axios.delete(`/headphones/${this.props.id}`);
         console.log(response.data);
         history.push('/headphones/new');
      } catch (err) {
         this.props.addGlobalError(err.response.data);
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
                  <button onClick={this.delete}>Accept</button>
                  <button onClick={() => this.setState({ confirmationIsActive: false })}>Oopsie, go back</button>
               </div>
            </div>
         </div>
      );
   }
   render() {
      return (
         <div>
            <button onClick={() => this.setState({ confirmationIsActive: true })}>Delete</button>
            {this.confirmation()}
         </div>
      );
   }
}
export default connect(
   null,
   { addGlobalError }
)(HeadphoneDelete);

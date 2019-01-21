import React from 'react';
import axios from 'axios';
import history from '../../history';
import './HeadphoneDelete.css';

class HeadphoneDelete extends React.Component {
   state = {
      isActive: false
   };

   delete = () => {
      axios.delete(`/headphones/${this.props.id}`);
      history.push('/headphones/new');
   };

   confirmation() {
      return (
         <div className="delete-confirmation">
            <div className="delete-confirmation__box">
               <h5>Are you sure you want to delete this Headphone Entry?</h5>
               <div className="delete-confirmation__box-buttons">
                  <button onClick={this.delete}>Accept</button>
                  <button onClick={() => this.setState({ isActive: false })}>Oopsie, go back</button>
               </div>
            </div>
         </div>
      );
   }
   render() {
      return (
         <div>
            <button onClick={() => this.setState({ isActive: true })}>Delete</button>
            {this.state.isActive ? this.confirmation() : null}
         </div>
      );
   }
}
export default HeadphoneDelete;

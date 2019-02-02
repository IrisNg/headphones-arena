import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalError } from '../../actions';
import history from '../../history';
import './PostDelete.css';

class PostDelete extends React.Component {
   state = {
      isActive: false
   };

   delete = async () => {
      var postId = this.props.match.params.id;
      try {
         const response = await axios.delete(`/posts/${postId}`);
         console.log(response);
         history.push(`/posts/${postId}`);
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };

   render() {
      return (
         <div className="delete-confirmation">
            <div className="delete-confirmation__box">
               <h5>Are you sure you want to delete this Post?</h5>
               <div className="delete-confirmation__box-buttons">
                  <button onClick={this.delete}>Accept</button>
                  <button onClick={() => history.goBack()}>Oopsie, go back</button>
               </div>
            </div>
         </div>
      );
   }
}
export default connect(
   null,
   { addGlobalError }
)(PostDelete);

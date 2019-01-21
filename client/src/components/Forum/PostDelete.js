import React from 'react';
import axios from 'axios';
import history from '../../history';
import './PostDelete.css';

class PostDelete extends React.Component {
   state = {
      isActive: false
   };

   delete = async () => {
      const response = await axios.delete(`/posts/${this.props.match.params.id}`);
      console.log(response);
      history.push(`/posts/${this.props.match.params.id}`);
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
export default PostDelete;

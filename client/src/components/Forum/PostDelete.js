import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalMessage } from '../../actions';
import history from '../../history';
import './PostDelete.css';

class PostDelete extends React.Component {
   delete = async () => {
      var postId = this.props.match.params.id;
      try {
         const response = await axios.delete(`/posts/${postId}`);
         console.log(response);
         this.props.addGlobalMessage('Post. Erased. Beep.');
         history.go(-2);
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };

   render() {
      return (
         <div className="post-delete">
            <div className="post-delete__box">
               <h5 className="post-delete__message">Are you VERY sure you want to delete this Post?</h5>
               <div className="post-delete__buttons">
                  <div onClick={this.delete}>I'M SURE!</div>
                  <div onClick={() => history.goBack()}>NOPE</div>
               </div>
            </div>
         </div>
      );
   }
}
export default connect(
   null,
   { addGlobalMessage }
)(PostDelete);

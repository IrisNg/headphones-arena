import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalMessage } from '../../actions';
class AvatarUpload extends React.Component {
   state = {
      imageUrl: ''
   };

   //Upload image url to the database
   onUploadClick = async () => {
      const { userId, profileId } = this.props;
      try {
         const response = await axios.put(`/user-profile/${profileId}`, {
            picture: this.state.imageUrl
         });
         console.log(response);
         this.props.addGlobalMessage('Uploaded your avatar! Hehe');
         this.props.fetchUserProfile(userId);
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };

   render() {
      return (
         <div className="avatar-upload">
            {/* Url input bar to upload picture */}
            <input
               type="text"
               value={this.state.imageUrl}
               onChange={e => this.setState({ imageUrl: e.target.value })}
               placeholder="URL for your avatar"
            />
            {/* Upload button */}
            <div onClick={this.onUploadClick}>Upload</div>
         </div>
      );
   }
}

export default connect(
   null,
   { addGlobalMessage }
)(AvatarUpload);

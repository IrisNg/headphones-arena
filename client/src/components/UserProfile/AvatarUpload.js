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
         this.setState({ imageUrl: '' }, () => this.props.fetchUserProfile(userId));
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };

   render() {
      return (
         <div className="avatar-upload">
            <label className="avatar-upload__label">Upload New Avatar</label>
            {/* Url input bar to upload picture */}
            <input
               type="text"
               className="avatar-upload__input"
               value={this.state.imageUrl}
               onChange={e => this.setState({ imageUrl: e.target.value })}
               placeholder="URL link"
            />
            {/* Upload button */}
            <div className="avatar-upload__button-container">
               <div onClick={this.onUploadClick} className="avatar-upload__button">
                  Upload !
               </div>
            </div>
         </div>
      );
   }
}

export default connect(
   null,
   { addGlobalMessage }
)(AvatarUpload);

import React from 'react';
import axios from 'axios';
class UploadPicture extends React.Component {
   state = {
      imageUrl: ''
   };
   //Upload image url to the database
   onUploadClick = async () => {
      const response = await axios.put(`/user-profile/${this.props.profileId}`, {
         picture: this.state.imageUrl
      });
      console.log(response);
      //Turn off this component
      this.props.turnOff();
   };

   render() {
      return (
         <div>
            URL link to image{' '}
            <input
               type="text"
               value={this.state.imageUrl}
               onChange={e => this.setState({ imageUrl: e.target.value })}
            />
            <button onClick={this.onUploadClick}>Upload</button>
         </div>
      );
   }
}

export default UploadPicture;

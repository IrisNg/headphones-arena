import React from 'react';
import { connect } from 'react-redux';
import { featureVideo } from '../../actions';

const Video = ({ video: { thumbnail, title, description }, featureVideo, video }) => {
   return (
      <div>
         <img src={thumbnail} alt={title} onClick={() => featureVideo(video)} />
         <div>{title}</div>
         <div>{description}</div>
      </div>
   );
};

export default connect(
   null,
   { featureVideo }
)(Video);

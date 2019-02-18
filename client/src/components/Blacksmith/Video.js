import React from 'react';
import { connect } from 'react-redux';
import { featureVideo } from '../../actions';

const Video = ({ video: { thumbnail, title, description }, featureVideo, video }) => {
   return (
      <div className="video" onClick={() => featureVideo(video)}>
         <h3 className="video__title">{title}</h3>
         <img src={thumbnail} alt={title} className="video__thumbnail" />
         <div className="video__description">{description.substring(0, 300)}...</div>
      </div>
   );
};

export default connect(
   null,
   { featureVideo }
)(Video);

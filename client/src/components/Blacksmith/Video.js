import React from 'react';
import { connect } from 'react-redux';
import { featureVideo } from '../../actions';

const Video = ({ video: { thumbnail, title }, featureVideo, video }) => {
   return (
      <div className="video" onClick={() => featureVideo(video)}>
         {/* Title */}
         <h3 className="video__title">{title}</h3>
         {/* Thumbnail image */}
         <img src={thumbnail} alt={title} className="video__thumbnail" />
      </div>
   );
};

export default connect(
   null,
   { featureVideo }
)(Video);

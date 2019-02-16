import React from 'react';
import { connect } from 'react-redux';

const FeaturedVideo = ({ featuredVideo }) => {
   if (!featuredVideo) {
      return <div />;
   }
   var videoSrc = `https://www.youtube.com/embed/${featuredVideo.videoId}`;
   console.log(videoSrc);
   return (
      <div>
         <iframe src={videoSrc} title={featuredVideo.title} />
      </div>
   );
};

const mapStateToProps = state => {
   return { featuredVideo: state.featuredVideo };
};

export default connect(mapStateToProps)(FeaturedVideo);

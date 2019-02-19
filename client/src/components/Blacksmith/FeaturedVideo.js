import React from 'react';

const FeaturedVideo = ({ featuredVideo }) => {
   if (!featuredVideo) {
      return <div />;
   }
   const videoSrc = `https://www.youtube.com/embed/${featuredVideo.videoId}`;
   return (
      <div className="featured-video">
         <h3 className="featured-video__title">{featuredVideo.title}</h3>
         <div className="featured-video__player">
            <iframe src={videoSrc} title={featuredVideo.title} allowfullscreen="allowfullscreen" />
         </div>
      </div>
   );
};

export default FeaturedVideo;

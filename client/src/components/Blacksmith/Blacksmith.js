import React from 'react';
import { connect } from 'react-redux';
import { fetchVideos, featureVideo } from '../../actions';
import Video from './Video';
import FeaturedVideo from './FeaturedVideo';
import LiveChat from '../LiveChat/LiveChat';
import './Blacksmith.css';

class Blacksmith extends React.Component {
   //Fetch Youtube videos from Youtube channel using Youtube API
   componentDidMount() {
      this.props.fetchVideos();
   }

   componentDidUpdate() {
      const { featuredVideo, videos } = this.props;
      //Randomly feature a video when the page first loads
      if (!featuredVideo && videos) {
         var randomIndex = Math.floor(Math.random() * videos.length) + 0;
         this.props.featureVideo(videos[randomIndex]);
      }
   }
   renderListOfVideos = () => {
      const { videos, featuredVideo } = this.props;
      if (!videos || !featuredVideo) {
         return null;
      }
      //Show thumbnails for four randomly picked videos each time the page refreshes
      const fourVideos = this.pickFourRandomVideos();
      return fourVideos.map(video => {
         return <Video key={video.videoId} video={video} />;
      });
   };
   //Randomly pick four videos' thumbnails
   pickFourRandomVideos() {
      const { videos, featuredVideo } = this.props;
      //Generate four random index numbers
      var fourRandomIndex = [];
      while (fourRandomIndex.length < 4) {
         var randomIndex = Math.floor(Math.random() * videos.length) + 0;
         if (!fourRandomIndex.includes(randomIndex)) {
            fourRandomIndex.push(randomIndex);
         }
      }
      //Use videos with index matching the randomly generated ones && which are not the featured video
      return videos.filter(
         (video, index) => fourRandomIndex.includes(index) && video.videoId !== featuredVideo.videoId
      );
   }
   render() {
      const { featuredVideo } = this.props;
      return (
         <div className="blacksmith">
            {/* Thumbnails */}
            <div className="blacksmith__videos">{this.renderListOfVideos()}</div>
            {/* Open official youtube channel as a new tab when user clicks on this button */}
            <div
               className="blacksmith__youtube-button"
               onClick={() => window.open('https://www.youtube.com/channel/UCNlglDSoE8oSUgxqhSnDdXw/videos')}
            >
               <i className="fas fa-caret-right" />
            </div>
            {/* Page title */}
            <div className="blacksmith__page-title">BLACKSMITH</div>
            {/* Video player */}
            <FeaturedVideo featuredVideo={featuredVideo} />
            <LiveChat />
            <div className="blacksmith__vertical-line" />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { videos: state.listOfVideos, featuredVideo: state.featuredVideo };
};

export default connect(
   mapStateToProps,
   { fetchVideos, featureVideo }
)(Blacksmith);

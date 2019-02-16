import React from 'react';

import { connect } from 'react-redux';
import { fetchVideos } from '../../actions';
import ListOfVideos from './ListOfVideos';

class Blacksmith extends React.Component {
   state = {
      selectedVideo: null
   };
   componentDidMount() {
      this.props.fetchVideos();
   }

   renderListOfVideos = () => {
      const { videos } = this.props;
      return videos.map(video => {
         return <ListOfVideos key={video.videoId} video={video} />;
      });
   };
   // AIzaSyCLlmdalbMWnp18MSFZllI7h2r71NNq010
   render() {
      return <div>{this.renderListOfVideos()}</div>;
   }
}
const mapStateToProps = state => {
   return { videos: state.listOfVideos };
};

export default connect(
   mapStateToProps,
   { fetchVideos }
)(Blacksmith);

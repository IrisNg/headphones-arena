import React from 'react';

import { connect } from 'react-redux';
import { fetchVideos } from '../../actions';
import Video from './Video';
import FeaturedVideo from './FeaturedVideo';

class Blacksmith extends React.Component {
   componentDidMount() {
      this.props.fetchVideos();
   }

   renderListOfVideos = () => {
      const { videos } = this.props;
      return videos.map(video => {
         return <Video key={video.videoId} video={video} />;
      });
   };
   // AIzaSyCLlmdalbMWnp18MSFZllI7h2r71NNq010
   render() {
      return (
         <div>
            <div>
               <FeaturedVideo />
            </div>
            {this.renderListOfVideos()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { videos: state.listOfVideos };
};

export default connect(
   mapStateToProps,
   { fetchVideos }
)(Blacksmith);

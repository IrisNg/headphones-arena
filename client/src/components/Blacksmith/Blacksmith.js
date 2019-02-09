import React from 'react';
import axios from 'axios';

class Blacksmith extends React.Component {
   state = {
      favouriteVideos: []
   };
   componentDidMount() {
      this.fetchYoutubeChannelDetails();
   }
   fetchYoutubeChannelDetails = async () => {
      const channelId = 'UC3XdYJjWliOdKuZMNaTiP8Q';
      const apiKey = 'AIzaSyCLlmdalbMWnp18MSFZllI7h2r71NNq010';
      const response = await axios.get(
         `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails&id=${channelId}&key=${apiKey}`
      );
      var favoritesPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.favorites;
      if (!favoritesPlaylistId) {
         favoritesPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.likes;
      }
      // console.log(response);
      // console.log(response.data.items[0].contentDetails.relatedPlaylists.favorites);
      const response2 = await axios.get(
         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${favoritesPlaylistId}&key=${apiKey}`
      );
      const fetchedVideos = response2.data.items;
      console.log(fetchedVideos);
      const favoriteVideos = fetchedVideos.map(item => {
         const { thumbnails, title, description, resourceId } = item.snippet;
         return {
            thumbnail: thumbnails.medium.url,
            title,
            description,
            videoId: resourceId.videoId
         };
      });
      this.setState({ favoriteVideos });
      console.log(favoriteVideos);
   };

   listOfVideos = () => {
      if (!this.state.favoriteVideos) {
         return null;
      }
      // console.log('biop');
      return this.state.favoriteVideos.map(video => {
         const videoSrc = `https://www.youtube.com/embed/${video.videoId}`;
         console.log('biiop');
         return (
            <div key={video.videoId}>
               <img src={video.thumbnail} alt={video.title} />
               <div>{video.title}</div>
               <div>{video.description}</div>
               <iframe src={videoSrc} title={video.title} />
            </div>
         );
      });
   };
   // AIzaSyCLlmdalbMWnp18MSFZllI7h2r71NNq010
   render() {
      return <div>{this.listOfVideos()}</div>;
   }
}

export default Blacksmith;

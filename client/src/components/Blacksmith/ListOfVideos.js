import React from 'react';

const ListOfVideos = ({ video: { thumbnail, title, description, videoId } }) => {
   const videoSrc = `https://www.youtube.com/embed/${videoId}`;
   return (
      <div>
         <img src={thumbnail} alt={title} />
         <div>{title}</div>
         <div>{description}</div>
         <iframe src={videoSrc} title={title} />
      </div>
   );
};

export default ListOfVideos;

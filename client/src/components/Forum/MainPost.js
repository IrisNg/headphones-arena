import React from 'react';
import Moment from 'react-moment';

class MainPost extends React.Component {
   //Render tags selected by the author of this post
   renderTags = () => {
      if (this.props.data.tag.length > 0) {
         return this.props.data.tag.map(entry => {
            return (
               <div key={entry.tags}>
                  <h6>{entry.brandAndModel}</h6>
                  <p>
                     {entry.tags.map(tag => {
                        return (
                           <span className="post__tag" key={tag}>
                              {tag}
                           </span>
                        );
                     })}
                  </p>
               </div>
            );
         });
      }
   };

   render() {
      if (!this.props.data) {
         return <div>Loading</div>;
      }
      var { title, created, content, vote, author } = this.props.data;
      return (
         <div className="main-post">
            {/* Date */}
            <Moment format="D MMM YYYY" withTitle>
               {created}
            </Moment>
            <div>
               {/* Title */}
               <div className="main-post__title">{title}</div>
               {/* Tags */}
               {this.renderTags()}
               {/* Content */}
               <p className="main-post__content">{content}</p>
               {/* Metadata */}
               <div className="main-post__metadata">
                  <h4>{author.username}</h4>
                  <h6>{vote}</h6>
               </div>
            </div>
         </div>
      );
   }
}

export default MainPost;

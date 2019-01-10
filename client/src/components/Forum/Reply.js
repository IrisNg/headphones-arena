import React from 'react';
import Moment from 'react-moment';

class Reply extends React.Component {
   renderTags = () => {
      if (this.props.data.tag.length > 0) {
         this.props.data.tag.map(entry => {
            return (
               <div>
                  <h6>{entry.brandAndModel}</h6>
                  <p>{entry.tags}</p>
               </div>
            );
         });
      }
   };

   render() {
      if (!this.props.data) {
         return <div>Loading</div>;
      }
      var { created, content, vote, author } = this.props.data;
      return (
         <div>
            <Moment format="D MMM YYYY" withTitle>
               {created}
            </Moment>
            <div>
               {this.renderTags()} <p className="main-post-content">{content}</p>
               <div className="main-post-metadata">
                  <h4>{author.username}</h4>
                  <h6>{vote}</h6>
               </div>
            </div>
         </div>
      );
   }
}

export default Reply;

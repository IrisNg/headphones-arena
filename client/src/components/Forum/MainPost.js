import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { selectHeadphoneUsingNameOnly } from '../../actions';
import history from '../../history';
import Vote from './Vote';

class MainPost extends React.Component {
   //Render tags selected by the author of this post
   renderTags = () => {
      var {
         data: { tag }
      } = this.props;
      if (tag.length === 0) {
         return null;
      }
      return tag.map(entry => {
         return (
            <div key={entry.tags}>
               {/* Tagged headphone's name */}
               {/* If user clicks on the name of this tagged headphone, add this headphone to the list of selected headphones in /arena page */}
               <h6
                  onClick={() => {
                     this.props.selectHeadphoneUsingNameOnly(entry.brandAndModel);
                  }}
               >
                  {entry.brandAndModel}
               </h6>
               {/* List of tags associated with this headphone */}
               <p>
                  {entry.tags.map(tag => (
                     <span className="post__tag" key={tag}>
                        {tag}
                     </span>
                  ))}
               </p>
            </div>
         );
      });
   };
   renderEditButton() {
      var { author, _id } = this.props.data;
      var { currentUser } = this.props;
      return currentUser && author.id === currentUser.id ? (
         <i className="fas fa-edit" onClick={() => history.push(`/posts/${_id}/edit`)} />
      ) : null;
   }

   render() {
      if (!this.props.data) {
         return <div>Loading</div>;
      }
      var { title, created, content, author, vote, _id } = this.props.data;
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
                  <h4 onClick={() => history.push(`/user/${author.id}`)}>{author.username}</h4>
                  <Vote vote={vote} id={_id} mainPostId={_id} />
               </div>
               {/* Edit button (If current user is the author of this post) */}
               {this.renderEditButton()}
            </div>
         </div>
      );
   }
}

export default connect(
   null,
   { selectHeadphoneUsingNameOnly }
)(MainPost);

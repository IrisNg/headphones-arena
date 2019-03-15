import React from 'react';
import history from '../../history';
import Moment from 'react-moment';
import ReplyCreate from './ReplyCreate';
import Vote from './Vote';

class MainPost extends React.Component {
   state = {
      renderReplyCreate: false
   };
   renderAvatar() {
      const {
         profile: { picture },
         id
      } = this.props.data.author;
      return picture ? <img className="reply__avatar" src={picture} alt="user avatar" onClick={() => history.push(`/dashboard/${id}`)} /> : null;
   }
   //Render tags selected by the author of this post
   renderTags = () => {
      const {
         data: { tag }
      } = this.props;
      if (tag.length === 0) {
         return null;
      }
      return tag.map(entry => {
         return (
            <div key={entry.tags} className="main-post__tag-item">
               {/* Tagged headphone's name */}
               {/* If user clicks on the name of this tagged headphone, add this headphone to the list of selected headphones in /arena page */}
               <h6
                  className="main-post__tagged-headphone"
                  onClick={() => {
                     this.props.selectHeadphoneUsingNameOnly(entry.brandAndModel);
                  }}
               >
                  {entry.brandAndModel.toUpperCase()}
               </h6>
               {/* List of tags associated with this headphone */}
               <div className="main-post__tags">
                  {entry.tags.map(tag => (
                     <div className="main-post__tag" key={tag}>
                        {tag.toUpperCase()}
                     </div>
                  ))}
               </div>
            </div>
         );
      });
   };
   renderEditButton() {
      const { author, _id } = this.props.data;
      const { currentUser } = this.props;
      return currentUser && author.id === currentUser.id ? <i className="fas fa-edit" onClick={() => history.push(`/edit-post/${_id}`)} /> : null;
   }
   //Render the create reply form
   renderReplyCreate() {
      if (!this.state.renderReplyCreate) {
         return null;
      }
      const { _id, title, category } = this.props.data;
      return <ReplyCreate idToReplyTo={_id} title={title} category={category} turnOffReplyCreate={this.turnOffReplyCreate} mainPostId={_id} />;
   }
   turnOffReplyCreate = () => {
      //Callback to be passed as a prop to ReplyCreate component to turn off its display after reply has been created
      this.setState({ renderReplyCreate: false });
   };

   render() {
      if (!this.props.data) {
         return <div>Loading</div>;
      }
      const { title, created, content, author, vote, _id, category } = this.props.data;
      return (
         <div className="main-post">
            {/* Title */}
            <div className="main-post__title">
               <span>{title}</span>
            </div>
            {/* Category */}
            <div className="main-post__category">{category}</div>
            <div className="main-post__container">
               {/* Date */}
               <Moment format="DD MMM YYYY" withTitle className="main-post__date">
                  {created}
               </Moment>
               <div className="main-post__body">
                  <div className="main-post__author">
                     {/* Author Avatar */}
                     {this.renderAvatar()}
                     {/* Author Username */}
                     <h4 className="main-post__username" onClick={() => history.push(`/dashboard/${author.id}`)}>
                        {author.username}
                     </h4>
                  </div>
                  {/* Content */}
                  <p className="main-post__content">{content}</p>
               </div>
               {/* Tags */}
               <div className="main-post__tag-container">{this.renderTags()}</div>
               {/* Create reply form */}
               {this.renderReplyCreate()}
               {/* Edit button (If current user is the author of this post) */}
               <div className="main-post__edit-button">{this.renderEditButton()}</div>
            </div>
            {/* Create Reply Button  */}
            <div onClick={() => this.setState({ renderReplyCreate: true })} className="main-post__create-reply-button">
               <i className="far fa-comment-alt" />
            </div>
            {/* Vote */}
            <Vote vote={vote} id={_id} mainPostId={_id} />
            <div className="main-post__horizontal-line-1" />
         </div>
      );
   }
}

export default MainPost;

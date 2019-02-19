import React from 'react';
import Moment from 'react-moment';
import history from '../../history';
import ReplyCreate from './ReplyCreate';
import Vote from './Vote';

class Reply extends React.Component {
   state = {
      renderReplyCreate: false
   };
   renderAvatar() {
      var {
         profile: { picture },
         id
      } = this.props.data.author;
      return picture ? (
         <img className="reply__avatar" src={picture} alt="user avatar" onClick={() => history.push(`/user/${id}`)} />
      ) : null;
   }
   //Render tags selected by the author of this reply
   renderTags = () => {
      var { data } = this.props;
      if (data.tag.length === 0) {
         return null;
      }
      return data.tag.map(entry => {
         return (
            <div key={entry.tags} className="reply__tag-item">
               <h6
                  className="reply__tagged-headphone"
                  onClick={() => {
                     this.props.selectHeadphoneUsingNameOnly(entry.brandAndModel);
                  }}
               >
                  {entry.brandAndModel.toUpperCase()}
               </h6>
               <div className="reply__tags">
                  {entry.tags.map(tag => {
                     return (
                        <div className="reply__tag" key={tag}>
                           {tag.toUpperCase()}
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      });
   };
   //Render replies to this reply
   renderReplies = () => {
      var { data, selectHeadphoneUsingNameOnly } = this.props;
      if (data.replies.length === 0) {
         return null;
      }
      return data.replies.map(reply => (
         <Reply
            key={reply._id}
            data={reply}
            allowReply={this.props.tier < 3}
            tier={this.props.tier + 1}
            mainPostId={this.props.mainPostId}
            currentUser={this.props.currentUser}
            selectHeadphoneUsingNameOnly={selectHeadphoneUsingNameOnly}
         />
      ));
   };

   //Render the button that triggers the create reply form
   //Restrict reply creation after a certain nested level
   //To prevent database from exploding and text from becoming too squashed up
   renderButtonToTriggerReplyCreate = () => {
      if (!this.props.allowReply) {
         return null;
      }
      return (
         <div
            //Make this button disappear after ReplyCreate component appear
            className="reply__create-reply-button"
            style={this.manageReplyCreateButton()}
            onClick={() => this.setState({ renderReplyCreate: true })}
         >
            <i className="far fa-comment-alt" />
         </div>
      );
   };
   manageReplyCreateButton() {
      return this.state.renderReplyCreate ? { display: 'none' } : null;
   }
   //Render the create reply form
   renderReplyCreate() {
      if (!this.state.renderReplyCreate) {
         return null;
      }
      var { _id, title, category } = this.props.data;
      return (
         <ReplyCreate
            idToReplyTo={_id}
            title={title}
            category={category}
            mainPostId={this.props.mainPostId}
            turnOffReplyCreate={this.turnOffReplyCreate}
         />
      );
   }
   //Callback to be passed as a prop to ReplyCreate component to turn off its display after reply has been created
   turnOffReplyCreate = () => {
      this.setState({ renderReplyCreate: false });
   };
   renderEditButton = () => {
      var {
         data: { author, _id },
         currentUser
      } = this.props;
      if (!currentUser || author.id !== currentUser.id) {
         return null;
      }
      return <i className="fas fa-edit" onClick={() => history.push(`/edit-post/${_id}`)} />;
   };

   render() {
      if (!this.props.data) {
         return <div />;
      }
      var { created, content, author, vote, _id } = this.props.data;
      return (
         <div className="reply">
            {/* Date */}
            <Moment format="DD MMM YYYY" withTitle className="reply__date">
               {created}
            </Moment>
            <div className="reply__body">
               <div className="reply__author">
                  {/* Author Avatar */}
                  {this.renderAvatar()}
                  {/* Author Username */}
                  <h4 className="reply__username" onClick={() => history.push(`/user/${author.id}`)}>
                     {author.username}
                  </h4>
               </div>
               {/* Content */}
               <p className="reply__content">{content}</p>
            </div>
            {/* Tags */}
            <div className="reply__tag-container">{this.renderTags()}</div>
            {/* Create reply form */}
            {this.renderReplyCreate()}
            <div className="reply__buttons">
               {/* Vote */}
               <Vote vote={vote} id={_id} mainPostId={this.props.mainPostId} />
               {/* Create Reply Button  */}
               {this.renderButtonToTriggerReplyCreate()}
               {/* Edit button (If current user is the author of this reply) */}
               <div className="reply__edit-button">{this.renderEditButton()}</div>
            </div>
            {/* Replies to this reply */}
            <div className="reply__sub-replies">{this.renderReplies()}</div>
         </div>
      );
   }
}

export default Reply;

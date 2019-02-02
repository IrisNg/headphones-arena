import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { selectHeadphoneUsingNameOnly } from '../../actions';
import history from '../../history';
import ReplyCreate from './ReplyCreate';
import Vote from './Vote';
import './Reply.css';

class Reply extends React.Component {
   state = {
      renderReplyCreate: false
   };
   //Render tags selected by the author of this reply
   renderTags = () => {
      var { data } = this.props;
      if (data.tag.length === 0) {
         return null;
      }
      return data.tag.map(entry => {
         return (
            <div key={entry.tags}>
               <h6
                  onClick={() => {
                     this.props.selectHeadphoneUsingNameOnly(entry.brandAndModel);
                  }}
               >
                  {entry.brandAndModel}
               </h6>
               <p>
                  {entry.tags.map(tag => {
                     return (
                        <span className="reply__tag" key={tag}>
                           {tag}
                        </span>
                     );
                  })}
               </p>
            </div>
         );
      });
   };
   //Render replies to this reply
   renderReplies = () => {
      var { data } = this.props;
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
            style={this.manageReplyCreateButton()}
            onClick={() => this.setState({ renderReplyCreate: true })}
         >
            +
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
      return <i className="fas fa-edit" onClick={() => history.push(`/posts/${_id}/edit`)} />;
   };

   render() {
      if (!this.props.data) {
         return <div />;
      }
      var { created, content, author, vote, _id } = this.props.data;
      return (
         <div className="reply-thread">
            <div className="reply">
               {/* Date */}
               <Moment format="D MMM YYYY" withTitle>
                  {created}
               </Moment>
               {/* Tags */}
               <div>{this.renderTags()}</div>
               {/* Content */}
               <p>{content}</p>
               {/* Metadata */}
               <div>
                  <h4 onClick={() => history.push(`/user/${author.id}`)}>{author.username}</h4>
                  <Vote vote={vote} id={_id} mainPostId={this.props.mainPostId} />
               </div>
               {/* Edit button (If current user is the author of this reply) */}
               {this.renderEditButton()}
            </div>
            {/* Replies to this reply */}
            {this.renderReplies()}
            {/* '+' Button  */}
            {this.renderButtonToTriggerReplyCreate()}
            {/* Create reply form */}
            {this.renderReplyCreate()}
         </div>
      );
   }
}

export default connect(
   null,
   { selectHeadphoneUsingNameOnly }
)(Reply);

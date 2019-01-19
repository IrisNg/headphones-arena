import React from 'react';
import Moment from 'react-moment';
import ReplyCreate from './ReplyCreate';
import Vote from './Vote';
import './Reply.css';

class Reply extends React.Component {
   state = {
      renderReplyCreate: false
   };
   //Render tags selected by the author of this reply
   renderTags = () => {
      if (this.props.data.tag.length > 0) {
         return this.props.data.tag.map(entry => {
            return (
               <div key={entry.tags}>
                  <h6>{entry.brandAndModel}</h6>
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
      }
   };
   //Render replies to this reply
   renderReplies = () => {
      if (this.props.data.replies.length > 0) {
         return this.props.data.replies.map(reply => (
            <Reply
               key={reply._id}
               data={reply}
               allowReply={this.props.tier < 3 ? true : false}
               tier={this.props.tier + 1}
               mainPostId={this.props.mainPostId}
            />
         ));
      } else {
         return null;
      }
   };

   //Render the button that triggers the create reply form
   //Restrict reply creation after a certain nested level
   //To prevent database from exploding and text from becoming too squashed up
   allowReplyCreate = () => {
      if (this.props.allowReply) {
         return (
            <div
               //Make this button disappear after ReplyCreate component appear
               style={this.state.renderReplyCreate ? { display: 'none' } : null}
               onClick={() => this.setState({ renderReplyCreate: true })}
            >
               +
            </div>
         );
      }
   };
   //Render the create reply form
   renderReplyCreate() {
      if (this.state.renderReplyCreate) {
         const { _id, title } = this.props.data;
         return (
            <ReplyCreate
               idToReplyTo={_id}
               title={title}
               mainPostId={this.props.mainPostId}
               turnOffReplyCreate={this.turnOffReplyCreate}
            />
         );
      }
   }
   turnOffReplyCreate = () => {
      //Callback to be passed as a prop to ReplyCreate component to turn off its display after reply has been created
      this.setState({ renderReplyCreate: false });
   };

   render() {
      if (!this.props.data) {
         return <div>Loading</div>;
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
                  <h4>{author.username}</h4>
                  <Vote vote={vote} id={_id} mainPostId={this.props.mainPostId} />
               </div>
            </div>
            {/* Replies to this reply */}
            {this.renderReplies()}
            {/* '+' Button  */}
            {this.allowReplyCreate()}
            {/* Create reply form */}
            {this.renderReplyCreate()}
         </div>
      );
   }
}

export default Reply;

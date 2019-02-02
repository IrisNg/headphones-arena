import React from 'react';
import { connect } from 'react-redux';
import { fetchPost } from '../../actions';
import MainPost from './MainPost';
import Reply from './Reply';
import ReplyCreate from './ReplyCreate';
import './PostShow.css';

class PostShow extends React.Component {
   state = {
      renderReplyCreate: false
   };
   //Fetch all data related to this thread from the server
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
   }
   //Render replies of this thread
   renderReplies = () => {
      var { post, currentUser } = this.props;
      if (!post) {
         return null;
      } else if (post.replies.length === 0) {
         return null;
      }
      return post.replies.map(reply => (
         <Reply
            key={reply._id}
            data={reply}
            allowReply={true}
            tier={1}
            mainPostId={post._id}
            currentUser={currentUser}
         />
      ));
   };
   //Render the create reply form
   renderReplyCreate() {
      if (!this.state.renderReplyCreate) {
         return null;
      }
      var { _id, title, category } = this.props.post;
      return (
         <ReplyCreate
            idToReplyTo={_id}
            title={title}
            category={category}
            turnOffReplyCreate={this.turnOffReplyCreate}
            mainPostId={_id}
         />
      );
   }
   turnOffReplyCreate = () => {
      //Callback to be passed as a prop to ReplyCreate component to turn off its display after reply has been created
      this.setState({ renderReplyCreate: false });
   };
   manageReplyCreateButton() {
      return this.state.renderReplyCreate ? { display: 'none' } : null;
   }
   render() {
      var { post, currentUser } = this.props;
      return (
         <div className="post-show">
            {/* Main Post */}
            <MainPost data={post} currentUser={currentUser} />
            {/* Direct Replies */}
            {this.renderReplies()}
            {/* '+' Button  */}
            <div
               //Make this button disappear after ReplyCreate component appear
               style={this.manageReplyCreateButton()}
               onClick={() => this.setState({ renderReplyCreate: true })}
            >
               +
            </div>
            {/* Create reply form */}
            {this.renderReplyCreate()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchPost }
)(PostShow);

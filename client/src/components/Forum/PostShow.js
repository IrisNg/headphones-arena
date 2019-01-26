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
      // 5c36e731bda9ed37d9d26af9
   }
   //Render replies of this thread
   renderReplies = () => {
      if (this.props.post) {
         if (this.props.post.replies.length > 0) {
            return this.props.post.replies.map(reply => (
               <Reply
                  key={reply._id}
                  data={reply}
                  allowReply={true}
                  tier={1}
                  mainPostId={this.props.post._id}
                  currentUser={this.props.currentUser}
               />
            ));
         }
      }
   };
   //Render the create reply form
   renderReplyCreate() {
      if (this.state.renderReplyCreate) {
         const { _id, title, category } = this.props.post;
         return (
            <ReplyCreate
               idToReplyTo={_id}
               title={title}
               category={category}
               turnOffReplyCreate={this.turnOffReplyCreate}
               mainPostId={this.props.post._id}
            />
         );
      }
   }
   turnOffReplyCreate = () => {
      //Callback to be passed as a prop to ReplyCreate component to turn off its display after reply has been created
      this.setState({ renderReplyCreate: false });
   };
   render() {
      return (
         <div className="post-show">
            {/* Main Post */}
            <MainPost data={this.props.post} currentUser={this.props.currentUser} />
            {/* Direct Replies */}
            {this.renderReplies()}
            {/* '+' Button  */}
            <div
               //Make this button disappear after ReplyCreate component appear
               style={this.state.renderReplyCreate ? { display: 'none' } : null}
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

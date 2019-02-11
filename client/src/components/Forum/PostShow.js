import React from 'react';
import { connect } from 'react-redux';
import { fetchPost, selectHeadphoneUsingNameOnly } from '../../actions';
import MainPost from './MainPost';
import Reply from './Reply';
import LiveChat from '../LiveChat/LiveChat';
import './PostShow.css';

class PostShow extends React.Component {
   //Fetch all data related to this thread from the server
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
   }
   //Render replies of this thread
   renderReplies = () => {
      var { post, currentUser, selectHeadphoneUsingNameOnly } = this.props;
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
            selectHeadphoneUsingNameOnly={selectHeadphoneUsingNameOnly}
         />
      ));
   };

   render() {
      var { post, currentUser, selectHeadphoneUsingNameOnly } = this.props;
      if (!post || post._id !== this.props.match.params.id) {
         return <div />;
      }
      return (
         <div className="post-show">
            {/* Main Post */}
            <MainPost
               data={post}
               currentUser={currentUser}
               selectHeadphoneUsingNameOnly={selectHeadphoneUsingNameOnly}
            />
            {/* Direct Replies */}
            <div className="post-show__replies">{this.renderReplies()}</div>
            <div className="post-show__vertical-lines-1" />
            <LiveChat />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchPost, selectHeadphoneUsingNameOnly }
)(PostShow);

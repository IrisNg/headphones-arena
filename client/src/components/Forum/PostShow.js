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
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
      // 5c36e731bda9ed37d9d26af9
   }
   renderReplies = () => {
      if (this.props.post) {
         if (this.props.post.replies.length > 0) {
            return this.props.post.replies.map(reply => <Reply key={reply._id} data={reply} />);
         }
      }
   };
   renderReplyCreate() {
      if (this.state.renderReplyCreate) {
         const { _id, title } = this.props.post;
         return <ReplyCreate idToReplyTo={_id} title={title} />;
      }
   }
   render() {
      console.log(this.props.post);
      return (
         <div>
            WHAT IS THIS
            <MainPost data={this.props.post} />
            {this.renderReplies()}
            <div
               className={this.state.renderReplyCreate ? 'hide' : ''}
               onClick={() => this.setState({ renderReplyCreate: true })}
            >
               +
            </div>
            {this.renderReplyCreate()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post };
};

export default connect(
   mapStateToProps,
   { fetchPost }
)(PostShow);

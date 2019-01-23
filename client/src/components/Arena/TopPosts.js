import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import history from '../../history';
import { fetchTopPosts } from '../../actions';

class TopPosts extends React.Component {
   componentDidMount() {
      this.props.fetchTopPosts({
         brandAndModel: this.props.headphone.brandAndModel,
         model: this.props.headphone.model
      });
   }
   //If user clicks on the title of this post, redirect to this post's show page
   redirectToMainPost = async post => {
      if (post.isMainPost) {
         history.push(`/posts/${post._id}`);
      } else {
         //If this post is a reply, find the main post and then redirect the user
         const response = await axios.post('/posts/find-main', { title: post.title });
         history.push(`/posts/${response.data._id}`);
      }
   };
   renderTopPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            <div onClick={() => this.redirectToMainPost(post)}>{post.title}</div>
            <div>{post.content.substring(0, 100)}</div>
         </div>
      ));
   }

   render() {
      const { topPosts } = this.props;
      return <div>{topPosts && topPosts.length > 0 ? this.renderTopPosts(topPosts) : null}</div>;
   }
}
const mapStateToProps = (state, ownProps) => {
   var entry = state.topPosts.find(entry => entry.headphone === ownProps.headphone.brandAndModel);
   return { topPosts: entry ? entry.topPosts : null };
};
export default connect(
   mapStateToProps,
   { fetchTopPosts }
)(TopPosts);

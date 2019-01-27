import React from 'react';
import { connect } from 'react-redux';
import { fetchTopPosts, redirectToMainPost } from '../../actions';

class TopPosts extends React.Component {
   componentDidMount() {
      this.props.fetchTopPosts({
         brandAndModel: this.props.headphone.brandAndModel,
         model: this.props.headphone.model
      });
   }
   renderTopPosts(posts) {
      return posts.map(post => (
         <div key={post._id}>
            {/* If user clicks on the title of this post, redirect to this post's show page */}
            <div onClick={() => this.props.redirectToMainPost(post)}>{post.title}</div>
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
   { fetchTopPosts, redirectToMainPost }
)(TopPosts);

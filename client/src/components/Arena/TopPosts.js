import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { fetchTopPosts, redirectToMainPost } from '../../actions';

class TopPosts extends React.Component {
   componentDidMount() {
      var { brandAndModel, model } = this.props.headphone;
      this.props.fetchTopPosts({ brandAndModel, model });
   }
   renderTopPosts(posts) {
      return posts.map(post => (
         <div key={post._id} className="top-posts__post" onClick={() => this.props.redirectToMainPost(post)}>
            {/* If user clicks on the title of this post, redirect to this post's show page */}
            <div className="top-posts__title">{post.title}</div>
            <div className="top-posts__content">{`${post.content}`}</div>
            {/* Date */}
            <div className="top-posts__date">
               <div>
                  {this.manageVoteIcon(post)}
                  {post.vote.count}
               </div>
               <Moment format="DD MMM 'YY">{post.created}</Moment>
            </div>
         </div>
      ));
   }
   manageVoteIcon(post) {
      return post.vote.count >= 0 ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />;
   }
   render() {
      var { topPosts } = this.props;
      if (!topPosts) {
         return <div />;
      }
      return (
         <div className="top-posts">
            <h4>RELATED POSTS</h4> {this.renderTopPosts(topPosts)}
         </div>
      );
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

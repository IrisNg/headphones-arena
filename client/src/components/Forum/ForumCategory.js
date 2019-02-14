import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { redirectToMainPost } from '../../actions';

class ForumCategory extends React.Component {
   renderCategoryPosts = () => {
      var { category, posts } = this.props;
      if (!posts) {
         return null;
      }
      if (category === 'review' || category === 'general') {
         posts = posts.slice(0, posts.length - 1);
      }
      return posts.map(post => (
         // If user clicks on the title of this post, redirect to this post's show page
         <div key={post._id} className="forum-category__post" onClick={() => this.props.redirectToMainPost(post)}>
            <div className="forum-category__post-container">
               <h4 className="forum-category__post-title">{post.title}</h4>
               <p className="forum-category__post-content">{`${post.content.substring(
                  0,
                  260 - post.title.length
               )}...`}</p>
            </div>
            <div className="forum-category__post-metadata">
               <Moment fromNow className="forum-category__post-date">
                  {post.created}
               </Moment>
               <div className="forum-category__post-vote">
                  {this.manageVoteIcon(post)}
                  {post.vote.count}
               </div>
            </div>
         </div>
      ));
   };
   manageVoteIcon(post) {
      return post.vote.count >= 0 ? (
         <i className="fas fa-caret-up forum-category__post-vote-icon" />
      ) : (
         <i className="fas fa-caret-down forum-category__post-vote-icon" />
      );
   }
   render() {
      var { category, searchActive } = this.props;
      if (searchActive) {
         return <div />;
      }
      return (
         <div className={`forum-category forum-category-${category}`}>
            {/* Latest and Hottest posts under this category */}
            {this.renderCategoryPosts()}
         </div>
      );
   }
}

export default connect(
   null,
   { redirectToMainPost }
)(ForumCategory);

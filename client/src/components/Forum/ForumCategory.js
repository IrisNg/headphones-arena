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
         posts = posts.splice(0, 1);
      }
      return posts
         .map(post => (
            <div key={post._id} className="forum-category__post">
               <div className="forum-category__post-container">
                  {/* If user clicks on the title of this post, redirect to this post's show page */}
                  <h4 className="forum-category__post-title" onClick={() => this.props.redirectToMainPost(post)}>
                     {post.title}
                  </h4>
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
                     {post.vote.count > 0 ? <i className="fas fa-angle-up" /> : <i className="fas fa-angle-down" />}
                     {post.vote.count}
                  </div>
               </div>
            </div>
         ))
         .slice(0, 2);
   };
   render() {
      if (this.props.searchActive) {
         return <div />;
      }
      var { category } = this.props;
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

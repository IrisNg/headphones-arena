import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { redirectToMainPost } from '../../actions';

class ForumCategory extends React.Component {
   renderCategoryPosts = posts => {
      if (this.props.category === 'review' || 'general') {
         posts.splice(4, 1);
      }
      return posts.map(post => (
         <div key={post._id} className="forum-category__post">
            {/* If user clicks on the title of this post, redirect to this post's show page */}
            <h4 className="forum-category__post-title" onClick={() => this.props.redirectToMainPost(post)}>
               {post.title}
            </h4>
            <p className="forum-category__post-content">{`${post.content.substring(0, 100)}...`}</p>
            <div className="forum-category__post-metadata">
               <Moment fromNow className="forum-category__post-date">
                  {post.created}
               </Moment>
               <div className="forum-category__post-vote">{post.vote.count}</div>
            </div>
         </div>
      ));
   };
   render() {
      if (this.props.searchActive) {
         return <div />;
      }
      const { category, posts } = this.props;
      return (
         <div className={`forum-category forum-category-${category}`}>
            {/* Latest and Hottest posts under this category */}
            {posts ? this.renderCategoryPosts(posts) : null}
            {/* Category Name */}
            <h3 className="forum-category__name">{category ? category.toUpperCase() : null}</h3>
         </div>
      );
   }
}

export default connect(
   null,
   { redirectToMainPost }
)(ForumCategory);

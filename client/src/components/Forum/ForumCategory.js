import React from 'react';
import Moment from 'react-moment';
import { Redirect } from 'react-router-dom';

class ForumCategory extends React.Component {
   state = {
      redirect: ''
   };
   renderCategoryPosts = posts => {
      return posts.map(post => (
         <div key={post._id} className="forum-category__post">
            <h4 className="forum-category__post-title" onClick={() => this.setState({ redirect: post._id })}>
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
      if (this.state.redirect) {
         return <Redirect to={`/posts/${this.state.redirect}`} />;
      }
      if (this.props.searchActive) {
         return <div />;
      }
      const { category, posts } = this.props;
      return (
         <div className={`forum-category forum-category-${category}`}>
            {posts ? this.renderCategoryPosts(posts) : null}
            <h3 className="forum-category__name">{category ? category.toUpperCase() : null}</h3>
         </div>
      );
   }
}

export default ForumCategory;

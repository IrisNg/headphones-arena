import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { Redirect } from 'react-router-dom';

class ForumSearchPosts extends React.Component {
   state = {
      redirect: ''
   };

   renderSearchPosts(posts) {
      return posts.map(post => (
         <div key={post._id} className="forum-search__post">
            <h4 className="forum-search__post-title" onClick={() => this.setState({ redirect: post._id })}>
               {post.title}
            </h4>
            <p className="forum-search__post-content">{`${post.content.substring(0, 100)}...`}</p>
            <div className="forum-search__post-metadata">
               <Moment fromNow className="forum-search__post-date">
                  {post.created}
               </Moment>
               <div>
                  <span className="forum-search__post-vote">{post.vote.count}</span>
                  <span className="forum-search__post-replies">{post.totalReplies}</span>
               </div>
            </div>
         </div>
      ));
   }
   render() {
      if (this.state.redirect) {
         return <Redirect to={`/posts/${this.state.redirect}`} />;
      }
      if (!this.props.searchActive || !this.props.searchPosts) {
         return <div />;
      }
      return <div className="forum-search-posts">{this.renderSearchPosts(this.props.searchPosts)}</div>;
   }
}

const mapStateToProps = state => {
   return { searchPosts: state.forumSearchPosts };
};
export default connect(mapStateToProps)(ForumSearchPosts);

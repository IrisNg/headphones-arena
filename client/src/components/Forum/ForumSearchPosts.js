import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import history from '../../history';

class ForumSearchPosts extends React.Component {
   renderSearchPosts() {
      var { searchPosts } = this.props;
      return searchPosts.map(post => (
         // If user clicks on this post, redirect to this post's show page
         <div key={post._id} className="forum-search__post" onClick={() => history.push(`/show-post/${post._id}`)}>
            <div className="forum-search__post-container">
               {/* Title */}
               <h4 className="forum-search__post-title">{post.title}</h4>
               {/* Content */}
               <p className="forum-search__post-content">{`${post.content.substring(0, 100)}...`}</p>
            </div>
            <div className="forum-search__post-metadata">
               {/* Date */}
               <Moment fromNow className="forum-search__post-date">
                  {post.created}
               </Moment>
               <div>
                  {/* Number of votes */}
                  <span className="forum-search__post-vote">
                     {this.manageVoteIcon(post)}
                     {post.vote.count}
                  </span>
                  {/* Number of replies */}
                  <span>
                     <i className="far fa-comment-alt forum-search__post-reply-icon" />
                     {post.totalReplies}
                  </span>
               </div>
            </div>
         </div>
      ));
   }
   manageVoteIcon(post) {
      return post.vote.count >= 0 ? (
         <i className="fas fa-angle-up forum-search__post-vote-icon" />
      ) : (
         <i className="fas fa-angle-down forum-search__post-vote-icon" />
      );
   }
   render() {
      var { searchPosts, searchActive } = this.props;
      if (!searchActive || !searchPosts) {
         return <div />;
      }
      return <div className="forum-search-posts">{this.renderSearchPosts()}</div>;
   }
}

const mapStateToProps = state => {
   return { searchPosts: state.forumSearchPosts };
};
export default connect(mapStateToProps)(ForumSearchPosts);

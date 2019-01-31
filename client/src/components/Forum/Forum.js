import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { fetchForumHomePosts } from '../../actions';
import ForumCategory from './ForumCategory';
import ForumSearch from './ForumSearch';
import ForumSearchPosts from './ForumSearchPosts';
import LiveChat from '../LiveChat/LiveChat';
import './Forum.css';

class Forum extends React.Component {
   componentDidMount() {
      this.props.fetchForumHomePosts();
   }
   render() {
      if (!this.props.forumPosts) {
         return <div />;
      }
      var {
         forumPosts: { comparison, recommendation, review, general },
         searchTerm
      } = this.props;
      return (
         <div className="forum">
            <div className="forum-contents">
               {/* Page Title */}
               <h1 className="forum-contents__page-title">FORUM</h1>
               {/* Comparison category */}
               <ForumCategory posts={comparison} category={'comparison'} />
               {/* Searchbar */}
               <ForumSearch />
               {/* Search results */}
               {/* Turn ON this component if user is using the searchbar */}
               <ForumSearchPosts searchActive={searchTerm ? true : false} />
               {/* Review category */}
               {/* Turn OFF this component if user is using the searchbar */}
               <ForumCategory posts={review} category={'review'} searchActive={searchTerm ? true : false} />
               {/* General category */}
               {/* Turn OFF this component if user is using the searchbar */}
               <ForumCategory posts={general} category={'general'} searchActive={searchTerm ? true : false} />

               {/* Budget Recommendation category */}
               <ForumCategory posts={recommendation} category={'recommendation'} />
               {/* Category names */}
               <div className="forum-contents__category-names">
                  <h2 className="forum-contents__comparison-name">COMPARISON</h2>
                  <h2 className="forum-contents__review-name">REVIEW</h2>
                  <h2 className="forum-contents__general-name">GENERAL</h2>
                  <h2 className="forum-contents__recommendation-name">RECOMMENDATION</h2>
               </div>
               <div className="forum__vertical-lines" />
            </div>
            <div className="forum__nav-bar-line" />
            <div className="forum__horizontal-lines" />
            {/* Button to redirect to PostCreate */}
            <div className="forum__add-post-button" onClick={() => history.push('/posts/new')}>
               +
            </div>
            <LiveChat />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { forumPosts: state.forumPosts, searchTerm: state.forumSearchTerm };
};

export default connect(
   mapStateToProps,
   { fetchForumHomePosts }
)(Forum);

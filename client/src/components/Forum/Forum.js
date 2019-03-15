import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { fetchForumHomePosts } from '../../actions';
import ForumCategory from './ForumCategory';
import ForumSearch from './ForumSearch';
import ForumSearchPosts from './ForumSearchPosts';
import LiveChat from '../LiveChat/LiveChat';
import ForumStyling from './ForumStyling';
import './Forum.css';

class Forum extends React.Component {
   componentDidMount() {
      this.props.fetchForumHomePosts();
   }
   render() {
      if (!this.props.forumPosts) {
         return <div />;
      }
      const {
         forumPosts: { comparison, recommendation, review, general },
         searchTerm
      } = this.props;
      return (
         <div className="forum">
            <div className="forum-contents">
               {/* Page Title */}
               <h1 className="forum-contents__page-title">FORUM</h1>
               {/* Comparison category */}
               <ForumCategory posts={comparison} category={'comparison'} searchActive={searchTerm} />
               {/* Searchbar */}
               <ForumSearch />
               {/* Search results */}
               {/* Turn ON this component if user is using the searchbar */}
               <ForumSearchPosts searchActive={searchTerm} />
               {/* Review category */}
               {/* Turn OFF this component if user is using the searchbar */}
               <ForumCategory posts={review} category={'review'} searchActive={searchTerm} />
               {/* General category */}
               {/* Turn OFF this component if user is using the searchbar */}
               <ForumCategory posts={general} category={'general'} searchActive={searchTerm} />

               {/* Budget Recommendation category */}
               <ForumCategory posts={recommendation} category={'recommendation'} searchActive={searchTerm} />
               {/* Category names */}
               <ForumStyling />
               <LiveChat />
            </div>
            {/* Button to redirect to PostCreate */}
            <div className="forum__add-post-button" onClick={() => history.push('/create-post')}>
               +
            </div>
            <div className="forum__nav-bar-line" />
            <div className="forum__horizontal-lines" />
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

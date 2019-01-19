import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { fetchForumHomePosts } from '../../actions';
import ForumCategory from './ForumCategory';
import ForumSearch from './ForumSearch';
import ForumSearchPosts from './ForumSearchPosts';
import './Forum.css';

class Forum extends React.Component {
   componentDidMount() {
      this.props.fetchForumHomePosts();
   }
   renderCategories = () => {
      if (this.props.forumPosts) {
         const {
            forumPosts: { comparison, recommendation, review, general }
         } = this.props;
         return (
            <div className="forum-contents">
               <ForumCategory posts={comparison} category={'comparison'} />
               <div className="forum-middle-section">
                  <ForumSearch />
                  <div className="forum-middle-section__categories">
                     <ForumSearchPosts searchActive={this.props.searchTerm ? true : false} />
                     <ForumCategory
                        posts={review}
                        category={'review'}
                        searchActive={this.props.searchTerm ? true : false}
                     />
                     <ForumCategory
                        posts={general}
                        category={'general'}
                        searchActive={this.props.searchTerm ? true : false}
                     />
                  </div>
               </div>
               <ForumCategory posts={recommendation} category={'recommendation'} />
            </div>
         );
      }
   };
   render() {
      return (
         <div className="forum">
            {this.renderCategories()}
            <div className="forum__add-post-button" onClick={() => history.push('/posts/new')}>
               +
            </div>
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

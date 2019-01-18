import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchForumHomePosts } from '../../actions';
import ForumCategory from './ForumCategory';
import ForumSearch from './ForumSearch';
import ForumSearchPosts from './ForumSearchPosts';
import './Forum.css';

class Forum extends React.Component {
   state = {
      redirect: ''
   };
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
               <ForumCategory posts={comparison} category={'comparison'} redirect={this.redirect} />
               <div className="forum-middle-section">
                  <ForumSearch />
                  <div className="forum-middle-section__categories">
                     <ForumSearchPosts searchActive={this.props.searchTerm ? true : false} redirect={this.redirect} />
                     <ForumCategory
                        posts={review}
                        category={'review'}
                        searchActive={this.props.searchTerm ? true : false}
                        redirect={this.redirect}
                     />
                     <ForumCategory
                        posts={general}
                        category={'general'}
                        searchActive={this.props.searchTerm ? true : false}
                        redirect={this.redirect}
                     />
                  </div>
               </div>
               <ForumCategory posts={recommendation} category={'recommendation'} redirect={this.redirect} />
            </div>
         );
      }
   };
   //Callback to redirect
   redirect = path => {
      this.setState({ redirect: path });
   };

   render() {
      if (this.state.redirect) {
         return <Redirect to={this.state.redirect} />;
      }
      return (
         <div className="forum">
            {this.renderCategories()}
            <div className="forum__add-post-button" onClick={() => this.setState({ redirect: '/posts/new' })}>
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

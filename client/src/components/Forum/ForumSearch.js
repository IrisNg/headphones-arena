import React from 'react';
import { connect } from 'react-redux';
import { fetchSearchPosts } from '../../actions';

class ForumSearch extends React.Component {
   onSearchInputChange = e => {
      this.props.fetchSearchPosts(e.target.value);
   };

   render() {
      return (
         <div className="forum-search">
            <div className="forum-search__box" />
            <input
               type="text"
               className="forum-search__input"
               value={this.props.searchTerm}
               onChange={this.onSearchInputChange}
            />
            <div className="forum-search__box" />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { searchTerm: state.forumSearchTerm };
};
export default connect(
   mapStateToProps,
   { fetchSearchPosts }
)(ForumSearch);

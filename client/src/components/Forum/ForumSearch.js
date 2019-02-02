import React from 'react';
import { connect } from 'react-redux';
import { fetchSearchPosts } from '../../actions';

class ForumSearch extends React.Component {
   onSearchInputChange = e => {
      this.props.fetchSearchPosts(e.target.value);
   };

   render() {
      var { searchTerm } = this.props;
      return (
         <div className="forum-search">
            <i className="fas fa-search forum-search__icon" style={searchTerm ? { display: 'none' } : null} />
            <input
               type="text"
               className="forum-search__input"
               value={searchTerm}
               onChange={this.onSearchInputChange}
               style={searchTerm ? { borderColor: '#c00603' } : null}
            />
            <div className="forum-search__box" style={searchTerm ? { backgroundColor: '#c00603' } : null} />
            <div className="forum-search__box" style={searchTerm ? { backgroundColor: '#c00603' } : null} />
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

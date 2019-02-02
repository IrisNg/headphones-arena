import React from 'react';
import { connect } from 'react-redux';
import { fetchSearchPosts } from '../../actions';

class ForumSearch extends React.Component {
   onSearchInputChange = e => {
      this.props.fetchSearchPosts(e.target.value);
   };
   manageSearchStyle(element) {
      const { searchTerm } = this.props;
      if (!searchTerm) {
         return null;
      }
      switch (element) {
         case 'box':
            return { backgroundColor: '#c00603' };
         case 'icon':
            return { display: 'none' };
         case 'input':
            return { borderColor: '#c00603' };
         default:
            return null;
      }
   }
   render() {
      var { searchTerm } = this.props;
      return (
         <div className="forum-search">
            <i className="fas fa-search forum-search__icon" style={this.manageSearchStyle('icon')} />
            <input
               type="text"
               className="forum-search__input"
               value={searchTerm}
               onChange={this.onSearchInputChange}
               style={this.manageSearchStyle('input')}
            />
            <div className="forum-search__box" style={this.manageSearchStyle('box')} />
            <div className="forum-search__box" style={this.manageSearchStyle('box')} />
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

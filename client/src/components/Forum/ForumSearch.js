import React from 'react';
import { connect } from 'react-redux';
import { fetchSearchPosts } from '../../actions';

class ForumSearch extends React.Component {
   onSearchInputChange = e => {
      this.props.fetchSearchPosts(e.target.value);
   };

   calculateReplies() {
      if (this.props.searchPosts) {
         return this.props.searchPosts.map(post => {
            var totalReplies = 0;
            if (post.replies.length > 0) {
               post.replies.forEach(reply1 => {
                  totalReplies++;
                  if (reply1.replies.length > 0) {
                     reply1.replies.forEach(reply2 => {
                        totalReplies++;
                        if (reply2.replies.length > 0) {
                           reply2.replies.forEach(reply3 => {
                              totalReplies++;
                              if (reply3.replies.length > 0) {
                                 reply3.replies.forEach(reply4 => {
                                    totalReplies++;
                                 });
                              }
                           });
                        }
                     });
                  }
               });
            }
            return { ...post, totalReplies };
         });
      }
   }
   render() {
      //   console.log(this.props.totalReplies);
      //   console.log(this.props.searchPosts);
      console.log(this.calculateReplies());
      return (
         <div>
            SEARCH ME
            <input type="text" value={this.props.searchTerm} onChange={this.onSearchInputChange} />
            <p>{this.props.searchTerm}</p>
            {/* <p>{this.props.searchPosts}</p> */}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { searchTerm: state.forumSearchTerm, searchPosts: state.forumSearchPosts };
};
export default connect(
   mapStateToProps,
   { fetchSearchPosts }
)(ForumSearch);

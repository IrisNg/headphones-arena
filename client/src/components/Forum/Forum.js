import React from 'react';
import { connect } from 'react-redux';
import { fetchForumHomePosts } from '../../actions';
import ForumSearch from './ForumSearch';

class Forum extends React.Component {
   componentDidMount() {
      this.props.fetchForumHomePosts();
   }

   render() {
      console.log(this.props.forumPosts);
      return (
         <div>
            FORUM
            <ForumSearch />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { forumPosts: state.forumPosts };
};

export default connect(
   mapStateToProps,
   { fetchForumHomePosts }
)(Forum);

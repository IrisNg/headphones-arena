import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchPost, updatePost, addGlobalError } from '../../actions';
import history from '../../history';
import TagSystem from './TagSystem';
import Login from '../Authentication/Login';
import './PostEdit.css';

class PostEdit extends React.Component {
   state = {
      outputTags: [],
      content: '',
      prevTags: [],
      postId: ''
   };
   //Fetch post's existing data from server
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
   }
   //Load existing data one time
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.post && nextProps.post._id !== prevState.postId) {
         //DO NOT REFERENCE ARRAY FROM PROPS
         var notReferencedArr = nextProps.post.tag.map(entry => {
            return { brandAndModel: entry.brandAndModel, tags: [...entry.tags] };
         });
         return {
            content: nextProps.post.content,
            prevTags: notReferencedArr,
            postId: nextProps.post._id
         };
      } else if (nextProps.match.params.id !== prevState.postId) {
         nextProps.fetchPost(nextProps.match.params.id);
      }

      return null;
   }
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onFormSubmit = event => {
      event.preventDefault();
      var { currentUser, post, addGlobalError, updatePost } = this.props;
      if (currentUser.id !== post.author.id) {
         //Display this message if current user is NOT the owner of this post
         addGlobalError(
            "I mean, you wish you were the author of this post, but you are not. So you can't edit this post."
         );
      } else {
         //Format object to send to the server
         var updateObj = {
            prevTags: this.state.prevTags,
            body: {
               tag: this.state.outputTags,
               content: this.state.content
            }
         };
         //Check for required fields
         if (!this.state.content) {
            addGlobalError('Please fill in some content at least...GEEZ...');
         } else {
            //Update post in the server database
            updatePost(post._id, updateObj);
            //Update tags in the database also
            this.updateTagsInServer(updateObj);
         }
      }
   };
   updateTagsInServer = async updateObj => {
      try {
         //Remove previous tags from previously tagged headphones
         //Note: this has to come before adding new tags (because $pull in mongodb will wipe ALL tag objects with the specified post id, not just one)
         //So if you add new tags first, then remove, it will wipe the added new tags too
         if (updateObj.prevTags.length > 0) {
            var response1 = await axios.put(`/posts/${this.props.post._id}/removetags`, updateObj);
            console.log(response1);
         }
         if (updateObj.body.tag.length > 0) {
            //Add new tags to newly tagged headphones
            var response2 = await axios.put(`/posts/${this.props.post._id}/addtags`, updateObj);
            console.log(response2);
         }
         history.goBack();
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   askLogin() {
      if (!this.props.currentUser) {
         return <Login />;
      }
   }
   render() {
      var { post } = this.props;
      return (
         <div className="post-edit">
            <h6>Edit Post</h6>
            <form onSubmit={this.onFormSubmit}>
               {/* Tagging Mechanism */}
               <TagSystem
                  previousTags={post ? post.tag : null}
                  compileTags={this.retrieveTagsFromTagSystem}
                  id={post ? post._id : null}
               />
               {/* Post Contents */}
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <input type="submit" />
               <button onClick={() => history.push(`/delete-post/${this.props.match.params.id}`)}>Delete</button>
            </form>
            {this.askLogin()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchPost, updatePost, addGlobalError }
)(PostEdit);

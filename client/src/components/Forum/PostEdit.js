import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchPost, updatePost } from '../../actions';
import TagSystem from './TagSystem';
import './PostEdit.css';

class PostEdit extends React.Component {
   state = {
      outputTags: [],
      content: '',
      prevTags: [],
      hasLoaded: false
   };
   //Fetch post's existing data from server
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
   }
   //Load existing data one time
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.post && !prevState.hasLoaded) {
         //DO NOT REFERENCE ARRAY FROM PROPS
         var notReferencedArr = nextProps.post.tag.map(entry => {
            return { brandAndModel: entry.brandAndModel, tags: [...entry.tags] };
         });
         return {
            content: nextProps.post.content,
            prevTags: notReferencedArr,
            hasLoaded: true
         };
      }
      return null;
   }
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onFormSubmit = event => {
      event.preventDefault();
      //Format object to send to the server
      var updateObj = {
         prevTags: this.state.prevTags,
         body: {
            tag: this.state.outputTags,
            content: this.state.content
         }
      };
      //Update post in the server database
      this.props.updatePost(this.props.post._id, updateObj);
      //Update tags in the database also
      this.updateTagsInServer(updateObj);
   };
   updateTagsInServer = async updateObj => {
      //Remove previous tags from previously tagged headphones
      //Note: this has to come before adding new tags (because $pull in mongodb will wipe ALL tag objects with the specified post id, not just one)
      //So if you add new tags first, then remove, it will wipe the added new tags too
      if (updateObj.prevTags.length > 0) {
         const response1 = await axios.put(`/posts/${this.props.post._id}/removetags`, updateObj);
         console.log(response1);
      }
      if (updateObj.body.tag.length > 0) {
         //Add new tags to newly tagged headphones
         const response2 = await axios.put(`/posts/${this.props.post._id}/addtags`, updateObj);
         console.log(response2);
      }
   };

   render() {
      return (
         <div className="post-edit">
            <h6>Edit Post</h6>
            <form onSubmit={this.onFormSubmit}>
               {/* Tagging Mechanism */}
               <TagSystem
                  previousTags={this.props.post ? this.props.post.tag : null}
                  compileTags={this.retrieveTagsFromTagSystem}
               />
               {/* Post Contents */}
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <input type="submit" />
            </form>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post };
};

export default connect(
   mapStateToProps,
   { fetchPost, updatePost }
)(PostEdit);

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import TagSystem from './TagSystem';
import Login from '../Authentication/Login';
import { fetchPost, addGlobalMessage } from '../../actions';

class ReplyCreate extends React.Component {
   state = {
      idToReplyTo: '',
      title: '',
      category: '',
      outputTags: [],
      content: ''
   };

   componentDidUpdate() {
      // Store the parent post's details in the state
      if (!this.state.idToReplyTo) {
         const { idToReplyTo, title, category } = this.props;
         this.setState({ idToReplyTo, title, category });
      }
   }
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onFormSubmit = event => {
      event.preventDefault();
      //Check authentication
      if (this.props.currentUser) {
         //Check for required fields
         if (!this.state.content) {
            this.props.addGlobalMessage('Please fill in some content for your reply at least...');
         } else {
            //Post new post form to server
            this.postToServer();
         }
      }
   };

   postToServer = async () => {
      //Format object to be posted to the database
      var replyObj = {
         idToReplyTo: this.state.idToReplyTo,
         body: {
            isMainPost: false,
            title: this.state.title,
            tag: this.state.outputTags,
            content: this.state.content,
            category: this.state.category
         }
      };
      try {
         //Create post in database
         const response = await axios.post('/posts', replyObj);
         console.log(response);
         //Add new tags to newly tagged headphones
         if (replyObj.body.tag.length > 0) {
            const response2 = await axios.put(`/posts/${response.data._id}/addtags`, replyObj);
            console.log(response2);
         }
         //Refetch post thread data
         this.props.fetchPost(this.props.mainPostId);
         this.props.addGlobalMessage('Successfully added your Reply. Thanks for sharing!');
         //Turn off this interface afterwards
         this.props.turnOffReplyCreate();
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };
   //Display Login component to remind user to log in before creating a new post
   checkLogin() {
      if (this.props.currentUser) {
         return null;
      }
      return <Login disableParentInterface={this.props.turnOffReplyCreate} />;
   }
   render() {
      return (
         <div className="reply-create">
            <form>
               {/* Tagging Mechanism */}
               <TagSystem compileTags={this.retrieveTagsFromTagSystem} />
               {/* Post Contents */}
               <textarea
                  className="reply-create__content"
                  onChange={e => this.setState({ content: e.target.value })}
                  value={this.state.content}
                  placeholder="Share your thoughts with your fellow Audiophiles ..."
               />
               <div className="reply-create__buttons">
                  <div className="reply-create__submit-button" onClick={this.onFormSubmit}>
                     REPLY
                  </div>
                  <div className="reply-create__refuse-button" onClick={this.props.turnOffReplyCreate}>
                     OOPS!
                  </div>
               </div>
            </form>
            {this.checkLogin()}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { fetchPost, addGlobalMessage }
)(ReplyCreate);

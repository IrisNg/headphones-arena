import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import TagSystem from './TagSystem';
import Login from '../Authentication/Login';
import { fetchPost, addGlobalError } from '../../actions';
import './ReplyCreate.css';

class ReplyCreate extends React.Component {
   state = {
      //From Props
      idToReplyTo: '',
      title: '',
      //Not from props - user inputted
      outputTags: [],
      content: 'What do you want to share with your fellow Audiophiles today?',
      category: ''
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
            this.props.addGlobalError('Please fill in some content for your reply at least...');
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
         //Turn off this interface afterwards
         this.props.turnOffReplyCreate();
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   //Add styling only to selected category
   manageClass(category) {
      return this.state.category === category ? 'active' : '';
   }
   //Display message to remind user to log in before creating a new post
   askLogin() {
      if (!this.props.currentUser) {
         return <Login />;
      }
   }
   render() {
      return (
         <div className="reply-create">
            <h6>New Reply</h6>
            <form onSubmit={this.onFormSubmit}>
               {/* Tagging Mechanism */}
               <TagSystem compileTags={this.retrieveTagsFromTagSystem} />
               {/* Post Contents */}
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <input type="submit" />
            </form>
            {this.askLogin()}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { fetchPost, addGlobalError }
)(ReplyCreate);

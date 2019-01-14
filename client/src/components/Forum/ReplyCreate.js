import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import TagSystem from './TagSystem';
import './ReplyCreate.css';

class ReplyCreate extends React.Component {
   state = {
      //From Props
      idToReplyTo: '',
      title: '',
      //Not from props - user inputted
      outputTags: [],
      content: 'What do you want to share with your fellow Audiophiles today?'
      // redirect: false,
   };

   componentDidUpdate() {
      // Store the parent post's details in the state
      if (!this.state.idToReplyTo) {
         const { idToReplyTo, title } = this.props;
         this.setState({ idToReplyTo, title });
      }
   }
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onFormSubmit = event => {
      event.preventDefault();
      //Post new post form to server
      this.postToServer();
   };

   postToServer = async () => {
      //Format object to be posted to the database
      var replyObj = {
         idToReplyTo: this.state.idToReplyTo,
         body: {
            isMainPost: false,
            title: this.state.title,
            tag: this.state.outputTags,
            content: this.state.content
         }
      };
      //Create post in database
      const response = await axios.post('/replies', replyObj);
      console.log(response);
      //Add new tags to newly tagged headphones
      const response2 = await axios.put(`/posts/${response.data._id}/addtags`, replyObj);
      console.log(response2);
      // this.setState({ redirect: true });
   };
   //Display message to remind user to log in before creating a new post
   loginMessage() {
      if (!this.props.currentUser) {
         return 'Please Login First!';
      }
   }
   //Add styling only to selected category
   manageClass(category) {
      return this.state.category === category ? 'active' : '';
   }
   render() {
      // if (this.state.redirect) {
      //    return <Redirect to="/arena" />;
      // }
      return (
         <div className="reply-create">
            <h6>New Reply</h6>
            <div>{this.loginMessage()}</div>
            <form onSubmit={this.onFormSubmit}>
               {/* Tagging Mechanism */}
               <TagSystem compileTags={this.retrieveTagsFromTagSystem} />
               {/* Post Contents */}
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <input type="submit" />
            </form>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(mapStateToProps)(ReplyCreate);

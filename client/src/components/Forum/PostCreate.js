import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import { fetchListOfHeadphones } from '../../actions';
import TagSystem from './TagSystem';
import './PostCreate.css';

class PostCreate extends React.Component {
   state = {
      title: '',
      // relatedHeadphones: [],
      content: 'What do you want to share with your fellow Audiophiles today?',
      username: '',
      // redirect: false,
      outputTags: []
   };
   //Give me the official list of headphones from the database
   componentDidMount() {
      this.props.fetchListOfHeadphones();
   }

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
      const postObj = {
         title: this.state.title,
         content: this.state.content,
         tag: this.state.outputTags
      };
      const response = await axios.post('/posts', postObj);
      console.log(response);
      if (response === 'Please Login') {
         this.setState({ loginMessage: true });
      }
      // this.setState({ redirect: true });
   };

   loginMessage() {
      if (!this.props.currentUser) {
         return 'Please Login First!';
      }
   }
   render() {
      // if (this.state.redirect) {
      //    return <Redirect to="/arena" />;
      // }
      return (
         <div>
            <h1>New Post</h1>
            <div>{this.loginMessage()}</div>
            <form onSubmit={this.onFormSubmit}>
               <label>Title Of Post</label>
               <input type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
               {/* Tagging Mechanism */}
               <TagSystem nameList={this.props.nameList} compileTags={this.retrieveTagsFromTagSystem} />
               {/* Post Contents */}
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <label>Displayed Username</label>
               <input
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
               />
               <input type="submit" />
            </form>
         </div>
      );
   }
}

//Get the name list of all headphones in the database
const mapStateToProps = state => {
   return { nameList: state.nameList, currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(PostCreate);

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addGlobalError } from '../../actions';
import history from '../../history';
import TagSystem from './TagSystem';
import Login from '../Authentication/Login';
import './PostCreate.css';

class PostCreate extends React.Component {
   state = {
      title: '',
      category: '',
      outputTags: [],
      content: 'What do you want to share with your fellow Audiophiles today?'
   };

   //Store selected category to the state
   onCategoryClick = category => {
      this.setState({ category });
   };
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onFormSubmit = event => {
      event.preventDefault();
      //Check authentication
      if (this.props.currentUser) {
         //Check for required fields
         if (!this.state.title || !this.state.category || !this.state.content) {
            this.props.addGlobalError('Do you have 1 category selected, title and content filled in?');
         } else {
            //Post new post form to server
            this.postToServer();
         }
      }
   };

   postToServer = async () => {
      //Format object to be posted to the database
      var postObj = {
         body: {
            isMainPost: true,
            title: this.state.title,
            category: this.state.category,
            tag: this.state.outputTags,
            content: this.state.content
         }
      };
      try {
         //Create post in database
         const response = await axios.post('/posts', postObj);
         console.log(response);
         if (postObj.body.tag.length > 0) {
            //Add new tags to newly tagged headphones
            const response2 = await axios.put(`/posts/${response.data._id}/addtags`, postObj);
            console.log(response2);
         }
         history.push('/forum');
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
         <div className="post-create">
            {/* Page Title */}
            <h1>New Post</h1>

            <form onSubmit={this.onFormSubmit}>
               {/* Post Title */}
               <label>Title Of Post</label>
               <input type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
               {/* Post Category */}
               <div className="post-create__category">
                  <div className={this.manageClass('Comparison')} onClick={() => this.onCategoryClick('Comparison')}>
                     Comparison
                  </div>
                  <div
                     className={this.manageClass('Recommendation')}
                     onClick={() => this.onCategoryClick('Recommendation')}
                  >
                     Budget Recommendation
                  </div>
                  <div className={this.manageClass('Review')} onClick={() => this.onCategoryClick('Review')}>
                     Review
                  </div>
                  <div className={this.manageClass('General')} onClick={() => this.onCategoryClick('General')}>
                     General Talk
                  </div>
               </div>
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

//Get the name list of all headphones in the database
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};

export default connect(
   mapStateToProps,
   { addGlobalError }
)(PostCreate);

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addGlobalMessage, fetchForumHomePosts } from '../../actions';
import history from '../../history';
import TagSystem from './TagSystem';
import LiveChat from '../LiveChat/LiveChat';
import Login from '../Authentication/Login';
import './PostCreate.css';

class PostCreate extends React.Component {
   state = {
      title: '',
      category: '',
      outputTags: [],
      content: ''
   };

   //Store selected category to the state
   onCategoryClick = category => {
      this.setState({ category });
   };
   //Callback passed as props to child component TagSystem
   retrieveTagsFromTagSystem = outputTags => {
      this.setState({ outputTags });
   };
   onSubmitClick = event => {
      event.preventDefault();
      const { title, category, content } = this.state;
      //Check authentication
      if (this.props.currentUser) {
         //Check for required fields
         if (!title || !category || !content) {
            this.props.addGlobalMessage('Do you have 1 category selected, title and content filled in?');
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
         this.props.fetchForumHomePosts();
         this.props.addGlobalMessage('Your Post has been successfully created! Thanks for sharing :)');
         history.push('/forum');
      } catch (err) {
         this.props.addGlobalMessage(err.response.data);
      }
   };

   //Display Login component to remind user to log in before creating a new post
   checkLogin() {
      if (this.props.currentUser) {
         return null;
      }
      return <Login disableParentInterface={this.onRefuse} />;
   }
   onRefuse() {
      history.goBack();
   }
   //Add styling only to selected category
   manageCategoryClass(category) {
      return this.state.category === category
         ? 'post-create__category post-create__category--active'
         : 'post-create__category';
   }
   render() {
      return (
         <div className="post-create">
            {/* Page Title */}
            <h1 className="post-create__page-title">Make New Post</h1>
            {/* Back Icon */}
            <i className="fas fa-angle-left post-create__back-icon" onClick={this.onRefuse} />
            <form className="post-create__form">
               {/* Post Title */}
               <label className="post-create__label-title">TITLE</label>
               <input
                  type="text"
                  value={this.state.title}
                  onChange={e => this.setState({ title: e.target.value })}
                  className="post-create__input-title"
                  placeholder="How will you title your post?"
               />
               {/* Post Category */}
               <label className="post-create__label-category">CATEGORY</label>
               <div className="post-create__categories">
                  <div className="post-create__categories-container">
                     <div
                        className={this.manageCategoryClass('Comparison')}
                        onClick={() => this.onCategoryClick('Comparison')}
                     >
                        Comparison
                     </div>
                     <div
                        className={this.manageCategoryClass('Recommendation')}
                        onClick={() => this.onCategoryClick('Recommendation')}
                     >
                        Budget Recommendation
                     </div>
                     <div className={this.manageCategoryClass('Review')} onClick={() => this.onCategoryClick('Review')}>
                        Review
                     </div>
                     <div
                        className={this.manageCategoryClass('General')}
                        onClick={() => this.onCategoryClick('General')}
                     >
                        General Talk
                     </div>
                  </div>
               </div>
               {/* Tagging Mechanism */}
               <TagSystem compileTags={this.retrieveTagsFromTagSystem} />
               {/* Post Contents */}
               <textarea
                  value={this.state.content}
                  onChange={e => this.setState({ content: e.target.value })}
                  className="post-create__input-content"
                  placeholder="Share your thoughts with your fellow Audiophiles ..."
               />
               {/* Submit button */}
               <div className="post-create__button-container">
                  <div className="post-create__submit-button" onClick={this.onSubmitClick}>
                     Post!
                  </div>
               </div>
            </form>
            {this.checkLogin()}
            <div className="post-create__horizontal-lines" />
            <div className="post-create__vertical-line" />
            <LiveChat />
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
   { addGlobalMessage, fetchForumHomePosts }
)(PostCreate);

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import { fetchListOfHeadphones } from '../../actions';
import './PostCreate.css';

class PostCreate extends React.Component {
   state = {
      title: '',
      // relatedHeadphones: [],
      content: 'What do you want to share with your fellow Audiophiles today?',
      username: '',
      tag: [],
      taggedHeadphones: [],
      isTagActive: false,
      searchTerm: '',
      searchMatches: []
      // redirect: false
   };
   //Give me the official list of headphones from the database
   componentDidMount() {
      this.props.fetchListOfHeadphones();
   }
   //Invoked as user types in the search box
   onSearchInput = event => {
      // this.setState({ nameList: this.props.nameList });
      // console.log(this.state.nameList);
      this.setState({ searchTerm: event.target.value });
      if (event.target.value.length > 0) {
         this.searchForHeadphones(event.target.value);
      } else {
         this.setState({ searchMatches: [] });
      }
   };
   //Search for headphones using the inputted search term
   searchForHeadphones = searchTerm => {
      //Remove spaces from search term inputted by the user and change all letters to lowercase for case insensitivity
      var removeSpace = searchTerm.toLowerCase().replace(/\s/g, '');

      //Preparing the search term to be converted to regular expression
      //Giving allowance for stray spaces and stray letters (i.e just check whether the headphone's name contains every letter from the search term)
      var regExpPrepare = removeSpace.split('').join('(\\s?\\w?-?)*');
      //Giving allowance for stray spaces and stray letters after the last letter in the search term
      regExpPrepare += '(\\s?\\w?-?)*';

      //Convert to regular expression
      var regExp = new RegExp(regExpPrepare);

      //Find headphones whose name contains every letter in the search term
      var searchMatches = this.props.nameList
         .filter(headphone => {
            return regExp.test(headphone.brandAndModel.toLowerCase());
         })
         .slice(0, 4);
      //Store the successful matches in the component's state
      this.setState({ searchMatches });

      console.log(searchMatches);
   };
   createButtonsFromMatches = () => {
      return this.state.searchMatches.length > 0 ? (
         this.state.searchMatches.map(match => {
            return (
               <button key={match.brandAndModel} onClick={this.onTagHeadphoneButtonClick}>
                  {match.brandAndModel}
               </button>
            );
         })
      ) : (
         <div>Search For Headphones</div>
      );
   };
   onTagHeadphoneButtonClick = e => {
      this.setState({ taggedHeadphones: [...this.state.taggedHeadphones, e.currentTarget.textContent] });
      this.setState({ searchTerm: '', searchMatches: [] });
   };
   createTagLineFromTaggedHeadphones = () => {
      return this.state.taggedHeadphones.length > 0 ? (
         this.state.taggedHeadphones.map(taggedHeadphone => {
            return (
               <div key={taggedHeadphone}>
                  {taggedHeadphone} : <button onClick={() => this.setState({ isTagActive: true })}>+</button>
               </div>
            );
         })
      ) : (
         <div />
      );
   };
   activeTag = () => {
      if (this.state.isTagActive) {
         return <div>Tag Library</div>;
      } else {
         return;
      }
   };
   onFormSubmit = event => {
      event.preventDefault();
      //Post new post form to server
      // this.postToServer();
   };

   postToServer = async () => {
      //Format object to be posted to the database
      const postObj = {
         title: this.state.title,
         content: this.state.content,
         author: { username: this.state.username },
         tag: this.state.tag
      };
      const response = await axios.post('/posts', postObj);
      console.log(response);
      // this.setState({ redirect: true });
   };

   render() {
      // if (this.state.redirect) {
      //    return <Redirect to="/arena" />;
      // }
      return (
         <div>
            <h1>New Post</h1>
            <form onSubmit={this.onFormSubmit}>
               <label>Title Of Post</label>
               <input type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
               {/* Searchbox for headphones names */}
               <input type="text" value={this.state.searchTerm} onChange={this.onSearchInput} />
               {/* Buttons representing successful search matches */}
               <div>{this.createButtonsFromMatches()}</div>
               <div>{this.createTagLineFromTaggedHeadphones()}</div>
               <div>{this.activeTag()}</div>
               <textarea onChange={e => this.setState({ content: e.target.value })} value={this.state.content} />
               <label>Displayed Username</label>
               <input
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
               />
               {/* <div onClick={this.onTagSelect}>V-shaped</div>
               <div onClick={this.onTagSelect}>Treble-Murder</div>
               <div onClick={this.onTagSelect}>Warm and Dark</div> */}
               <input type="submit" />
            </form>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { nameList: state.nameList };
};

export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(PostCreate);

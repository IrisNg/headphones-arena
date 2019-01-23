import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchListOfHeadphones } from '../../actions';

class PersonalHeadphones extends React.Component {
   state = {
      searchTerm: '',
      searchMatches: [],
      taggedHeadphones: [],
      hasLoaded: false
   };
   componentDidMount() {
      //Give me the official list of headphones from the database
      this.props.fetchListOfHeadphones();
   }
   //Load up previous headphones preferences already existing in the user's profile
   static getDerivedStateFromProps(nextProps, prevState) {
      if (!prevState.hasLoaded && nextProps.headphones) {
         return { taggedHeadphones: nextProps.headphones, hasLoaded: true };
      }
      return null;
   }
   //Invoked as user types in the search box
   onHeadphoneSearchInput = e => {
      this.setState({ searchTerm: e.target.value });
      if (e.target.value.length > 0 && this.props.listOfHeadphones) {
         this.searchForHeadphones(e.target.value);
      } else {
         this.setState({ searchMatches: [] });
      }
   };
   //Search for headphone names in the database that are close to the search term inputted by the user
   searchForHeadphones = searchTerm => {
      //Remove spaces from search term inputted by the user
      var removeSpace = searchTerm.replace(/\s/g, '');
      //Preparing the search term to be converted to regular expression
      //Giving allowance for stray spaces and stray letters (i.e just check whether the headphone's name contains every letter from the search term)
      var regExpPrepare = removeSpace.split('').join('.*');

      //Convert to regular expression
      var regExp = new RegExp(regExpPrepare, 'i');
      //Find headphones whose name contains every letter in the search term
      var searchMatches = this.props.listOfHeadphones.filter(headphone => {
         return regExp.test(headphone.brandAndModel);
      });

      //Don't want to show already tagged headphones
      searchMatches = searchMatches.filter(headphone => {
         return !this.state.taggedHeadphones.includes(headphone.brandAndModel);
      });
      searchMatches = searchMatches.slice(0, 4);

      //Store the successful matches in the component's state
      this.setState({ searchMatches });
   };
   renderSuggestionsFromMatches = () => {
      //Render headphone suggestion buttons
      return this.state.searchMatches.map(match => {
         return (
            <button key={match.brandAndModel} onClick={() => this.addTaggedHeadphoneToState(match.brandAndModel)}>
               {match.brandAndModel}
            </button>
         );
      });
   };
   addTaggedHeadphoneToState = headphoneName => {
      this.setState({
         taggedHeadphones: [...this.state.taggedHeadphones, { brandAndModel: headphoneName, rating: 0 }],
         searchTerm: '',
         searchMatches: []
      });
   };
   removeTaggedHeadphoneFromState = headphoneName => {
      var remainingTaggedHeadphones = this.state.taggedHeadphones.filter(
         headphone => headphone.brandAndModel !== headphoneName
      );
      this.setState({ taggedHeadphones: remainingTaggedHeadphones });
   };
   renderTaggedHeadphones = () => {
      //Display tagged headphones
      //Sort by alphabetical order - retain same order even after rating modification
      var sortedTaggedHeadphones = [...this.state.taggedHeadphones].sort((a, b) =>
         a.brandAndModel < b.brandAndModel ? -1 : 1
      );
      console.log(sortedTaggedHeadphones);
      return sortedTaggedHeadphones.map(taggedHeadphone => {
         return (
            <div className="personal-headphones__tagged-headphone" key={taggedHeadphone.brandAndModel}>
               {taggedHeadphone.brandAndModel}
               {/* 5 Hearts rating system for each headphone */}
               <i
                  className={taggedHeadphone.rating > 0 ? 'fas fa-heart' : 'far fa-heart'}
                  onClick={() =>
                     taggedHeadphone.rating === 1
                        ? this.onHeartClick(taggedHeadphone.brandAndModel, 0)
                        : this.onHeartClick(taggedHeadphone.brandAndModel, 1)
                  }
               />
               <i
                  className={taggedHeadphone.rating > 1 ? 'fas fa-heart' : 'far fa-heart'}
                  onClick={() => this.onHeartClick(taggedHeadphone.brandAndModel, 2)}
               />
               <i
                  className={taggedHeadphone.rating > 2 ? 'fas fa-heart' : 'far fa-heart'}
                  onClick={() => this.onHeartClick(taggedHeadphone.brandAndModel, 3)}
               />
               <i
                  className={taggedHeadphone.rating > 3 ? 'fas fa-heart' : 'far fa-heart'}
                  onClick={() => this.onHeartClick(taggedHeadphone.brandAndModel, 4)}
               />
               <i
                  className={taggedHeadphone.rating > 4 ? 'fas fa-heart' : 'far fa-heart'}
                  onClick={() => this.onHeartClick(taggedHeadphone.brandAndModel, 5)}
               />
               {/* Button to untag headphone */}
               <i
                  className="fas fa-times"
                  onClick={() => this.removeTaggedHeadphoneFromState(taggedHeadphone.brandAndModel)}
               />
            </div>
         );
      });
   };
   //Update the rating for this headphone based on the number of hearts clicked by the user
   onHeartClick = (headphoneName, rating) => {
      //Find this headphone's entry
      var currentEntry = this.state.taggedHeadphones.find(entry => entry.brandAndModel === headphoneName);
      //Find the remaining non-relevant headphone entries
      var allEntriesExceptCurrent = this.state.taggedHeadphones.filter(entry => entry.brandAndModel !== headphoneName);
      //Modify the rating for this headphone
      currentEntry.rating = rating;
      //Update state
      this.setState({ taggedHeadphones: [...allEntriesExceptCurrent, currentEntry] });
      this.updateRatingToServer([...allEntriesExceptCurrent, currentEntry]);
   };

   updateRatingToServer = async headphones => {
      const response = await axios.put(`/user-profile/${this.props.profileId}`, {
         headphones
      });
      console.log(response);
      this.props.turnOffEdit();
   };
   render() {
      return (
         <div className="personal-headphones">
            {/* Searchbox for headphones names */}
            <input type="text" value={this.state.searchTerm} onChange={this.onHeadphoneSearchInput} />
            {/* Buttons representing successful search matches */}
            {this.renderSuggestionsFromMatches()}
            {/* Tagged headphones */}
            {this.renderTaggedHeadphones()}
         </div>
      );
   }
}

//Get the name list of all headphones in the database
const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones };
};
export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(PersonalHeadphones);

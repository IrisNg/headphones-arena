import React from 'react';
import { connect } from 'react-redux';
import { fetchListOfHeadphones, updateHeadphoneRating, selectHeadphoneUsingNameOnly } from '../../actions';

class PersonalHeadphones extends React.Component {
   state = {
      searchTerm: '',
      searchMatches: [],
      taggedHeadphones: [],
      profileId: ''
   };
   componentDidMount() {
      //Give me the official list of headphones from the database
      if (!this.props.listOfHeadphones) {
         this.props.fetchListOfHeadphones();
      }
   }
   //Load up previous headphones preferences already existing in the user's profile
   static getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.profileId !== nextProps.profileId) {
         if (nextProps.headphones) {
            return { taggedHeadphones: nextProps.headphones, profileId: nextProps.profileId };
         } else {
            return { taggedHeadphones: [], profileId: nextProps.profileId };
         }
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
      if (this.state.taggedHeadphones.length > 0) {
         searchMatches = searchMatches.filter(headphone => {
            return this.state.taggedHeadphones.every(entry => entry.brandAndModel !== headphone.brandAndModel);
         });
      }
      searchMatches = searchMatches.slice(0, 4);
      //No referencing the original object!
      searchMatches = searchMatches.map(match => {
         return { ...match };
      });
      //Store the successful matches in the component's state
      this.setState({ searchMatches });
   };
   renderSuggestionsFromMatches = () => {
      //Show this message if there are no matches
      if (this.state.searchTerm && this.state.searchMatches.length === 0) {
         return <div className="personal-headphones__no-match">Found 0.</div>;
      }
      //Render headphone suggestion buttons
      return this.state.searchMatches.map(match => {
         return (
            <div
               key={match.brandAndModel}
               onClick={() => this.addTaggedHeadphone(match.brandAndModel)}
               className="personal-headphones__search-match"
            >
               {match.brandAndModel}
            </div>
         );
      });
   };
   addTaggedHeadphone = headphoneName => {
      this.setState(
         {
            taggedHeadphones: [...this.state.taggedHeadphones, { brandAndModel: headphoneName, rating: 5 }],
            searchTerm: '',
            searchMatches: []
         },
         // Update tagged headphone to server
         () => {
            this.props.updateHeadphoneRating(this.props.profileId, {
               headphones: this.state.taggedHeadphones
            });
         }
      );
   };
   removeTaggedHeadphone = headphoneName => {
      var remainingTaggedHeadphones = this.state.taggedHeadphones.filter(
         headphone => headphone.brandAndModel !== headphoneName
      );
      this.setState({ taggedHeadphones: remainingTaggedHeadphones }, () => {
         //Update removal of tagged headphone to server
         this.props.updateHeadphoneRating(this.props.profileId, {
            headphones: this.state.taggedHeadphones
         });
      });
   };
   renderTaggedHeadphones = () => {
      //Display tagged headphones
      //Sort by alphabetical order - retain same order even after rating modification
      var sortedTaggedHeadphones = [...this.state.taggedHeadphones].sort((a, b) =>
         a.brandAndModel < b.brandAndModel ? -1 : 1
      );
      return sortedTaggedHeadphones.map(taggedHeadphone => {
         var { brandAndModel, rating } = taggedHeadphone;
         return (
            <div
               className={`personal-headphones__tagged-headphone ${this.manageTaggedHeadphoneClass()}`}
               key={brandAndModel}
            >
               {/* If user clicks on the name of this tagged headphone, add this headphone to the list of selected headphones in /arena page */}
               <div
                  className="personal-headphones__headphone-name"
                  onClick={() => {
                     this.props.selectHeadphoneUsingNameOnly(brandAndModel);
                  }}
               >
                  {brandAndModel}
               </div>
               <div className="personal-headphones__icons">
                  {/* 5 Hearts rating system for each headphone */}
                  <i
                     onClick={() =>
                        rating === 1 ? this.onHeartClick(brandAndModel, 0) : this.onHeartClick(brandAndModel, 1)
                     }
                     className={this.manageHeartClass(0, rating)}
                  />
                  <i onClick={() => this.onHeartClick(brandAndModel, 2)} className={this.manageHeartClass(1, rating)} />
                  <i onClick={() => this.onHeartClick(brandAndModel, 3)} className={this.manageHeartClass(2, rating)} />
                  <i onClick={() => this.onHeartClick(brandAndModel, 4)} className={this.manageHeartClass(3, rating)} />
                  <i onClick={() => this.onHeartClick(brandAndModel, 5)} className={this.manageHeartClass(4, rating)} />
                  {/* Button to untag headphone */}
                  {this.props.isOwner ? (
                     <i
                        className="fas fa-times personal-headphones__close-icon"
                        onClick={() => this.removeTaggedHeadphone(brandAndModel)}
                     />
                  ) : null}
               </div>
            </div>
         );
      });
   };
   //Update the rating for this headphone based on the number of hearts clicked by the user
   onHeartClick = (headphoneName, rating) => {
      if (this.props.isOwner) {
         //Find this headphone's entry
         var currentEntry = this.state.taggedHeadphones.find(entry => entry.brandAndModel === headphoneName);
         //Find the remaining non-relevant headphone entries
         var allEntriesExceptCurrent = this.state.taggedHeadphones.filter(
            entry => entry.brandAndModel !== headphoneName
         );
         //Modify the rating for this headphone
         currentEntry.rating = rating;
         //Update state then callback and update rating to server
         this.setState({ taggedHeadphones: [...allEntriesExceptCurrent, currentEntry] }, () => {
            this.props.updateHeadphoneRating(this.props.profileId, {
               headphones: this.state.taggedHeadphones
            });
         });
      }
   };
   manageTaggedHeadphoneClass() {
      return this.props.isOwner ? null : 'tagged-headphone--not-owner';
   }
   //Display empty heart or solid heart icon based on the rating
   manageHeartClass(minimum, rating) {
      return rating > minimum ? 'fas fa-heart personal-headphones__heart' : 'far fa-heart personal-headphones__heart';
   }
   //Display border around search input as long as there is a search term inputted
   manageSearchInputClass() {
      return this.state.searchTerm ? 'personal-headphones__search-input--active' : null;
   }
   render() {
      const { isOwner } = this.props;
      return (
         <div className="personal-headphones">
            {/* Only show search box if User is Owner */}
            {isOwner ? (
               //Search box for headphones names
               <div className="personal-headphones__search-box">
                  <input
                     type="text"
                     value={this.state.searchTerm}
                     onChange={this.onHeadphoneSearchInput}
                     className={`personal-headphones__search-input ${this.manageSearchInputClass()}`}
                     placeholder="Rate Your Headphones"
                  />
                  <i className="fas fa-search personal-headphones__search-icon" />
                  {/* Buttons representing successful search matches */}
                  <div className="personal-headphones__search-matches">{this.renderSuggestionsFromMatches()}</div>
               </div>
            ) : null}
            {/* Tagged headphones */}
            <div className="personal-headphones__tagged-headphones">{this.renderTaggedHeadphones()}</div>
         </div>
      );
   }
}

//Get the name list of all headphones in the database
const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones, currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { fetchListOfHeadphones, updateHeadphoneRating, selectHeadphoneUsingNameOnly }
)(PersonalHeadphones);

import React from 'react';
import { connect } from 'react-redux';
import { fetchListOfHeadphones } from '../../actions';
import TagLibrary from './TagLibrary';
import './TagSystem.css';

class TagSystem extends React.Component {
   state = {
      searchTerm: '',
      searchMatches: [],
      taggedHeadphones: [],
      selectedTagLine: '',
      selectedCriteria: '',
      outputTags: [],
      id: ''
   };
   componentDidMount() {
      if (!this.props.listOfHeadphones) {
         this.props.fetchListOfHeadphones();
      }
   }
   static getDerivedStateFromProps(nextProps, prevState) {
      if (!nextProps.previousTags || nextProps.id === prevState.id) {
         return null;
      }
      //Load up previous tags (one time) if editing and updating post
      //If there is zero previous tags
      if (nextProps.previousTags.length === 0) {
         return { id: nextProps.id, taggedHeadphones: [], outputTags: [], selectedTagLine: '' };
      }
      //If there are previous tags
      //DO NOT REFERENCE ARRAY FROM PROPS
      const notReferencedArr = nextProps.previousTags.map(entry => {
         return { brandAndModel: entry.brandAndModel, tags: [...entry.tags] };
      });
      const taggedHeadphones = nextProps.previousTags.map(entry => entry.brandAndModel);
      return { taggedHeadphones, outputTags: notReferencedArr, id: nextProps.id, selectedTagLine: '' };
   }
   componentDidUpdate() {
      //Invoke callback to send all tag entries back to the parent component (PostCreate/ReplyCreate/PostEdit) to be posted to server
      this.props.compileTags(this.state.outputTags);
   }
   //Invoked as user types in the search box
   onHeadphoneSearchInput = e => {
      this.setState({ searchTerm: e.target.value });
      if (e.target.value.length === 0) {
         this.setState({ searchMatches: [] });
      } else {
         this.searchForHeadphones(e.target.value);
      }
   };
   //Search for headphones using the inputted search term
   searchForHeadphones = searchTerm => {
      //Remove spaces from search term inputted by the user
      const removeSpace = searchTerm.replace(/\s/g, '');
      //Preparing the search term to be converted to regular expression
      //Giving allowance for stray spaces and stray letters (i.e just check whether the headphone's name contains every letter from the search term)
      const regExpPrepare = removeSpace.split('').join('.*');
      //Convert to regular expression
      const regExp = new RegExp(regExpPrepare, 'i');

      //Find headphones whose name contains every letter in the search term
      var searchMatches = this.props.listOfHeadphones.filter(headphone => {
         return regExp.test(headphone.brandAndModel);
      });

      //Don't want to show already tagged headphones
      if (this.state.taggedHeadphones.length > 0) {
         searchMatches = searchMatches.filter(currentMatch => {
            return !this.state.taggedHeadphones.includes(currentMatch.brandAndModel);
         });
      }
      searchMatches = searchMatches.slice(0, 4);
      //Store the successful matches in the component's state
      this.setState({ searchMatches });
   };
   renderSuggestionsFromMatches = () => {
      //Render headphone suggestion buttons only if there are matches
      return this.state.searchMatches.map(match => {
         return (
            <div className="tag-system__search-match" key={match.brandAndModel} onClick={() => this.addTaggedHeadphone(match.brandAndModel)}>
               {match.brandAndModel}
            </div>
         );
      });
   };
   addTaggedHeadphone = headphoneName => {
      this.setState(
         {
            taggedHeadphones: [...this.state.taggedHeadphones, headphoneName],
            searchTerm: '',
            searchMatches: []
         },
         () => {
            this.setState({ selectedTagLine: headphoneName });
         }
      );
   };
   removeTaggedHeadphone = removedHeadphoneName => {
      const remainingTaggedHeadphones = this.state.taggedHeadphones.filter(headphone => headphone !== removedHeadphoneName);
      const remainingEntries = this.state.outputTags.filter(entry => entry.brandAndModel !== removedHeadphoneName);
      this.setState({ taggedHeadphones: remainingTaggedHeadphones, outputTags: remainingEntries }, () => {
         if (this.state.selectedTagLine === removedHeadphoneName) {
            this.setState({ selectedTagLine: '' });
         }
      });
   };
   renderTagLineFromTaggedHeadphones = () => {
      //Display Tag Line only if there are tagged headphones
      //Map each taggedHeadphone in a separate tag line
      return this.state.taggedHeadphones.map(taggedHeadphoneName => {
         return (
            //Pass in this headphone name into callback when clicked
            <div
               className={`tag-system__tag-line ${this.manageSelectedTagLineStyle(taggedHeadphoneName)}`}
               key={taggedHeadphoneName}
               onClick={() => this.selectTagLine(taggedHeadphoneName)}
            >
               <div>
                  <div className="tag-system__tagged-headphone">{taggedHeadphoneName}:</div>
                  {/* Display the tags */}
                  <div className="tag-system__tags">{this.renderTagsInEachTagLine(taggedHeadphoneName)}</div>
                  <i className="far fa-trash-alt tag-system__tag-line-removal-icon" onClick={() => this.removeTaggedHeadphone(taggedHeadphoneName)} />
               </div>
            </div>
         );
      });
   };
   renderTagsInEachTagLine = taggedHeadphoneName => {
      //Find all tags associated with this tagged headphone
      const tagEntry = this.state.outputTags.find(entry => entry.brandAndModel === taggedHeadphoneName);
      if (!tagEntry) {
         return null;
      }
      return tagEntry.tags.map(tag => (
         <div className="tag-system__tag" key={tag}>
            {tag}
            <div className="tag-system__tag-removal-icon">
               <i className="fas fa-times" onClick={() => this.removeTag(taggedHeadphoneName, tag)} />
            </div>
         </div>
      ));
   };
   //Select which tag line is active
   selectTagLine = taggedHeadphoneName => {
      this.setState({ selectedTagLine: taggedHeadphoneName });
   };
   renderTaggingCriterias = () => {
      //Formulate the tags from the TagLibrary object only if any tag line is active
      if (!this.state.selectedTagLine) {
         return null;
      }
      return TagLibrary.map(category => {
         return (
            <div
               onClick={() => this.setState({ selectedCriteria: category.criteria })}
               key={category.criteria}
               className={`tag-system__criteria ${this.manageSelectedCriteriaStyle(category.criteria)}`}
            >
               {category.criteria}
            </div>
         );
      });
   };
   renderSelectableTags = () => {
      if (!this.state.selectedCriteria || !this.state.selectedTagLine) {
         return null;
      }
      //Display all the tags for the currently selected criteria
      const currentCriteria = TagLibrary.find(category => category.criteria === this.state.selectedCriteria);
      return currentCriteria.tags.map(tag => (
         <div onClick={() => this.addTag(tag)} key={tag} className="tag-system__selectable-tag">
            {tag}
         </div>
      ));
   };
   // If user clicks on this tag, then add this tag to the state under the currently selected headphone's name
   addTag = tag => {
      //This should get the name of the headphone that is currently being tagged
      const activeHeadphone = this.state.selectedTagLine;
      //Find the entry from outputTags that contains the same headphone name as the activeHeadphone (if the entry exists)
      var currentEntry = this.state.outputTags.find(entry => entry.brandAndModel === activeHeadphone);
      //Form an array of other remaining entries
      const remainingEntries = this.state.outputTags.filter(entry => entry.brandAndModel !== activeHeadphone);
      //Make a new entry if the activeHeadphone has not been tagged before
      if (!currentEntry) {
         currentEntry = { brandAndModel: activeHeadphone, tags: [] };
      }
      //Check whether the tag already exist in the state for that particular headphone
      if (!currentEntry.tags.includes(tag)) {
         currentEntry.tags.push(tag);
      }
      //Save all the entries along with the updated tag back to the state
      this.setState({ outputTags: [...remainingEntries, currentEntry] });
   };

   removeTag = (taggedHeadphoneName, tag) => {
      //Find the entry from outputTags that contains the same headphone name as the one we are removing tag from
      var currentEntry = this.state.outputTags.find(entry => entry.brandAndModel === taggedHeadphoneName);
      //Form an array of other remaining entries
      const remainingEntries = this.state.outputTags.filter(entry => entry.brandAndModel !== taggedHeadphoneName);
      //Remove tag from current entry
      currentEntry.tags = currentEntry.tags.filter(existingTag => existingTag !== tag);
      //Save all the entries minus the removed tag back to the state
      this.setState({ outputTags: [...remainingEntries, currentEntry] });
   };
   manageSearchMatchesDisplay() {
      return this.state.searchMatches.length > 0 ? null : { display: 'none' };
   }
   manageSelectedTagLineStyle(taggedHeadphoneName) {
      return this.state.selectedTagLine === taggedHeadphoneName ? 'tag-line--active' : null;
   }
   manageCriteriasDisplay() {
      return this.state.selectedTagLine ? null : { display: 'none' };
   }
   manageSelectedCriteriaStyle(criteria) {
      return this.state.selectedCriteria === criteria ? 'criteria--active' : null;
   }
   manageSelectableTagsDisplay() {
      return this.state.selectedCriteria && this.state.selectedTagLine ? null : { display: 'none' };
   }

   render() {
      return (
         <div className="tag-system">
            {/* Searchbox for headphones names */}
            <div className="tag-system__search-bar">
               <input
                  className="tag-system__search-input"
                  type="text"
                  value={this.state.searchTerm}
                  onChange={this.onHeadphoneSearchInput}
                  placeholder="Search for headphone"
               />
               <i className="fas fa-search tag-system__search-icon" />
            </div>
            {/* Buttons representing successful search matches */}
            <div className="tag-system__search-matches" style={this.manageSearchMatchesDisplay()}>
               {this.renderSuggestionsFromMatches()}
            </div>
            {/* One tag line for each tagged headphone */}
            <div className="tag-system__tag-lines">{this.renderTagLineFromTaggedHeadphones()}</div>
            {/* Tags from TagLibrary */}
            <div className="tag-system__criterias" style={this.manageCriteriasDisplay()}>
               {this.renderTaggingCriterias()}
            </div>
            <div className="tag-system__selectable-tags" style={this.manageSelectableTagsDisplay()}>
               {this.renderSelectableTags()}
            </div>
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
)(TagSystem);

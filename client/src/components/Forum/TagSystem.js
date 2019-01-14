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
      tagLineIsActive: false,
      selectedTagLine: '',
      selectedCriteria: '',
      outputTags: [],
      hasLoaded: false
   };
   componentDidMount() {
      //Give me the official list of headphones from the database
      if (this.props.nameList.length < 1) {
         this.props.fetchListOfHeadphones();
      }
   }
   static getDerivedStateFromProps(nextProps, prevState) {
      //Load up previous tags if editing and updating post(one time)
      if (nextProps.previousTags && !prevState.hasLoaded) {
         if (nextProps.previousTags.length > 0) {
            //DO NOT REFERENCE ARRAY FROM PROPS
            var notReferencedArr = nextProps.previousTags.map(entry => {
               return { brandAndModel: entry.brandAndModel, tags: [...entry.tags] };
            });
            var taggedHeadphones = nextProps.previousTags.map(tag => tag.brandAndModel);
            return { taggedHeadphones, outputTags: notReferencedArr, hasLoaded: true };
         }
         return { hasLoaded: true };
      }
      return null;
   }
   componentDidUpdate() {
      //Invoke callback to send all tag entries back to the parent component (PostCreate/ReplyCreate/PostEdit) to be posted to server
      this.props.compileTags([...this.state.outputTags]);
   }
   //Invoked as user types in the search box
   onHeadphoneSearchInput = e => {
      this.setState({ searchTerm: e.target.value });
      if (e.target.value.length > 0 && this.props.nameList) {
         this.searchForHeadphones(e.target.value);
      } else {
         this.setState({ searchMatches: [] });
      }
   };
   //Search for headphones using the inputted search term
   searchForHeadphones = searchTerm => {
      //Remove spaces from search term inputted by the user
      var removeSpace = searchTerm.replace(/\s/g, '');

      //Preparing the search term to be converted to regular expression
      //Giving allowance for stray spaces and stray letters (i.e just check whether the headphone's name contains every letter from the search term)
      var regExpPrepare = removeSpace.split('').join('.*');
      //Giving allowance for stray spaces and stray letters after the last letter in the search term
      // regExpPrepare += '.*';

      //Convert to regular expression
      var regExp = new RegExp(regExpPrepare, 'i');

      //Find headphones whose name contains every letter in the search term
      var searchMatches = this.props.nameList.filter(headphone => {
         return regExp.test(headphone.brandAndModel);
      });

      //Don't want to show already tagged headphones
      if (this.state.taggedHeadphones.length > 0) {
         searchMatches = searchMatches.filter(headphone => {
            return !this.state.taggedHeadphones.includes(headphone.brandAndModel);
         });
      }
      searchMatches = searchMatches.slice(0, 4);

      //Store the successful matches in the component's state
      this.setState({ searchMatches });
   };
   renderSuggestionsFromMatches = () => {
      //Render headphone suggestion buttons only if there are matches
      if (this.state.searchMatches.length > 0) {
         return this.state.searchMatches.map(match => {
            return (
               <button key={match.brandAndModel} onClick={() => this.addTaggedHeadphoneToState(match.brandAndModel)}>
                  {match.brandAndModel}
               </button>
            );
         });
      }
   };
   addTaggedHeadphoneToState = headphoneName => {
      this.setState({
         taggedHeadphones: [...this.state.taggedHeadphones, headphoneName],
         searchTerm: '',
         searchMatches: []
      });
   };
   removeTaggedHeadphoneFromState = headphoneName => {
      var newTaggedHeadphones = this.state.taggedHeadphones.filter(headphone => headphone !== headphoneName);
      var allEntriesExceptRemoved = this.state.outputTags.filter(entry => entry.brandAndModel !== headphoneName);
      this.setState({ taggedHeadphones: newTaggedHeadphones, outputTags: allEntriesExceptRemoved });
      if (this.state.selectedTagLine === headphoneName) {
         this.setState({ selectedTagLine: '', tagLineIsActive: false });
      }
   };
   renderTagLineFromTaggedHeadphones = () => {
      //Display Tag Line only if there are tagged headphones
      if (this.state.taggedHeadphones.length > 0) {
         //Map each taggedHeadphone in a separate tag line
         return this.state.taggedHeadphones.map(taggedHeadphoneName => {
            return (
               <div className="tag-system__tag-line" key={taggedHeadphoneName}>
                  <div
                     className="tag-system__tagged-headphone"
                     //Pass in this headphone name into callback when clicked
                     onClick={() => this.addSelectedTagLineToState(taggedHeadphoneName)}
                  >
                     {taggedHeadphoneName} :{/* Display the tags */}
                     <span>{this.renderTagsInRespectiveTagLine(taggedHeadphoneName)}</span>
                  </div>
                  <i
                     className="fas fa-times"
                     onClick={() => this.removeTaggedHeadphoneFromState(taggedHeadphoneName)}
                  />
               </div>
            );
         });
      }
   };
   addSelectedTagLineToState = taggedHeadphoneName => {
      this.setState({ selectedTagLine: taggedHeadphoneName, tagLineIsActive: true });
   };
   renderTaggingCriterias = () => {
      //Formulate the tags from the TagLibrary object
      if (this.state.tagLineIsActive) {
         return TagLibrary.map(category => {
            return (
               <span key={category.criteria}>
                  {' '}
                  <span onClick={() => this.setState({ selectedCriteria: category.criteria })}>
                     {category.criteria}
                  </span>{' '}
                  |
               </span>
            );
         });
      }
   };
   renderTags = () => {
      //Display all the tags for the currently selected criteria
      if (this.state.selectedCriteria && this.state.tagLineIsActive) {
         var currentCriteria = TagLibrary.find(category => category.criteria === this.state.selectedCriteria);
         return (
            <div>
               {currentCriteria.tags.map(tag => (
                  <span key={tag} onClick={() => this.addTagToState(tag)}>
                     {tag}
                  </span>
               ))}
            </div>
         );
      }
   };
   addTagToState = tag => {
      //This should get the name of the headphone that is currently being tagged
      var activeHeadphone = this.state.selectedTagLine;

      //Find the entry from outputTags that contains the same headphone name as the activeHeadphone
      var currentEntry = this.state.outputTags.find(entry => entry.brandAndModel === activeHeadphone);

      //Form an array of other remaining entries
      var allEntriesExceptCurrent = this.state.outputTags.filter(entry => entry.brandAndModel !== activeHeadphone);

      //Make a new entry if the activeHeadphone has not been tagged before
      if (!currentEntry) {
         currentEntry = { brandAndModel: activeHeadphone, tags: [] };
      }
      //Check whether the tag already exist in the state for that particular headphone
      if (!currentEntry.tags.includes(tag)) {
         currentEntry.tags.push(tag);
      }
      //Save all the entries along with the updated tag back to the state
      this.setState({ outputTags: [...allEntriesExceptCurrent, currentEntry] });
   };
   renderTagsInRespectiveTagLine = taggedHeadphoneName => {
      //Find all tags associated with this tagged headphone
      var tagEntry = this.state.outputTags.find(entry => entry.brandAndModel === taggedHeadphoneName);
      return tagEntry
         ? tagEntry.tags.map(tag => (
              <span className="tag-system__tag" key={tag}>
                 {' '}
                 {tag}
                 <i className="fas fa-times" onClick={() => this.removeTagFromState(taggedHeadphoneName, tag)} />
              </span>
           ))
         : null;
   };
   removeTagFromState = (taggedHeadphoneName, tag) => {
      //Find the entry from outputTags that contains the same headphone name as the one we are removing tag from
      var currentEntry = this.state.outputTags.find(entry => entry.brandAndModel === taggedHeadphoneName);
      //Form an array of other remaining entries
      var allEntriesExceptCurrent = this.state.outputTags.filter(entry => entry.brandAndModel !== taggedHeadphoneName);
      //Remove tag from current entry
      currentEntry.tags = currentEntry.tags.filter(existingTag => existingTag !== tag);
      //Save all the entries minus the removed tag back to the state
      this.setState({ outputTags: [...allEntriesExceptCurrent, currentEntry] });
   };
   render() {
      return (
         <div>
            {/* Searchbox for headphones names */}
            <input type="text" value={this.state.searchTerm} onChange={this.onHeadphoneSearchInput} />
            {/* Buttons representing successful search matches */}
            {this.renderSuggestionsFromMatches()}
            {/* One tag line for each tagged headphone */}
            {this.renderTagLineFromTaggedHeadphones()}
            {/* Tags from TagLibrary */}
            {this.renderTaggingCriterias()}
            {this.renderTags()}
         </div>
      );
   }
}

//Get the name list of all headphones in the database
const mapStateToProps = state => {
   return { nameList: state.nameList };
};
export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(TagSystem);

import React from 'react';
import { connect } from 'react-redux';
import { removeHeadphone, fetchTopPosts } from '../../actions';

//Destructured selectedHeadphone data object from props
class SelectedHeadphone extends React.Component {
   componentDidMount() {
      this.props.fetchTopPosts({ term: this.props.headphone.brandAndModel });
   }
   renderTags() {
      //Find the top 9 most chosen tags for this selected headphone
      if (this.props.headphone) {
         //Make a new array by extracting all tags from each tag entry
         var allTags = this.props.headphone.tags.reduce((array, currentEntry) => {
            return [...array, ...currentEntry.tags];
         }, []);
         //Make an array containing only unique tags
         var uniqueTags = allTags.reduce((array, currentTag) => {
            if (!array.includes(currentTag)) {
               return [...array, currentTag];
            }
            return array;
         }, []);
         //Find out the number of times each tag appears
         var sortedTags = uniqueTags.map(uniqueTag => {
            return { tagName: uniqueTag, count: allTags.filter(tag => tag === uniqueTag).length };
         });
         //Sort tags in descending frequency - tags that appear the most come first
         sortedTags.sort((a, b) => b.count - a.count);
         //Only want the top 9 most chosen tags
         var topTags = sortedTags.slice(0, 9);
         //Render the top 9 most chosen tags for this selected headphone
         return topTags.map(tag => <span key={tag.tagName}>{tag.tagName}</span>);
      }
   }
   render() {
      console.log(this.props.topPosts);
      const { headphone } = this.props;
      return (
         <div className="selected-headphone">
            <img src={headphone.image} alt={headphone.model} />
            <h3>
               {headphone.brand} {headphone.model}
               <span onClick={() => this.props.removeHeadphone(headphone)}>X</span>
            </h3>
            <div className="selected-headphone__amazon" onClick={() => window.open(headphone.amazonLink)}>
               <i className="fab fa-amazon" />
               {headphone.price}
            </div>
            {/* Tags - Render the top 9 most chosen tags for this selected headphone */}
            <div>{this.renderTags()}</div>
            {/* Offical Description */}
            <p>{headphone.officialDescription}</p>
            {/* Specifications */}
            <h5>Specifications</h5>
            <table>
               <tbody>
                  <tr>
                     <td>Impedance</td>
                     <td>{headphone.specification.impedance}</td>
                  </tr>
                  <tr>
                     <td>Connector</td>
                     <td>{headphone.specification.connector}</td>
                  </tr>
                  <tr>
                     <td>Portability</td>
                     <td>{headphone.specification.portability}</td>
                  </tr>
                  <tr>
                     <td>Color</td>
                     <td>{headphone.specification.color}</td>
                  </tr>
                  <tr>
                     <td>Cable</td>
                     <td>{headphone.specification.cable}</td>
                  </tr>
                  <tr>
                     <td>Driver</td>
                     <td>{headphone.specification.driver}</td>
                  </tr>
                  <tr>
                     <td>Sensitivity</td>
                     <td>{headphone.specification.sensitivity}</td>
                  </tr>
                  <tr>
                     <td>Frequency Response</td>
                     <td>{headphone.specification.frequencyResponse}</td>
                  </tr>
                  <tr>
                     <td>Classification</td>
                     <td>{headphone.specification.classification}</td>
                  </tr>
                  <tr>
                     <td>Maximum Power</td>
                     <td>{headphone.specification.maximumPower}</td>
                  </tr>
                  <tr>
                     <td>Weight</td>
                     <td>{headphone.specification.weight}</td>
                  </tr>
                  <tr>
                     <td>Included In The Box</td>
                     <td>{headphone.specification.inTheBox}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { topPosts: state.topPosts };
};
export default connect(
   mapStateToProps,
   { removeHeadphone, fetchTopPosts }
)(SelectedHeadphone);

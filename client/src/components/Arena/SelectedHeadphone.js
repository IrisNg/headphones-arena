import React from 'react';
import { connect } from 'react-redux';
import { removeHeadphone } from '../../actions';

//Destructured selectedHeadphone data object from props
class SelectedHeadphone extends React.Component {
   renderTags() {
      if (this.props.headphone) {
         var allTags = this.props.headphone.tags.reduce((acc, cur) => [...acc, ...cur.tags]);
         var uniqueTags = allTags.reduce((array, current) => {
            if (!array.includes(current)) {
               return [...array, current];
            }
            return array;
         });
         var sortedTags = uniqueTags.map(uniqueTag => {
            return { tagName: uniqueTag, count: allTags.filter(tag => tag === uniqueTag).length };
         });
         sortedTags.sort((a, b) => b.count - a.count);
         var topTags = sortedTags.slice(0, 5);
         return topTags.map(tag => <p>{tag}</p>);
      }
   }
   render() {
      const { headphone } = this.props;
      return (
         <div className="selected-headphone">
            <img src={headphone.image} alt={headphone.model} />
            <h3>
               {headphone.brand} {headphone.model}
               <span onClick={() => this.props.removeHeadphone(headphone)}>X</span>
            </h3>
            {/* Tags */}
            {this.renderTags()}
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

export default connect(
   null,
   { removeHeadphone }
)(SelectedHeadphone);

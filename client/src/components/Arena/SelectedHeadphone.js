import React from 'react';
import { connect } from 'react-redux';
import { removeHeadphone } from '../../actions';

//Destructured selectedHeadphone data object from props
class SelectedHeadphone extends React.Component {
   render() {
      const { headphone } = this.props;
      return (
         <div className="selected-headphone">
            <h3>
               {headphone.brand} {headphone.model}
               <span onClick={() => this.props.removeHeadphone(headphone)}>X</span>
            </h3>
            <img src={headphone.image} alt={headphone.model} />
            <p>{headphone.officialDescription}</p>
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

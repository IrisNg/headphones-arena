import React from 'react';
import { connect } from 'react-redux';
import { selectHeadphone } from '../../actions';

class Headphone extends React.Component {
   manageFirstHeadphoneStyle() {
      const { headphone, firstHeadphone } = this.props;
      // Apply the following style only to the first headphone of the list
      return firstHeadphone === headphone.brandAndModel
         ? {
              borderLeft: '6px solid #c9463d',
              marginLeft: 'calc(-.3rem - 6px)',
              paddingLeft: '.3rem',
              boxSizing: 'border-box'
           }
         : null;
   }
   render() {
      const { headphone, selectHeadphone } = this.props;
      return (
         <div className="headphone" style={this.manageFirstHeadphoneStyle()} onClick={() => selectHeadphone(headphone)}>
            <div>
               <div className="headphone__brand">{headphone.brand.toUpperCase()}</div>
            </div>
            <div>
               <div className="headphone__model">{headphone.model.toUpperCase()}</div>
            </div>
         </div>
      );
   }
}

export default connect(
   null,
   { selectHeadphone }
)(Headphone);

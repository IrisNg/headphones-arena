import React from 'react';
import { connect } from 'react-redux';
import { selectHeadphone } from '../../actions';

//Destructured headphone data object from props
const Headphone = ({ headphone, selectHeadphone }) => {
   return (
      <div className="headphone" onClick={() => selectHeadphone(headphone)}>
         <div>
            <div className="headphone-brand">{headphone.brand}</div>
         </div>
         <div>
            <div className="headphone-model">{headphone.model}</div>
         </div>
      </div>
   );
};

export default connect(
   null,
   { selectHeadphone }
)(Headphone);

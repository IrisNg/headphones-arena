import React from 'react';
import { connect } from 'react-redux';
import './GlobalError.css';

const GlobalError = ({ globalError }) => {
   if (!globalError) {
      return <div />;
   }
   return <div className="global-error">{globalError}</div>;
};
const mapStateToProps = state => {
   return { globalError: state.globalError };
};

export default connect(mapStateToProps)(GlobalError);

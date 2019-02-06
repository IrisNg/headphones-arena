import React from 'react';
import { connect } from 'react-redux';
import { fetchListOfHeadphones } from '../actions';

class FetchHeadphones extends React.Component {
   componentDidMount() {
      this.props.fetchListOfHeadphones();
   }
   componentDidUpdate() {
      if (!this.props.listOfHeadphones) {
         this.props.fetchListOfHeadphones();
      }
   }
   render() {
      return <div />;
   }
}
const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones };
};

export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(FetchHeadphones);

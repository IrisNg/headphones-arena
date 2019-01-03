import React from 'react';
import { connect } from 'react-redux';
import { fetchListOfHeadphones } from '../../actions';
import Headphone from './Headphone';

class HeadphoneList extends React.Component {
   //invoke action creator to send API request to GET headphone list from server
   componentDidMount() {
      this.props.fetchListOfHeadphones();
   }

   renderListOfHeadphones() {
      //Destructuring listOfHeadphones from props
      const { listOfHeadphones } = this.props;
      //API request takes time, fallback if there is no response from server yet
      if (!listOfHeadphones) {
         return <div>Loading ... </div>;
      }
      //Turn each headphone data object in the listOfHeadphones into a component
      return listOfHeadphones.map(headphone => {
         return <Headphone headphone={headphone} key={headphone._id} />;
      });
   }

   render() {
      return <div className="headphone-list">{this.renderListOfHeadphones()}</div>;
   }
}

//Retrieve headphone list from Store after API request completes
const mapStateToProps = state => {
   console.log(state.listOfHeadphones);
   return { listOfHeadphones: state.listOfHeadphones };
};

export default connect(
   mapStateToProps,
   { fetchListOfHeadphones }
)(HeadphoneList);

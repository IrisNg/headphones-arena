import React from 'react';
import { connect } from 'react-redux';
import Headphone from './Headphone';

class HeadphoneList extends React.Component {
   renderListOfHeadphones(list) {
      //Turn each headphone data object in the listOfHeadphones into a component
      return list.map(headphone => {
         return <Headphone headphone={headphone} key={headphone._id} />;
      });
   }

   render() {
      var { listOfHeadphones } = this.props;
      if (!listOfHeadphones) {
         return (
            <div className="headphone-list__loading">
               <img className="loading-image" src="https://cdn.dribbble.com/users/924068/screenshots/3757746/dribbble.gif" alt="loading" />
            </div>
         );
      }
      return <div className="headphone-list">{this.renderListOfHeadphones(listOfHeadphones)}</div>;
   }
}

//Retrieve headphone list from Store after API request completes
const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones };
};

export default connect(mapStateToProps)(HeadphoneList);

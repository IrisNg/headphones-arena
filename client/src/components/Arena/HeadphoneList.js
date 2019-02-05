import React from 'react';
import { connect } from 'react-redux';
import Headphone from './Headphone';

class HeadphoneList extends React.Component {
   state = {
      sequencedList: null,
      firstHeadphone: ''
   };
   componentDidUpdate() {
      if (this.props.listOfHeadphones && !this.state.sequencedList) {
         //First time storing the listOfHeadphones into the component state
         this.setState(
            {
               sequencedList: [...this.props.listOfHeadphones],
               firstHeadphone: this.props.listOfHeadphones[0].brandAndModel
            },
            //Trigger the interval timer after state update
            () => {
               this.intervalId = setInterval(this.shiftHeadphonesAtInterval, 2500);
            }
         );
      }
   }
   //Clean up the interval timer
   componentWillUnmount() {
      clearInterval(this.intervalId);
   }
   //This will move the first headphone of every cycle to the last position
   //Creating an animation effect
   shiftHeadphonesAtInterval = () => {
      var currentList = [...this.state.sequencedList];
      var previousFirst = currentList.shift();
      var newList = [...currentList, previousFirst];
      this.setState({ sequencedList: newList });
   };
   renderListOfHeadphones() {
      if (!this.state.sequencedList) {
         return null;
      }
      //Turn each headphone data object in the listOfHeadphones into a component
      return this.state.sequencedList.map(headphone => {
         return <Headphone headphone={headphone} key={headphone._id} firstHeadphone={this.state.firstHeadphone} />;
      });
   }

   render() {
      var { listOfHeadphones } = this.props;
      if (!listOfHeadphones) {
         return (
            <div className="headphone-list__loading">
               <img
                  className="loading-image"
                  src="https://cdn.dribbble.com/users/924068/screenshots/3757746/dribbble.gif"
                  alt="loading"
               />
            </div>
         );
      }
      return <div className="headphone-list">{this.renderListOfHeadphones()}</div>;
   }
}

const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones };
};

export default connect(mapStateToProps)(HeadphoneList);

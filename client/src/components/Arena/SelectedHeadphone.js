import React from 'react';
import { connect } from 'react-redux';
import { removeHeadphone, fetchFullHeadphone } from '../../actions';
import Overview from './Overview';
import Specification from './Specification';
import TopPosts from './TopPosts';

//Destructured selectedHeadphone data object from props
class SelectedHeadphone extends React.Component {
   state = {
      page: 1
   };
   componentDidMount() {
      this.props.fetchFullHeadphone(this.props.headphone._id);
   }
   renderCurrentPage(fullHeadphone) {
      const { page } = this.state;
      if (page === 1) {
         //Page 1 - overview
         return <Overview headphone={fullHeadphone} />;
      } else if (page === 2) {
         //Page 2 - specification
         return <Specification headphone={fullHeadphone} />;
      } else if (page === 3) {
         //Page 3 - top posts
         return <TopPosts headphone={fullHeadphone} />;
      }
   }
   renderRating() {
      const { fullHeadphone } = this.props;
      //Calculate the average rating first
      const average = this.calculateAverageRating(fullHeadphone);
      if (average === 0) {
         return `white`;
      } else if (average === 10) {
         return `#1c3359`;
      }
      //Display rating in percentage like a health bar
      return `linear-gradient(to right, #1c3359 ${average * 10}%, white ${average * 10}%)`;
   }
   calculateAverageRating(headphone) {
      var average;
      //Give full marks if no rating exists
      if (headphone.ratings.length === 0) {
         average = 10;
      }
      //Find the average rating for this headphone from a list of rating entries
      else {
         average =
            (headphone.ratings.reduce((acc, curr) => {
               return acc + curr.rating;
            }, 0) /
               headphone.ratings.length) *
            2;
      }
      return average;
   }
   manageSelectedPage(page) {
      return this.state.page === page ? '--active-page' : null;
   }
   render() {
      if (!this.props.fullHeadphone) {
         return (
            <div className="selected-headphone__loading">
               <img className="loading-image" src="https://i.imgur.com/75tvQck.gif" alt="pikachu loading" />
            </div>
         );
      }
      const { fullHeadphone, headphone, removeHeadphone } = this.props;
      return (
         <div className="selected-headphone">
            {/* Closing button */}
            <div className="selected-headphone__close-button" onClick={() => removeHeadphone(headphone)}>
               X
            </div>
            <div className="selected-headphone__essential">
               {/* Image */}
               <div className="selected-headphone__thumbnail">
                  <img src={fullHeadphone.image} alt={fullHeadphone.model} />
               </div>
               <div>
                  {/* Select pages */}
                  <span
                     className={`selected-headphone__page ${this.manageSelectedPage(1)}`}
                     onClick={() => this.setState({ page: 1 })}
                  />
                  <span
                     className={`selected-headphone__page ${this.manageSelectedPage(2)}`}
                     onClick={() => this.setState({ page: 2 })}
                  />
                  <span
                     className={`selected-headphone__page ${this.manageSelectedPage(3)}`}
                     onClick={() => this.setState({ page: 3 })}
                  />
               </div>
               {/* User ratings */}
               <div
                  className="selected-headphone__rating"
                  style={{
                     background: this.renderRating()
                  }}
               />
               {/* Amazon Button */}
               <div className="selected-headphone__amazon" onClick={() => window.open(fullHeadphone.amazonLink)}>
                  <i className="fab fa-amazon" />
                  <span>{fullHeadphone.price}</span>
               </div>
            </div>
            {/* Name */}
            <h3 className="selected-headphone__name">
               {fullHeadphone.brand} {fullHeadphone.model}
            </h3>

            {/* Current Page */}
            {this.renderCurrentPage(fullHeadphone)}
         </div>
      );
   }
}
const mapStateToProps = (state, ownProps) => {
   const fullHeadphone = state.fullHeadphones.find(entry => entry._id === ownProps.headphone._id);
   return { fullHeadphone };
};

export default connect(
   mapStateToProps,
   { removeHeadphone, fetchFullHeadphone }
)(SelectedHeadphone);

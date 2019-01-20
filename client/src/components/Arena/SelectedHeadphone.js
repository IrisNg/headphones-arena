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
   render() {
      if (!this.props.fullHeadphone) {
         return <div>Loading ...</div>;
      }
      const { fullHeadphone, headphone } = this.props;
      return (
         <div className="selected-headphone">
            <img src={fullHeadphone.image} alt={fullHeadphone.model} />
            <h3>
               {fullHeadphone.brand} {fullHeadphone.model}
               <span onClick={() => this.props.removeHeadphone(headphone)}>X</span>
            </h3>
            <div>
               <span onClick={() => this.setState({ page: 1 })}>1</span>
               <span onClick={() => this.setState({ page: 2 })}>2</span>
               <span onClick={() => this.setState({ page: 3 })}>3</span>
            </div>

            {this.state.page === 1 ? <Overview headphone={fullHeadphone} /> : null}
            {this.state.page === 2 ? <Specification headphone={fullHeadphone} /> : null}
            {this.state.page === 3 ? <TopPosts headphone={fullHeadphone} /> : null}
         </div>
      );
   }
}
const mapStateToProps = (state, ownProps) => {
   var fullHeadphone = state.fullHeadphones.find(entry => entry._id === ownProps.headphone._id);
   console.log(fullHeadphone);
   return { fullHeadphone };
};

export default connect(
   mapStateToProps,
   { removeHeadphone, fetchFullHeadphone }
)(SelectedHeadphone);

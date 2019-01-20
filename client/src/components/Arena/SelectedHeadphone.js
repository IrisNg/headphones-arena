import React from 'react';
import { connect } from 'react-redux';
import { removeHeadphone } from '../../actions';
import Overview from './Overview';
import Specification from './Specification';
import TopPosts from './TopPosts';

//Destructured selectedHeadphone data object from props
class SelectedHeadphone extends React.Component {
   state = {
      page: 1
   };
   render() {
      const { headphone } = this.props;
      return (
         <div className="selected-headphone">
            <img src={headphone.image} alt={headphone.model} />
            <h3>
               {headphone.brand} {headphone.model}
               <span onClick={() => this.props.removeHeadphone(headphone)}>X</span>
            </h3>
            <div>
               <span onClick={() => this.setState({ page: 1 })}>1</span>
               <span onClick={() => this.setState({ page: 2 })}>2</span>
               <span onClick={() => this.setState({ page: 3 })}>3</span>
            </div>

            {this.state.page === 1 ? <Overview headphone={headphone} /> : null}
            {this.state.page === 2 ? <Specification headphone={headphone} /> : null}
            {this.state.page === 3 ? <TopPosts headphone={headphone} /> : null}
         </div>
      );
   }
}

export default connect(
   null,
   { removeHeadphone }
)(SelectedHeadphone);

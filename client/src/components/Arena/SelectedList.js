import React from 'react';
import { connect } from 'react-redux';
import SelectedHeadphone from './SelectedHeadphone';

class SelectedList extends React.Component {
   renderListOfSelectedHeadphones() {
      //Destructuring list of selected headphones from props
      const { selectedList } = this.props;
      //Turn each selected headphone data object in the selectedList into a component
      return selectedList
         .map(selectedHeadphone => {
            return <SelectedHeadphone headphone={selectedHeadphone} key={selectedHeadphone._id} />;
         })
         .slice(0, 4);
   }

   render() {
      if (this.props.selectedList.length === 0) {
         return <div className="selected-list__empty">{'HEADPHONES ARENA'}</div>;
      }
      return <div className="selected-list">{this.renderListOfSelectedHeadphones()}</div>;
   }
}

//Retrieve list of selected headphones from Store
const mapStateToProps = state => {
   return { selectedList: state.listOfSelectedHeadphones };
};

export default connect(mapStateToProps)(SelectedList);

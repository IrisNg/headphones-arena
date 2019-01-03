import { combineReducers } from 'redux';

const headphoneListReducer = (listOfHeadphones = null, action) => {
   switch (action.type) {
      case 'FETCH_LIST_OF_HEADPHONES':
         return action.payload.data;
      default:
         return listOfHeadphones;
   }
};

const selectedHeadphoneReducer = (listOfSelectedHeadphones = [], action) => {
   if (action.type === 'HEADPHONE_SELECTED' && listOfSelectedHeadphones.includes(action.payload) === false) {
      return [...listOfSelectedHeadphones, action.payload];
   }
   if (action.type === 'HEADPHONE_REMOVED') {
      return listOfSelectedHeadphones.filter(function(headphone) {
         return headphone !== action.payload;
      });
   }
   return listOfSelectedHeadphones;
};

export default combineReducers({
   listOfHeadphones: headphoneListReducer,
   listOfSelectedHeadphones: selectedHeadphoneReducer
});

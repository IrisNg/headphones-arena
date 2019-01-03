import axios from 'axios';

//Action Creators
//Makes GET request to /arena for the list of all headphones
export const fetchListOfHeadphones = () => async dispatch => {
   var response = await axios.get('/arena');
   dispatch({ type: 'FETCH_LIST_OF_HEADPHONES', payload: response });
};

export const selectHeadphone = headphoneSelected => {
   return {
      type: 'HEADPHONE_SELECTED',
      payload: headphoneSelected
   };
};
export const removeHeadphone = headphoneRemoved => {
   return {
      type: 'HEADPHONE_REMOVED',
      payload: headphoneRemoved
   };
};

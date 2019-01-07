import axios from 'axios';

//Action Creators
//Makes GET request to /arena for the list of all headphones
export const fetchListOfHeadphones = () => async dispatch => {
   var response = await axios.get('/arena');
   dispatch({ type: 'FETCH_LIST_OF_HEADPHONES', payload: response.data });
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

export const fetchPost = id => async dispatch => {
   const response = await axios.get(`/posts/${id}`);
   dispatch({ type: 'FETCH_POST', payload: response.data });
};

import axios from 'axios';

//Action Creators

//Arena
export const fetchListOfHeadphones = () => async dispatch => {
   var response = await axios.get('/arena');
   dispatch({ type: 'FETCH_LIST_OF_HEADPHONES', payload: response.data });
};
//Called by Headphone component
export const selectHeadphone = headphoneSelected => {
   return {
      type: 'HEADPHONE_SELECTED',
      payload: headphoneSelected
   };
};
//Called by SelectedHeadphone component
export const removeHeadphone = headphoneRemoved => {
   return {
      type: 'HEADPHONE_REMOVED',
      payload: headphoneRemoved
   };
};

//Forum
export const fetchForumHomePosts = () => async dispatch => {
   const response = await axios.get('/forum');
   dispatch({ type: 'FETCH_FORUM_POSTS', payload: response.data });
};

export const storeSearchTerm = searchTerm => {
   return {
      type: 'FORUM_SEARCH_TERM',
      payload: searchTerm
   };
};
export const fetchSearchPosts = searchTerm => async (dispatch, getState) => {
   //Store the search term inputted by the user on the forum page in the state
   await dispatch(storeSearchTerm(searchTerm));
   const term = getState().forumSearchTerm;

   //Search the database for posts using this search term
   const response = await axios.post('/forum/search', { term });
   var populatedPosts = [];
   response.data.forEach(async post => {
      var populatedResponse = await axios.get(`/posts/${post._id}`);
      populatedPosts = [...populatedPosts, populatedResponse.data];
      if (populatedPosts.length === response.data.length) {
         dispatch({ type: 'FETCH_SEARCH_POSTS', payload: populatedPosts });
      }
   });
};
//Called by PostShow component
export const fetchPost = id => async dispatch => {
   const response = await axios.get(`/posts/${id}`);
   dispatch({ type: 'FETCH_POST', payload: response.data });
};

//Authentication
export const registerUser = (username, password) => async dispatch => {
   const response = await axios.post('/register', { username, password });
   dispatch({ type: 'CURRENT_USER', payload: response.data });
};
export const loginUser = (username, password) => async dispatch => {
   const response = await axios.post('/login', { username, password });
   dispatch({ type: 'CURRENT_USER', payload: response.data });
};
export const logoutUser = () => async dispatch => {
   const response = await axios.get('/logout');
   dispatch({ type: 'CURRENT_USER', payload: response.data });
};
export const checkUser = () => async dispatch => {
   const response = await axios.get('/user');
   dispatch({ type: 'CURRENT_USER', payload: response.data });
};

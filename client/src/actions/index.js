import axios from 'axios';

//Action Creators
//Arena
export const fetchListOfHeadphones = () => async dispatch => {
   var response = await axios.get('/arena');
   dispatch({ type: 'FETCHED_LIST_OF_HEADPHONES', payload: response.data });
};
//Called by SelectedHeadphone component
export const fetchFullHeadphone = id => async dispatch => {
   var response = await axios.get(`/headphones/${id}`);
   dispatch({ type: 'FETCHED_FULL_HEADPHONE', payload: response.data });
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
//Called by SelectedHeadphone component
//Fetch highest voted posts related to the selected headphone
export const fetchTopPosts = headphoneName => async dispatch => {
   const response = await axios.post('/forum/topposts', headphoneName);
   dispatch({ type: 'FETCHED_TOP_POSTS', payload: response.data });
};

//Forum
//Called by Forum component
export const fetchForumHomePosts = () => async dispatch => {
   const response = await axios.get('/forum');
   dispatch({ type: 'FETCHED_FORUM_POSTS', payload: response.data });
};
//Called by fetchSearchPosts action creator
export const storeSearchTerm = searchTerm => {
   return {
      type: 'FORUM_SEARCH_TERM',
      payload: searchTerm
   };
};
//Called by fetchSearchPosts action creator
//Search the database for posts using this search term
export const fetchUnpopulatedSearchPosts = term => async dispatch => {
   const response = await axios.post('/forum/search', { term });
   dispatch({ type: 'FETCHED_UNPOPULATED_SEARCH_POSTS', payload: response.data });
};
//Called by ForumSearch component
export const fetchSearchPosts = searchTerm => async (dispatch, getState) => {
   //Store the search term inputted by the user on the forum page in the state
   await dispatch(storeSearchTerm(searchTerm));
   const term = getState().forumSearchTerm;

   //Search the database for unpopulated-posts using this search term then store it to the state to be rendered first
   await dispatch(fetchUnpopulatedSearchPosts(term));
   const unpopulatedSearchPosts = getState().forumSearchPosts;

   //Then come back and retrieve the populated search posts to find the number of total replies for each search post
   //Else it takes too long to render the search posts
   var populatedPosts = [];
   unpopulatedSearchPosts.forEach(async post => {
      var populatedResponse = await axios.get(`/posts/${post._id}`);
      populatedPosts = [...populatedPosts, populatedResponse.data];
      if (populatedPosts.length === unpopulatedSearchPosts.length) {
         dispatch({ type: 'FETCHED_SEARCH_POSTS', payload: populatedPosts });
      }
   });
};
//Called by PostShow component
export const fetchPost = id => async dispatch => {
   const response = await axios.get(`/posts/${id}`);
   dispatch({ type: 'FETCHED_POST', payload: response.data });
};
//Called by PostEdit and Vote components
export const updatePost = (id, updateObj, mainPostId) => async dispatch => {
   const response = await axios.put(`/posts/${id}`, updateObj);
   console.log(response);
   await dispatch(fetchPost(mainPostId));
   dispatch({ type: 'UPDATED_POST' });
};
//UserProfile
export const fetchUserProfile = userId => async dispatch => {
   const response = await axios.get(`/user/${userId}`);
   dispatch({ type: 'FETCHED_USER_PROFILE', payload: response.data });
};
export const updateHeadphoneRating = (profileId, updateObj) => async dispatch => {
   const response = await axios.put(`/user-profile/${profileId}`, updateObj);
   await dispatch(fetchUserProfile(response.data.userId));
   console.log(response.data);
   dispatch({ type: 'UPDATED_USER_PROFILE' });
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

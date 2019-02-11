import axios from 'axios';
import history from '../history';

//Action Creators
//Arena
//Each headphone entry is a partial object containing only {brand, model, brandAndModel, _id}
export const fetchListOfHeadphones = () => async dispatch => {
   try {
      var response = await axios.get('/headphones');
      dispatch({ type: 'FETCHED_LIST_OF_HEADPHONES', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by SelectedHeadphone component
//Fetch full headphone entry
export const fetchFullHeadphone = id => async dispatch => {
   try {
      var response = await axios.get(`/headphones/${id}`);
      dispatch({ type: 'FETCHED_FULL_HEADPHONE', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by Headphone component
export const selectHeadphone = headphone => async (dispatch, getState) => {
   //Do not add headphone to the redux state if it is already stored in the list
   if (getState().listOfSelectedHeadphones.some(headphoneSelected => headphone._id === headphoneSelected._id)) {
      dispatch({
         type: 'HEADPHONE_REJECTED'
      });
   } else {
      //If the headphone is not in the redux state then display this message and pass it to the reducer
      await dispatch(addGlobalMessage(`${headphone.brandAndModel} has entered the Arena!`));
      dispatch({
         type: 'HEADPHONE_SELECTED',
         payload: headphone
      });
   }
};
//Called by SelectedHeadphone component
export const removeHeadphone = headphoneRemoved => {
   return {
      type: 'HEADPHONE_REMOVED',
      payload: headphoneRemoved
   };
};
//Called by MainPost and Reply component
export const selectHeadphoneUsingNameOnly = headphoneName => async (dispatch, getState) => {
   if (!getState().listOfHeadphones) {
      await dispatch(fetchListOfHeadphones());
   }
   //Look for the headphone entry from redux state using the headphone name
   const headphoneEntry = getState().listOfHeadphones.find(headphone => headphone.brandAndModel === headphoneName);
   //Then call action creator selectHeadphone using the found headphone entry
   dispatch(selectHeadphone(headphoneEntry));
   dispatch({ type: 'HEADPHONE_SELECTED_USING_NAME_ONLY' });
};
//Called by TopPosts component
//Fetch highest voted posts related to the selected headphone
export const fetchTopPosts = headphoneName => async dispatch => {
   try {
      const response = await axios.post('/posts/top', headphoneName);
      dispatch({ type: 'FETCHED_TOP_POSTS', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by Dashboard, TopPosts, ForumCategory components
//Redirect User to the post's show page
export const redirectToMainPost = post => async dispatch => {
   if (post.isMainPost) {
      history.push(`/show-post/${post._id}`);
   } else {
      try {
         //If this post is a reply, find the main post and then redirect the user
         const response = await axios.post('/posts/find-main', { title: post.title });
         console.log(response);
         history.push(`/show-post/${response.data._id}`);
      } catch (err) {
         dispatch(addGlobalMessage(err.response.data));
      }
   }
   console.log('dispatched!');
   dispatch({ type: 'REDIRECTED_TO_MAIN_POST' });
};

//Forum
//Called by Forum component
export const fetchForumHomePosts = () => async dispatch => {
   try {
      const response = await axios.get('/posts');
      dispatch({ type: 'FETCHED_FORUM_POSTS', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
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
   try {
      const response = await axios.post('/posts/search', { term });
      dispatch({ type: 'FETCHED_UNPOPULATED_SEARCH_POSTS', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
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
      try {
         var populatedResponse = await axios.get(`/posts/${post._id}`);
         populatedPosts = [...populatedPosts, populatedResponse.data];
         if (populatedPosts.length === unpopulatedSearchPosts.length) {
            dispatch({ type: 'FETCHED_SEARCH_POSTS', payload: populatedPosts });
         }
      } catch (err) {
         dispatch(addGlobalMessage(err.response.data));
      }
   });
};
//Called by PostShow component
export const fetchPost = id => async dispatch => {
   try {
      const response = await axios.get(`/posts/${id}`);
      dispatch({ type: 'FETCHED_POST', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by PostEdit and Vote components
export const updatePost = (id, updateObj, mainPostId) => async dispatch => {
   try {
      const response = await axios.put(`/posts/${id}`, updateObj);
      console.log(response);
      await dispatch(fetchPost(mainPostId));
      await dispatch(addGlobalMessage('Your Post has been updated successfully!'));
      dispatch({ type: 'UPDATED_POST' });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//UserProfile
//Called by Dashboard component
export const fetchUserProfile = userId => async dispatch => {
   try {
      const response = await axios.get(`/user/${userId}`);
      dispatch({ type: 'FETCHED_USER_PROFILE', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by PersonalHeadphones component
export const updateHeadphoneRating = (profileId, updateObj) => async dispatch => {
   try {
      const response = await axios.put(`/user-profile/${profileId}`, updateObj);
      await dispatch(fetchUserProfile(response.data.userId));
      await dispatch(addGlobalMessage("Your rating has contributed to this headphone's Arena score ..."));
      dispatch({ type: 'UPDATED_USER_PROFILE' });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Authentication
//Called by Register component
export const registerUser = (username, password) => async dispatch => {
   try {
      const response = await axios.post('/register', { username, password });
      await dispatch(askLogin(false));
      await dispatch(addGlobalMessage('Successfully registered and logged in!'));
      dispatch({ type: 'CURRENT_USER', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
//Called by Login component
export const loginUser = (username, password) => async dispatch => {
   try {
      const response = await axios.post('/login', { username, password });
      await dispatch(askLogin(false));
      await dispatch(addGlobalMessage(`Welcome back ${username}!`));
      dispatch({ type: 'CURRENT_USER', payload: response.data });
   } catch (err) {
      dispatch(
         addGlobalMessage('Incorrect username or password! Are you registered? Have you forgotten your password?')
      );
   }
};
//Called by Logout component
export const logoutUser = () => async dispatch => {
   try {
      const response = await axios.get('/logout');
      //Force page to refresh
      history.go(0);
      await dispatch(addGlobalMessage('See you next time!'));
      dispatch({ type: 'CURRENT_USER', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage('Logout failed. You are stuck here forever haha!'));
   }
};
//Called by CheckAuth component
export const checkUser = () => async dispatch => {
   try {
      const response = await axios.get('/user');
      dispatch({ type: 'CURRENT_USER', payload: response.data });
   } catch (err) {
      dispatch(addGlobalMessage(err.response.data));
   }
};
export const askLogin = boolean => {
   return {
      type: 'ASK_LOGIN_STATUS',
      payload: boolean
   };
};
//Global Message
export const addGlobalMessage = message => {
   console.log(message);
   return {
      type: 'GLOBAL_MESSAGE',
      payload: message
   };
};

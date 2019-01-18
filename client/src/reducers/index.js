import { combineReducers } from 'redux';
import { headphoneListReducer, headphoneNamesReducer, selectedHeadphoneReducer } from './arenaReducers';
import {
   forumPostsReducer,
   forumSearchTermReducer,
   searchPostsReducer,
   postReducer,
   updateVoteReducer
} from './forumReducers';
import { currentUserReducer } from './authenticationReducers';

export default combineReducers({
   listOfHeadphones: headphoneListReducer,
   nameList: headphoneNamesReducer,
   listOfSelectedHeadphones: selectedHeadphoneReducer,
   forumPosts: forumPostsReducer,
   forumSearchTerm: forumSearchTermReducer,
   forumSearchPosts: searchPostsReducer,
   post: postReducer,
   updatedVotePosts: updateVoteReducer,
   currentUser: currentUserReducer
});

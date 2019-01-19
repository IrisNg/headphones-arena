import { combineReducers } from 'redux';
import {
   headphoneListReducer,
   headphoneNamesReducer,
   selectedHeadphoneReducer,
   topPostsReducer
} from './arenaReducers';
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
   topPosts: topPostsReducer,
   forumPosts: forumPostsReducer,
   forumSearchTerm: forumSearchTermReducer,
   forumSearchPosts: searchPostsReducer,
   post: postReducer,
   updatedVotePosts: updateVoteReducer,
   currentUser: currentUserReducer
});

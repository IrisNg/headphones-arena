import { combineReducers } from 'redux';
import { headphoneListReducer, selectedHeadphoneReducer, topPostsReducer, fullHeadphoneReducer } from './arenaReducers';
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
   listOfSelectedHeadphones: selectedHeadphoneReducer,
   fullHeadphones: fullHeadphoneReducer,
   topPosts: topPostsReducer,
   forumPosts: forumPostsReducer,
   forumSearchTerm: forumSearchTermReducer,
   forumSearchPosts: searchPostsReducer,
   post: postReducer,
   updatedVotePosts: updateVoteReducer,
   currentUser: currentUserReducer
});

import { combineReducers } from 'redux';
import { headphoneListReducer, selectedHeadphoneReducer, topPostsReducer, fullHeadphoneReducer } from './arenaReducers';
import { forumPostsReducer, forumSearchTermReducer, searchPostsReducer, postReducer } from './forumReducers';
import { userProfileReducer } from './userProfileReducers';
import { currentUserReducer, askLoginReducer } from './authenticationReducers';
import { globalMessageReducer } from './globalMessageReducers';

export default combineReducers({
   listOfHeadphones: headphoneListReducer,
   listOfSelectedHeadphones: selectedHeadphoneReducer,
   fullHeadphones: fullHeadphoneReducer,
   topPosts: topPostsReducer,
   forumPosts: forumPostsReducer,
   forumSearchTerm: forumSearchTermReducer,
   forumSearchPosts: searchPostsReducer,
   post: postReducer,
   userProfile: userProfileReducer,
   currentUser: currentUserReducer,
   loginIsActive: askLoginReducer,
   globalMessage: globalMessageReducer
});

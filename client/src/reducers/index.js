import { combineReducers } from 'redux';

const headphoneListReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCH_LIST_OF_HEADPHONES':
         return action.payload;
      default:
         return state;
   }
};
const headphoneNamesReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCH_LIST_OF_HEADPHONES':
         return action.payload.map(headphone => {
            return { brand: headphone.brand, model: headphone.model, brandAndModel: headphone.brandAndModel };
         });
      default:
         return state;
   }
};

const selectedHeadphoneReducer = (state = [], action) => {
   if (action.type === 'HEADPHONE_SELECTED' && state.includes(action.payload) === false) {
      return [...state, action.payload];
   }
   if (action.type === 'HEADPHONE_REMOVED') {
      return state.filter(function(headphone) {
         return headphone !== action.payload;
      });
   }
   return state;
};

const forumPostsReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_FORUM_POSTS':
         return action.payload;
      default:
         return state;
   }
};
const forumSearchTermReducer = (state = '', action) => {
   switch (action.type) {
      case 'FORUM_SEARCH_TERM':
         return action.payload;
      default:
         return state;
   }
};
const searchPostsReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_UNPOPULATED_SEARCH_POSTS':
         return action.payload;
      case 'FETCH_SEARCH_POSTS':
         //Calculate the total number of replies for each search post and add that as a property to each search post's object
         var postsWithRepliesCount = action.payload.map(post => {
            var totalReplies = 0;
            if (post.replies) {
               post.replies.forEach(reply1 => {
                  totalReplies++;
                  if (reply1.replies) {
                     reply1.replies.forEach(reply2 => {
                        totalReplies++;
                        if (reply2.replies) {
                           reply2.replies.forEach(reply3 => {
                              totalReplies++;
                              if (reply3.replies) {
                                 reply3.replies.forEach(reply4 => {
                                    totalReplies++;
                                 });
                              }
                           });
                        }
                     });
                  }
               });
            }

            return { ...post, totalReplies };
         });
         return postsWithRepliesCount;
      default:
         return state;
   }
};
const postReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_POST':
         return action.payload;
      default:
         return state;
   }
};

const currentUserReducer = (state = null, action) => {
   switch (action.type) {
      case 'CURRENT_USER':
         //If user is logged-out
         if (!action.payload) {
            return null;
         }
         //If user is logged-in
         return { username: action.payload.username, id: action.payload._id };
      default:
         return state;
   }
};

export default combineReducers({
   listOfHeadphones: headphoneListReducer,
   nameList: headphoneNamesReducer,
   listOfSelectedHeadphones: selectedHeadphoneReducer,
   forumPosts: forumPostsReducer,
   forumSearchTerm: forumSearchTermReducer,
   forumSearchPosts: searchPostsReducer,
   post: postReducer,
   currentUser: currentUserReducer
});

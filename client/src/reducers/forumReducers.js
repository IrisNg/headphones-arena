export const forumPostsReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_FORUM_POSTS':
         return action.payload;
      default:
         return state;
   }
};
export const forumSearchTermReducer = (state = '', action) => {
   switch (action.type) {
      case 'FORUM_SEARCH_TERM':
         return action.payload;
      default:
         return state;
   }
};
export const searchPostsReducer = (state = null, action) => {
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
export const postReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_POST':
         return action.payload;
      default:
         return state;
   }
};

export const updateVoteReducer = (state = [], action) => {
   switch (action.type) {
      case 'UPDATED_VOTE_POST':
         var removedExisting = state.filter(post => post._id !== action.payload._id);
         //An array of posts with just the updated votes and ids
         return [...removedExisting, { _id: action.payload._id, vote: action.payload.vote }];
      default:
         return state;
   }
};
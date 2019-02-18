export const videoListReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCHED_VIDEOS':
         return action.payload;
      default:
         return state;
   }
};

export const featuredVideoReducer = (state = null, action) => {
   switch (action.type) {
      case 'FEATURED_VIDEO':
         return action.payload;
      default:
         return state;
   }
};

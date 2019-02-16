export const videoListReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCHED_VIDEOS':
         return action.payload;
      default:
         return state;
   }
};

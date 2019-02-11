export const headphoneListReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCHED_LIST_OF_HEADPHONES':
         return action.payload;
      default:
         return state;
   }
};
export const fullHeadphoneReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCHED_FULL_HEADPHONE':
         if (!state.some(entry => entry._id === action.payload._id)) {
            return [...state, action.payload];
         }
         return state;
      default:
         return state;
   }
};
export const selectedHeadphoneReducer = (state = [], action) => {
   switch (action.type) {
      case 'HEADPHONE_REJECTED':
         return state;
      case 'HEADPHONE_SELECTED':
         return [...state, action.payload];
      case 'HEADPHONE_REMOVED':
         return state.filter(headphone => headphone._id !== action.payload._id);
      default:
         return state;
   }
};

export const topPostsReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCHED_TOP_POSTS':
         if (!state.some(entry => entry.headphone === action.payload.headphone)) {
            return [...state, action.payload];
         }
         return state;
      default:
         return state;
   }
};

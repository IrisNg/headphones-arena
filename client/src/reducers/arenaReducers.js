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
   if (
      action.type === 'HEADPHONE_SELECTED' &&
      state.every(headphone => headphone.brandAndModel !== action.payload.brandAndModel)
   ) {
      return [...state, action.payload];
   } else if (action.type === 'HEADPHONE_REMOVED') {
      return state.filter(function(headphone) {
         return headphone !== action.payload;
      });
   }
   return state;
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

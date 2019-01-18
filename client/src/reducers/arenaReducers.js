export const headphoneListReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCH_LIST_OF_HEADPHONES':
         return action.payload;
      default:
         return state;
   }
};
export const headphoneNamesReducer = (state = [], action) => {
   switch (action.type) {
      case 'FETCH_LIST_OF_HEADPHONES':
         return action.payload.map(headphone => {
            return { brand: headphone.brand, model: headphone.model, brandAndModel: headphone.brandAndModel };
         });
      default:
         return state;
   }
};

export const selectedHeadphoneReducer = (state = [], action) => {
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

export const userProfileReducer = (state = null, action) => {
   switch (action.type) {
      case 'FETCH_USER_PROFILE':
         return action.payload;
      default:
         return state;
   }
};

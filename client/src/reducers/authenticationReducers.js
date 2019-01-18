export const currentUserReducer = (state = null, action) => {
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

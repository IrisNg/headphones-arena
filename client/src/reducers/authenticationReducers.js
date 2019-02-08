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

export const askLoginReducer = (state = false, action) => {
   switch (action.type) {
      case 'ASK_LOGIN':
         return action.payload;
      default:
         return state;
   }
};

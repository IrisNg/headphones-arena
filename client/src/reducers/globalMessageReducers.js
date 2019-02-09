export const globalMessageReducer = (state = '', action) => {
   switch (action.type) {
      case 'GLOBAL_MESSAGE':
         return action.payload;
      default:
         return state;
   }
};

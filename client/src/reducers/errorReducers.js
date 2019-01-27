export const globalErrorReducer = (state = null, action) => {
   switch (action.type) {
      case 'ERROR_MESSAGE':
         return action.payload;
      default:
         return state;
   }
};

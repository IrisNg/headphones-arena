import React from 'react';

const ForumStyling = () => {
   return (
      <div className="forum-styling">
         <div className="forum__category-names">
            <h2>COMPARISON</h2>
            <h2>REVIEW</h2>
            <h2>GENERAL</h2>
            <h2>RECOMMENDATION</h2>
         </div>
         <div className="forum__name forum__name--comparison">
            <h5>COMPARISON</h5>
         </div>
         <div className="forum__name forum__name--recommendation">
            <h5>RECOMMENDATION</h5>
         </div>
         <div className="forum__name forum__name--review">
            <h5>REVIEW</h5>
         </div>
         <div className="forum__name forum__name--general">
            <h5>GENERAL</h5>
         </div>
      </div>
   );
};

export default ForumStyling;

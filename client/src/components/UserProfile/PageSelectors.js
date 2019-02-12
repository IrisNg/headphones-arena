import React from 'react';

const PageSelectors = ({ selectPage, isOwner }) => {
   return (
      <div className="page-selectors">
         <div className="page-selectors__selector">
            <h2 className="page-selectors__label">messages</h2>
            <div className="page-selectors__button" onClick={() => selectPage('messages')}>
               M
            </div>
         </div>
         <div className="page-selectors__selector">
            <h2 className="page-selectors__label">ratings</h2>
            <div className="page-selectors__button" onClick={() => selectPage('ratings')}>
               R
            </div>
         </div>
         <div className="page-selectors__selector" style={isOwner ? null : { display: 'none' }}>
            <h2 className="page-selectors__label">avatar</h2>
            <div className="page-selectors__button" onClick={() => selectPage('avatar')}>
               A
            </div>
         </div>
         <div className="page-selectors__selector">
            <h2 className="page-selectors__label">posts</h2>
            <div className="page-selectors__button" onClick={() => selectPage('posts')}>
               P
            </div>
         </div>
      </div>
   );
};

export default PageSelectors;

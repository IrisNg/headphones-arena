import React from 'react';

class PageSelectors extends React.Component {
   manageActiveButtonClass(pageName) {
      const { page } = this.props;
      return page === pageName ? 'page-selectors__button--active' : null;
   }

   render() {
      const { selectPage, isOwner } = this.props;
      return (
         <div className="page-selectors">
            <div className="page-selectors__item">
               <h2 className="page-selectors__label">messages</h2>
               <div
                  className={`page-selectors__button ${this.manageActiveButtonClass('messages')}`}
                  onClick={() => selectPage('messages')}
               >
                  M
               </div>
            </div>
            <div className="page-selectors__item">
               <h2 className="page-selectors__label">ratings</h2>
               <div
                  className={`page-selectors__button ${this.manageActiveButtonClass('ratings')}`}
                  onClick={() => selectPage('ratings')}
               >
                  R
               </div>
            </div>
            <div className="page-selectors__item" style={isOwner ? null : { display: 'none' }}>
               <h2 className="page-selectors__label">avatar</h2>
               <div
                  className={`page-selectors__button ${this.manageActiveButtonClass('avatar')}`}
                  onClick={() => selectPage('avatar')}
               >
                  A
               </div>
            </div>
            <div className="page-selectors__item">
               <h2 className="page-selectors__label">posts</h2>
               <div
                  className={`page-selectors__button ${this.manageActiveButtonClass('posts')}`}
                  onClick={() => selectPage('posts')}
               >
                  P
               </div>
            </div>
         </div>
      );
   }
}

export default PageSelectors;

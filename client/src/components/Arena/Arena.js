import React from 'react';
import HeadphoneList from './HeadphoneList';
import SelectedList from './SelectedList';
import NavigationBar from './NavigationBar';
import './Arena.css';

const Arena = () => {
   return (
      <div className="arena">
         {/* <div className="cover-up" /> */}
         <NavigationBar />
         <HeadphoneList />
         <SelectedList />
      </div>
   );
};

export default Arena;

import React from 'react';
// import { Link } from 'react-router-dom';
import HeadphoneList from './HeadphoneList';
import SelectedList from './SelectedList';
import LiveChat from '../LiveChat/LiveChat';
import './Arena.css';

const Arena = () => {
   return (
      <div className="arena">
         <div className="arena__horizontal-line" />
         <HeadphoneList />
         <SelectedList />
         <LiveChat />
         <div className="arena__nav-bar-line" />
      </div>
   );
};

export default Arena;

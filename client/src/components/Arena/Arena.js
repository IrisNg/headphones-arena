import React from 'react';
// import { Link } from 'react-router-dom';
import HeadphoneList from './HeadphoneList';
import SelectedList from './SelectedList';
import LiveChat from '../LiveChat/LiveChat';
import './Arena.css';

const Arena = () => {
   return (
      <div className="arena">
         <div className="arena__background" />
         <div className="arena__content">
            <HeadphoneList />
            <SelectedList />
            <LiveChat />
            <div className="arena__continuous-line" />
         </div>
      </div>
   );
};

export default Arena;

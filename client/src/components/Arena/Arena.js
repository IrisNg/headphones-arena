import React from 'react';
// import { Link } from 'react-router-dom';
import HeadphoneList from './HeadphoneList';
import SelectedList from './SelectedList';
import LiveChat from '../LiveChat/LiveChat';
import './Arena.css';

const Arena = () => {
   return (
      <div className="arena">
         {/* <div className="cover-up" /> */}
         <div className="arena__continuous-line" />
         <HeadphoneList />
         <SelectedList />
         <LiveChat />
         {/* <Link to="/headphones/new">Add New Headphones</Link> */}
      </div>
   );
};

export default Arena;

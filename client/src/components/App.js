import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

const App = () => {
   return (
      <div>
         <BrowserRouter>
            <div>
               <Route path="/" exact component={LandingPage} />
            </div>
         </BrowserRouter>
      </div>
   );
};
export default App;

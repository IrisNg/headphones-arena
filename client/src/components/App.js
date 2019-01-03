import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

const App = () => {
   return (
      <div>
         <BrowserRouter>
            <div>
               <Route path="/" exact component={LandingPage} />
               {/* <Route path="/arena" component={Arena} />
               <Route path="/headphones/new" component={HeadphoneCreate} />
               <Route path="/headphones/:id/edit" exact component={HeadphoneEdit} />
               <Route path="/forum" component={Forum} />
               <Route path="/posts/new" component={PostCreate} />
               <Route path="/posts/:id" exact component={PostShow} />
               <Route path="/blacksmith" component={Blacksmith} />
               <Route path="/mods/new" component={ModCreate} />
               <Route path="/mods/:id" exact component={ModShow} />
               <Route path="/mods/:id/edit" exact component={ModEdit} />
               <Route path="/marketplace" component={Marketplace} />
               <Route path="/sales/new" component={SaleCreate} />
               <Route path="/sales/:id" exact component={SaleShow} />
               <Route path="/sales/:id/edit" exact component={SaleEdit} /> */}
            </div>
         </BrowserRouter>
      </div>
   );
};
export default App;

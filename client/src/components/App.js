import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import LandingPage from './LandingPage';
import Arena from './Arena/Arena';
import HeadphoneCreate from './Arena/HeadphoneCreate';
import HeadphoneEdit from './Arena/HeadphoneEdit';
import Forum from './Forum/Forum';
import PostShow from './Forum/PostShow';
import PostCreate from './Forum/PostCreate';
import PostEdit from './Forum/PostEdit';
import PostDelete from './Forum/PostDelete';
import Blacksmith from './Blacksmith/Blacksmith';
import Marketplace from './Marketplace/Marketplace';
import Dashboard from './UserProfile/Dashboard';

// delete
import Register from './Authentication/Register';
import CheckAuth from './Authentication/CheckAuth';

const App = () => {
   return (
      <div>
         <Router history={history}>
            <div>
               <CheckAuth />
               <Switch>
                  <Route path="/" exact component={LandingPage} />
                  <Route path="/arena" component={Arena} />
                  <Route path="/headphones/new" component={HeadphoneCreate} />
                  <Route path="/headphones/edit" component={HeadphoneEdit} />
                  <Route path="/forum" component={Forum} />
                  <Route path="/posts/new" component={PostCreate} />
                  <Route exact path="/posts/:id" component={PostShow} />
                  <Route path="/posts/:id/edit" component={PostEdit} />
                  <Route path="/posts/:id/delete" component={PostDelete} />
                  <Route path="/blacksmith" component={Blacksmith} />
                  {/* <Route path="/mods/new" component={ModCreate} />
               <Route path="/mods/:id" exact component={ModShow} /> */}
                  {/* <Route path="/mods/:id/edit" exact component={ModEdit} /> */}
                  <Route path="/marketplace" component={Marketplace} />
                  {/* <Route path="/sales/new" component={SaleCreate} />
               <Route path="/sales/:id" exact component={SaleShow} />
               <Route path="/sales/:id/edit" exact component={SaleEdit} /> */}
                  <Route path="/register" component={Register} />
                  <Route path="/user/:id" component={Dashboard} />
               </Switch>
            </div>
         </Router>
      </div>
   );
};
export default App;

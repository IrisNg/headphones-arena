import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import Landing from './Landing';
import NavigationBar from './NavigationBar';
import GlobalError from './GlobalError';
import Arena from './Arena/Arena';
import HeadphoneCreate from './Arena/HeadphoneCreate';
import HeadphoneEdit from './Arena/HeadphoneEdit';
import Forum from './Forum/Forum';
import PostShow from './Forum/PostShow';
import PostCreate from './Forum/PostCreate';
import PostEdit from './Forum/PostEdit';
import PostDelete from './Forum/PostDelete';
import Blacksmith from './Blacksmith/Blacksmith';
import Dashboard from './UserProfile/Dashboard';

// delete
import Authentication from './Authentication/Authentication';
import CheckAuth from './Authentication/CheckAuth';

import './App.css';

class App extends React.Component {
   render() {
      return (
         <Router history={history}>
            <div>
               <Switch>
                  <Route path="/" exact component={Landing} />
                  <Route path="/arena" component={Arena} />
                  <Route path="/create-headphone" component={HeadphoneCreate} />
                  <Route path="/edit-headphone" component={HeadphoneEdit} />
                  <Route path="/forum" component={Forum} />
                  <Route path="/create-post" component={PostCreate} />
                  <Route exact path="/show-post/:id" component={PostShow} />
                  <Route path="/edit-post/:id" component={PostEdit} />
                  <Route path="/delete-post/:id" component={PostDelete} />
                  <Route path="/blacksmith" component={Blacksmith} />
                  {/* <Route path="/mods/new" component={ModCreate} />
               <Route path="/mods/:id" exact component={ModShow} /> */}
                  {/* <Route path="/mods/:id/edit" exact component={ModEdit} /> */}
                  <Route path="/login" component={Authentication} />
                  <Route path="/user/:id" component={Dashboard} />
               </Switch>
               <NavigationBar />
               <CheckAuth />
               <GlobalError />
               {/* <div className="forum-lines">
                  <div />
                  <div />
                  <div />
                  <div />
               </div> */}
            </div>
         </Router>
      );
   }
}

export default App;

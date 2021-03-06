import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import Landing from './Landing/Landing';
import NavigationBar from './NavigationBar';
import GlobalMessage from './GlobalMessage';
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

import Login from './Authentication/Login';
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
                  <Route path="/dashboard/:id" component={Dashboard} />
               </Switch>
               <NavigationBar />
               <CheckAuth />
               <Login />
               <GlobalMessage />
            </div>
         </Router>
      );
   }
}

export default App;

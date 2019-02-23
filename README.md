# Headphones Arena

A Website Dedicated to Headphones Comparison 

Objective Side
This website has gathered all those hard facts for you to crunch data efficiently.

Subjective Side
If you believe in word-of-mouth,


## Features

* Arena
  - Clickable & Selectable list of Headphones - Show more details of the headphone when selected (rating, popular forum tags, amazon price, description, specifications, related forum posts).  
  - Designed for Comparison - selected headphones are aligned side by side for ease of comparison. Up to 3 ~ 4 headphones' details can be accomodated depending on the device.
* Forum
  - View Posts made by Audiophiles - Posts are sorted into four categories (Comparison, Review, Budget Recommendation, General). A mix of the latest and most upvoted posts are picked.
  - Search Bar - Powered by Regular Expression. Want to know more about a specific headphone? Use the search function! Have a strict budget for your next impulse buy? Use the search function!
  - Create, Reply, Edit, Delete and Vote Posts 
  - Tag System - A library of pre-defined descriptive & colorful phrases for you to tag the headphones mentioned in your post with. Every Tag Counts. The most frequently used tags appear in Arena to help new-comers find the perfect headphone for themselves. 
* Blacksmith
  - Now Showing: Featured videos of DIY Headphones Modding - Direct from this website's official Youtube playlist
  - Don't like the videos you are seeing? Just refresh the page to load new ones!
* Dashboard
  - Rate Headphones - Give a score to those headphones you have the honor to listen to! Then wear them like badges! Note: this directly affects the headphone's Arena score.
  - View posts made by you & yourself
  - Upload Avatar - and have them display beside your username!
  - Private Message - Send secretive messages to other users or seek advice about a specific headphone from a knowledgable mentor
* Live-chat 
  - A minimalistic chat box to communicate with Users who are online in real-time.

## Technologies Used

* React 
* Redux
* Redux-thunk
* React-router
* CSS - CSS Flexbox, CSS Grid, Animation (pure CSS, no library)
* SASS variables
* Regular Expression
* Axios
* Node JS & Express
* Passport (Local)
* Mongo DB

## Important Files

* REACT - REDUX 
  - App component (including paths for React-Router) - /client/src/components/App.js
  - Components folder (including respective CSS & SCSS files) - /client/src/components
  - Action Creators file - /client/src/actions/index.js
  - Reducers folder - /client/src/
  - Components Hierarchy Diagram - /client/reference/Headphones Arena Component Diagram.png or [here](https://i.imgur.com/1J4OWiH.png)
  
* BACKEND
  - Server file - /server.js
  - Routes folder - /routes
  - Models folder - /models
  - Middleware file - /middleware/index.js

## Struggle Zones (AKA challenges that made me got smacked around by the technologies I used)

* react router param changes but component does not remount, have to manually reset component state
* async await and promises on the backend so as to perform multiple asynchronous CRUD operations (in one route) with nested forloops in each operation 
* importance of deep copying using map method so as to not mutate arrays and objects in react props when they are assigned to component state or passed further down as props to children components
* lifecycle methods - componentWillUnmount to clear timers and getDerivedStateFromProps to update component state after receiving a certain prop value
* redux thunk - asynchronously dispatch action only after response from server is fetched, also chaining multiple action creators within an action creator. Using getState to refer to redux state in action creator
* Restful routes - planning client-side react router's routes to not conflict with the server-side AJAX routes else json from server side will be sent instead of the index.html from react to the browser
* History object with plain Router in react router to navigate between pages, so that the user can be redirected back or to a new url. Also history.listen() to listen for url changes in static default components which render on every page
* CSS flexbox and grid - use flex box for one direction alignment and grid for more complex alignment. Good for web responsiveness. CSS grid requires html/JSX elements to be structured a certain way as it is not applied to non-direct children. Nesting of grids and flexboxes are also useful.
* CSS animation - for smoother and more organic user experience
* Overflow scrolling
* Regular Expression for searches on React side and for mongoDB Find operation, its fun! (but slow)
* Passport local authentication method - using req.user to check authentication status
* Error handling from server side to client side - using try and catch blocks + GlobalMessage 
* Fiddling with youtube API
* SASS variables - have not experimented with inheritance, nested rules, mixins yet
* avoid mapping the same key-values from redux state multiple times between sibling components, it will cause same-props naming conflict. Instead, map the key value once to the parent component and pass it down as props to the children.
* Axios - fetch data from server without causing page reload on single page application like this one.
* Pulling documents or arrays from mongoDB is an art ($set, $or, $and, $pull).


## Installation Instructions

### Prerequisites
Make sure you have **[Node.JS](https://nodejs.org/en/), [Postman](https://www.getpostman.com/) and [Mongo DB](https://www.mongodb.com/)** installed locally, [SASS](https://sass-lang.com/) is optional

### Dependencies
    #### Server-side : 
    * body-parser
    * concurrently
    * express
    * express-session
    * mongoose
    * passport
    * passport-local
    * passport-local-mongoose

    #### Client-side :
    * axios
    * moment
    * react
    * react-dom
    * react-moment
    * react-redux
    * react-router-dom
    * redux
    * redux-thunk

### Steps

1. Clone the repository to any of your local folder

2. Install the following **SERVER-SIDE** dependencies to the main project folder **(i.e. C:/.../headphones-arena-master)** by running the following command in your terminal :
```
npm install body-parser concurrently express express-session mongoose passport passport-local passport-local-mongoose --save
```
3. Navigate in your terminal to the 'client' folder by running this command in your terminal :
```
cd client
```
4. Install the following **CLIENT-SIDE** dependencies to the client folder **(i.e. C:/.../headphones-arena-master/client)** by running the following command in your terminal :
```
npm install axios moment react react-dom react-moment react-redux react-router-dom redux redux-thunk --save
```
5. Start the app using the following command in your terminal (make sure your local mongoDB is running beforehand!) :
```
npm run dev
```
6. Seed the necessary documents into mongoDB by using [Postman](https://www.getpostman.com/) to send a POST request to 
* http://localhost:3000/headphones/seed

7. All set up! In your browser, go to 'http://localhost:3000', the app should be up and running!

## Contributors

Created by Iris Ng. 
Feel free to hit me up with those bug reports or places where my code can use some improvement :) thanks!
















  


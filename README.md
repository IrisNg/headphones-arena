# Headphones Arena

**A Website Dedicated to Headphones Comparison** 

A picture is worth a thousand words, but is a thousand words sufficient to describe a good sounding pair of headphones?

As a fellow Audiophile with shallow pockets, I have always relied on word-of-mouth (AKA intensive research) to discover great sounding headphones at an affordable price. Specifications always sound good on paper (duh!), but do not always deliver a performing pair of headphones. Scouring the internet for crumbs of reviews is just part of the daily grind. When everyone has a different pair of ears, that is a lot of words we Audiophiles have to process to come to a decision.

To bring back the fun in discovering Headphones, this website cuts to the chase by gathering hard facts and subjectivities in one place:
* Shortening words by Tagging Keywords - Tag System ( A superpower to use less words but write more helpful reviews)
* Reducing words to numbers - Rating System
* Gathering all the words in one place - Forum
* Receive enlightening words in real-time - Live Chat
* Receive enlightening words (introvert version) - Private Messaging

## Features

* Arena
  - Show more details of the Headphone when selected - rating, popular forum tags, amazon price, description, specifications, related forum posts.  
  - Designed for Comparison - selected headphones are aligned side by side for ease of comparison. Up to 3 ~ 4 headphones' details can be accomodated depending on the device.
* Forum
  - Posts are sorted into four categories (Comparison, Review, Budget Recommendation, General). A mix of the latest and most upvoted posts are picked.
  - Search Bar - Powered by Regular Expression. Want to know more about a specific headphone? Use the search function! Have a strict budget for your next impulse buy? Use the search function!
  - Create, Reply, Edit, Delete and Vote Posts 
  - Tag System - A library of pre-defined descriptive & colorful phrases for you to tag the headphones mentioned in your post with. Every Tag Counts. The most frequently used tags appear in Arena to help new-comers find the perfect headphone for themselves. 
* Blacksmith
  - Now Showing: Featured videos of DIY Headphones Modding - Direct from this website's official Youtube playlist
  - Don't like the videos you are seeing? Just refresh the page to load new ones!
* Dashboard
  - Rate Headphones - Give a score to those headphones you have had the honor to listen to! Then wear them like badges! Note: this directly affects the headphone's Arena score.
  - Upload Avatar - and have them display beside your username!
  - Private Messaging - Send those promo codes to your friends on the website secretly, or seek advice about a certain headphone from a knowledgable mentor
* Live-chat 
  - A minimalistic chat box to communicate with Users who are online in real-time.

## Technologies Used

* React 
* Redux
* Redux-thunk
* React-router
* Javascript
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

* Restful Routes - planning client-side react router's routes to not conflict with the server-side AJAX routes, else json from the server-side will be sent instead of the React index.html to the Client browser.

* Async Await and Promise on the backend - so as to be able to perform multiple asynchronous CRUD operations in one route (with nested for-loops in each operation) without callback hell. 

* Pulling documents or arrays from mongoDB is an art (as with $set, $or, $and, $pull).

* Passport Local Authentication Method - using req.user to check authentication status.

* Axios - fetch data from server without causing page reload on a single page application like this one.

* History Object + plain Router - to navigate between pages, so that the User can be redirected back or to a new url. Also history.listen() to listen for url changes in static default components that render on every page.

* React Router - if param changes but path remains the same, component will not remount automatically, solution is to manually reset component state, and refire action creators.

* Lifecycle Methods - componentWillUnmount to clear timers and getDerivedStateFromProps to update component state after receiving a certain prop value. Also, componentDidUpdate and ComponentDidMount.

* Deep Copying using Map method in React - so as to not mutate arrays and objects in React Props when they are assigned to component state or passed further down as props to children components.

* Props Mapping Collision - avoid mapping the same key-values from redux state multiple times between sibling components, it will cause same-props naming conflict. Instead, map the key-value once to the parent component and pass it down as props to the children.

* Redux Thunk - asynchronously dispatch action only after response from server is fetched, also chaining multiple action creators within an action creator. Using getState to refer to redux state inside action creator.

* CSS Flexbox and Grid - use Flex box for one-dimensional alignment and Grid for more complex two-dimensional alignment. Good for web responsiveness. CSS grid requires html/JSX elements to be structured a certain way as it is not applied to non-direct descendants. Nesting of Grids and Flexboxes are also useful.

* CSS Animation - for smoother and more organic user experience.

* Overflow scrolling and clickable mini pages - if page is very loaded with information, organize them into compartmentalized boxes without overwhelming the user.

* SASS Variables - have not experimented with inheritance, nested rules, mixins yet.

* Regular Expression - searches on React-side and for mongoDB Find operation, its fun! (But slow).

* Fiddling with youtube API

* Error Handling from server-side to client-side - using status code + try and catch blocks + GlobalMessage component.

## Installation Instructions

### Prerequisites
Make sure you have **[Node.JS](https://nodejs.org/en/), [Postman](https://www.getpostman.com/) and [Mongo DB](https://www.mongodb.com/)** installed locally, [SASS](https://sass-lang.com/) is optional, [Redux DevTools](https://github.com/reduxjs/redux-devtools) is plenty helpful but optional also.

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

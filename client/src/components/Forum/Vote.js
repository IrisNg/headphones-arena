import React from 'react';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import { updatePost } from '../../actions';
import Login from '../Authentication/Login';

class Vote extends React.Component {
   state = {
      askLogin: false
   };
   onVoteClick = voteNature => {
      const { currentUser, vote } = this.props;
      //Allow voting only if user is logged in
      if (currentUser) {
         //Format object to send to the server by making a deep copy of the original vote object, no referencing!
         var updateObj = {
            body: {
               vote: {
                  count: vote.count,
                  upVote: [...vote.upVote],
                  downVote: [...vote.downVote]
               }
            }
         };
         if (voteNature === 'upvote') {
            if (vote.upVote.includes(currentUser.id)) {
               //User upvoted previously, now wants to remove vote
               updateObj.body.vote.count--;
               updateObj.body.vote.upVote = updateObj.body.vote.upVote.filter(id => id !== currentUser.id);
            } else if (vote.downVote.includes(currentUser.id)) {
               //User down-voted previously, now wants to switch to upvote
               updateObj.body.vote.count += 2;
               updateObj.body.vote.downVote = updateObj.body.vote.downVote.filter(id => id !== currentUser.id);
               updateObj.body.vote.upVote = [...updateObj.body.vote.upVote, currentUser.id];
            } else {
               //No previous record, new upvote
               updateObj.body.vote.count++;
               updateObj.body.vote.upVote = [...updateObj.body.vote.upVote, currentUser.id];
            }
         } else if (voteNature === 'downvote') {
            if (vote.downVote.includes(currentUser.id)) {
               //User down-voted previously, now wants to remove vote
               updateObj.body.vote.count++;
               updateObj.body.vote.downVote = updateObj.body.vote.downVote.filter(id => id !== currentUser.id);
            } else if (vote.upVote.includes(currentUser.id)) {
               //User upvoted previously, now wants to switch to downvote
               updateObj.body.vote.count -= 2;
               updateObj.body.vote.upVote = updateObj.body.vote.upVote.filter(id => id !== currentUser.id);
               updateObj.body.vote.downVote = [...updateObj.body.vote.downVote, currentUser.id];
            } else {
               //No previous record, new down-vote
               updateObj.body.vote.count--;
               updateObj.body.vote.downVote = [...updateObj.body.vote.downVote, currentUser.id];
            }
         }
         //Call action creator to update this post
         this.props.updatePost(this.props.id, updateObj, this.props.mainPostId);
      } else {
         this.setState({ askLogin: true });
      }
   };
   askLogin() {
      if (this.state.askLogin && this.props.currentUser) {
         this.setState({ askLogin: false });
      }
      if (this.state.askLogin) {
         return <Login />;
      }
   }
   render() {
      const { vote } = this.props;
      return (
         <div>
            <i className="fas fa-angle-up" onClick={() => this.onVoteClick('upvote')} />
            {vote.count}
            <i className="fas fa-angle-down" onClick={() => this.onVoteClick('downvote')} />
            {this.askLogin()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { updatePost }
)(Vote);

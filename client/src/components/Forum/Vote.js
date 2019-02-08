import React from 'react';
import { connect } from 'react-redux';
import { updatePost, askLogin } from '../../actions';

class Vote extends React.Component {
  
   onVoteClick = voteNature => {
      var { currentUser, vote } = this.props;
      //Allow voting only if user is logged in
      if (!currentUser) {
         this.props.askLogin(true);
      } else {
         //Create variables by making a deep copy of the original vote object, no referencing!
         var count = vote.count;
         var upVote = [...vote.upVote];
         var downVote = [...vote.downVote];

         if (voteNature === 'upvote') {
            if (upVote.includes(currentUser.id)) {
               //User upvoted previously, now wants to remove vote
               count--;
               upVote = upVote.filter(id => id !== currentUser.id);
            } else if (downVote.includes(currentUser.id)) {
               //User down-voted previously, now wants to switch to upvote
               count += 2;
               downVote = downVote.filter(id => id !== currentUser.id);
               upVote = [...upVote, currentUser.id];
            } else {
               //No previous record, new upvote
               count++;
               upVote = [...upVote, currentUser.id];
            }
         } else if (voteNature === 'downvote') {
            if (downVote.includes(currentUser.id)) {
               //User down-voted previously, now wants to remove vote
               count++;
               downVote = downVote.filter(id => id !== currentUser.id);
            } else if (upVote.includes(currentUser.id)) {
               //User upvoted previously, now wants to switch to downvote
               count -= 2;
               upVote = upVote.filter(id => id !== currentUser.id);
               downVote = [...downVote, currentUser.id];
            } else {
               //No previous record, new down-vote
               count--;
               downVote = [...downVote, currentUser.id];
            }
         }
         //Format object to send to the server
         var updateObj = {
            body: {
               vote: {
                  count,
                  upVote,
                  downVote
               }
            }
         };
         //Call action creator to update this post
         this.props.updatePost(this.props.id, updateObj, this.props.mainPostId);
      }
   };
   manageUpVoteIconStyle() {
      var { vote, currentUser } = this.props;
      return currentUser && vote.upVote.includes(currentUser.id) ? 'vote--active' : null;
   }
   manageDownVoteIconStyle() {
      var { vote, currentUser } = this.props;
      return currentUser && vote.downVote.includes(currentUser.id) ? 'vote--active' : null;
   }
   render() {
      var { vote } = this.props;
      return (
         <div className="vote">
            <i
               className={`fas fa-caret-up ${this.manageUpVoteIconStyle()}`}
               onClick={() => this.onVoteClick('upvote')}
            />
            {vote.count}
            <i
               className={`fas fa-caret-down ${this.manageDownVoteIconStyle()}`}
               onClick={() => this.onVoteClick('downvote')}
            />
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { currentUser: state.currentUser };
};
export default connect(
   mapStateToProps,
   { updatePost, askLogin }
)(Vote);

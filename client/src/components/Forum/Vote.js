import React from 'react';
import { connect } from 'react-redux';
import { updatePost } from '../../actions';
import Login from '../Authentication/Login';
import './Vote.css';

class Vote extends React.Component {
   state = {
      askLogin: false
   };
   onVoteClick = voteNature => {
      var { currentUser, vote } = this.props;
      //Allow voting only if user is logged in
      if (!currentUser) {
         this.setState({ askLogin: true });
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
   askLogin() {
      if (this.state.askLogin && this.props.currentUser) {
         this.setState({ askLogin: false });
      } else if (this.state.askLogin) {
         return <Login />;
      }
   }
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
         <div>
            <i
               className={`fas fa-angle-up ${this.manageUpVoteIconStyle()}`}
               onClick={() => this.onVoteClick('upvote')}
            />
            {vote.count}
            <i
               className={`fas fa-angle-down ${this.manageDownVoteIconStyle()}`}
               onClick={() => this.onVoteClick('downvote')}
            />
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

import React from 'react';
import { connect } from 'react-redux';
import { updateVote } from '../../actions';

const Vote = ({ vote, id, updateVote, currentUser, updatedVote }) => {
   return (
      <div>
         <i
            className="fas fa-angle-up"
            // onClick={() => (vote.upVote.includes(currentUser) ? updateVote(id, 'remove') : updateVote(id, 'upvote'))}
            onClick={() => {
               if (updatedVote) {
                  updatedVote.vote.upVote.includes(currentUser.id)
                     ? updateVote(id, 'remove')
                     : updateVote(id, 'upvote');
               } else {
                  vote.upVote.includes(currentUser.id) ? updateVote(id, 'remove') : updateVote(id, 'upvote');
               }
            }}
         />
         {vote.count}
         {/* {updatedVote ? updateVote.vote.count : vote.count} */}
         <i
            className="fas fa-angle-down"
            // onClick={() =>
            //    vote.downVote.includes(currentUser) ? updateVote(id, 'remove') : updateVote(id, 'downvote')
            // }
            onClick={() => {
               if (updatedVote) {
                  updatedVote.vote.downVote.includes(currentUser.id)
                     ? updateVote(id, 'remove')
                     : updateVote(id, 'downvote');
               } else {
                  vote.downVote.includes(currentUser.id) ? updateVote(id, 'remove') : updateVote(id, 'downvote');
               }
            }}
         />
      </div>
   );
};

// class Vote extends React.Component {

//     render() {
//        const { vote, id } = this.props;
//        return (
//           <div>
//              <div>{id}</div>
//              <i className="fas fa-angle-up" />
//              {vote.count}
//              <i className="fas fa-angle-down" />
//           </div>
//        );
//     }
//  }
const mapStateToProps = (state, ownProps) => {
   if (state.updatedVotePosts) {
      var updatedVote = state.updatedVotePosts.find(post => post._id === ownProps.id);
   }
   return { currentUser: state.currentUser, updatedVote };
};
export default connect(
   mapStateToProps,
   { updateVote }
)(Vote);

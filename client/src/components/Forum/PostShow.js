import React from 'react';
import { connect } from 'react-redux';
import { fetchPost } from '../../actions';
import MainPost from './MainPost';

class PostShow extends React.Component {
   componentDidMount() {
      this.props.fetchPost(this.props.match.params.id);
   }
   renderReplies = () => {
      //    this.props.replies.map(reply=> return <div>I am a reply!</div>)
   };
   render() {
      console.log(this.props.post);
      return (
         <div>
            POST
            <MainPost data={this.props.post} />
            {this.renderReplies()}
         </div>
      );
   }
}
const mapStateToProps = state => {
   return { post: state.post };
};

export default connect(
   mapStateToProps,
   { fetchPost }
)(PostShow);

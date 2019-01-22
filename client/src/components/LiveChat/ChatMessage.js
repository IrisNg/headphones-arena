import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { selectHeadphone } from '../../actions';

class ChatMessage extends React.Component {
   state = {
      tags: null
   };

   componentDidUpdate() {
      if (this.props.headphoneNamesWithRegex && !this.state.tags) {
         //Automatically identify any mention of headphone names in the chat message and turn it into a clickable tag
         //When user clicks on this tag, this headphone will be added into the list of selected headphones for detailed comparison at the /arena page
         var allTags = [];
         this.props.headphoneNamesWithRegex.forEach(headphone => {
            var match = headphone.regex.exec(this.props.message.message);
            if (match) {
               allTags.push({
                  term: match[0],
                  entry: { ...headphone.entry }
               });
            }
         });
         this.setState({ tags: allTags });
      }
   }

   renderTags = () => {
      return this.state.tags.map(tag => {
         return (
            //Add this headphone in the tag into the list of selected headphones when user clicks it
            <div key={tag.term} onClick={() => this.props.selectHeadphone(tag.entry)}>
               {tag.term}
            </div>
         );
      });
   };
   render() {
      const {
         message: { author, message, created }
      } = this.props;
      return (
         <div>
            {/* Author */}
            <h6>{author}</h6>
            {/* Message */}
            <div>{message}</div>
            {/* Tags of headphones mentioned in the message */}
            {this.state.tags ? this.renderTags() : null}
            {/* Date */}
            <Moment fromNow>{created}</Moment>
         </div>
      );
   }
}

export default connect(
   null,
   { selectHeadphone }
)(ChatMessage);

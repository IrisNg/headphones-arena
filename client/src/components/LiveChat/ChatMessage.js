import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import history from '../../history';
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
            <div  className="chat-message__tag" key={tag.term} onClick={() => this.props.selectHeadphone(tag.entry)}>
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
         <div className="chat-message">
            {/* Author */}
            <h6
               className="chat-message__author"
               onClick={() => (author.id ? history.push(`/user/${author.id}`) : null)}
            >
               {author.username}
            </h6>
            {/* Date */}
            <Moment fromNow className="chat-message__date">
               {created}
            </Moment>
            {/* Message */}
            <div className="chat-message__message">{message}</div>
            {/* Tags of headphones mentioned in the message */}
            {this.state.tags ? this.renderTags() : null}
         </div>
      );
   }
}

export default connect(
   null,
   { selectHeadphone }
)(ChatMessage);

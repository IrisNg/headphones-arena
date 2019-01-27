import React from 'react';

const renderRatings = headphone => {
   if (headphone.ratings.length > 0) {
      var average =
         headphone.ratings.reduce((acc, curr) => {
            return acc + curr.rating;
         }, 0) / headphone.ratings.length;
      return (average * 2).toFixed(1) + '/10';
   }
   return 'no ratings';
};

const renderTags = headphone => {
   //Find the top 9 most chosen tags for this selected headphone
   if (headphone) {
      //Make a new array by extracting all tags from each tag entry
      var allTags = headphone.tags.reduce((array, currentEntry) => {
         return [...array, ...currentEntry.tags];
      }, []);
      //Make an array containing only unique tags
      var uniqueTags = allTags.reduce((array, currentTag) => {
         if (!array.includes(currentTag)) {
            return [...array, currentTag];
         }
         return array;
      }, []);
      //Find out the number of times each tag appears
      var sortedTags = uniqueTags.map(uniqueTag => {
         return { tagName: uniqueTag, count: allTags.filter(tag => tag === uniqueTag).length };
      });
      //Sort tags in descending frequency - tags that appear the most come first
      sortedTags.sort((a, b) => b.count - a.count);
      //Only want the top 9 most chosen tags
      var topTags = sortedTags.slice(0, 9);
      //Render the top 9 most chosen tags for this selected headphone
      return topTags.map(tag => <span key={tag.tagName}>{tag.tagName}</span>);
   }
};

const Overview = ({ headphone }) => {
   return (
      <div>
         {/* User ratings */}
         <div>{renderRatings(headphone)}</div>
         {/* Amazon Button */}
         <div className="selected-headphone__amazon" onClick={() => window.open(headphone.amazonLink)}>
            <i className="fab fa-amazon" />
            {headphone.price}
         </div>
         {/* Tags - Render the top 9 most chosen tags for this selected headphone */}
         <div>{renderTags(headphone)}</div>
         {/* Offical Description */}
         <p>{headphone.officialDescription}</p>
      </div>
   );
};

export default Overview;

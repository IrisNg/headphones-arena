import React from 'react';

const renderTags = headphone => {
   if (!headphone) {
      return null;
   }
   //Find the top 9 most chosen tags for this selected headphone
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
   return topTags.map(tag => {
      if (tag.tagName.length > 25) {
         return (
            <div className="overview__tag--span-div">
               <span key={tag.tagName} className="overview__tag--span">
                  {tag.tagName}
               </span>
            </div>
         );
      }
      return (
         <div key={tag.tagName} className="overview__tag--div">
            {tag.tagName}
         </div>
      );
   });
};

const Overview = ({ headphone }) => {
   return (
      <div className="overview">
         {/* Tags */}
         <div className={headphone.tags.length > 0 ? 'overview__tags' : ''}>{renderTags(headphone)}</div>
         {/* Offical Description */}
         <p className="overview__description">{headphone.officialDescription}</p>
      </div>
   );
};

export default Overview;

import React from 'react';

const Specification = ({ headphone: { specification } }) => {
   return (
      <div className="specification">
         {/* Specifications */}

         <div>Impedance</div>
         <div>{specification.impedance}</div>

         <div>Connector</div>
         <div>{specification.connector}</div>

         <div>Portability</div>
         <div>{specification.portability}</div>

         <div>Color</div>
         <div>{specification.color}</div>

         <div>Cable</div>
         <div>{specification.cable}</div>

         <div>Driver</div>
         <div>{specification.driver}</div>

         <div>Sensitivity</div>
         <div>{specification.sensitivity}</div>

         <div>Frequency Response</div>
         <div>{specification.frequencyResponse}</div>

         <div>Classification</div>
         <div>{specification.classification}</div>

         <div>Maximum Power</div>
         <div>{specification.maximumPower}</div>

         <div>Weight</div>
         <div>{specification.weight}</div>

         <div>Included In The Box</div>
         <div>{specification.inTheBox}</div>
      </div>
   );
};

export default Specification;

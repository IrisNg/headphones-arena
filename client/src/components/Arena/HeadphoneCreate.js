import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addGlobalError } from '../../actions';

import history from '../../history';
import './HeadphoneCreate.css';

class HeadphoneCreate extends React.Component {
   state = {
      brand: '',
      model: '',
      officialDescription: '',
      impedance: '',
      connector: '',
      portability: '',
      color: '',
      cable: '',
      driver: '',
      sensitivity: '',
      frequencyResponse: '',
      classification: '',
      maximumPower: '',
      weight: '',
      inTheBox: '',
      image: '',
      amazonLink: '',
      price: ''
   };

   onFormSubmit = event => {
      event.preventDefault();
      //Post form to server
      this.postToServer();
   };

   postToServer = async () => {
      //Format object to be posted to the server
      var {
         brand,
         model,
         officialDescription,
         impedance,
         connector,
         portability,
         color,
         cable,
         driver,
         sensitivity,
         frequencyResponse,
         classification,
         maximumPower,
         weight,
         inTheBox,
         image,
         amazonLink,
         price
      } = this.state;
      const postObj = {
         brand,
         model,
         brandAndModel: `${brand} ${model}`,
         officialDescription,
         specification: {
            impedance,
            connector,
            portability,
            color,
            cable,
            driver,
            sensitivity,
            frequencyResponse,
            classification,
            maximumPower,
            weight,
            inTheBox
         },
         image,
         amazonLink,
         price
      };
      try {
         const response = await axios.post('/headphones', postObj);
         console.log(response);
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   //This function maps every input field(State keys) we have into JSX - so that we don't have to do it one by one
   //Not sure about the performance though...
   mapStateKeysToJSX() {
      var allInputs = [];
      for (var key in this.state) {
         if (key !== 'officialDescription') {
            allInputs.push(
               <div key={key}>
                  <label>{key}</label>
                  <input
                     type="text"
                     name={key}
                     value={this.state[key]}
                     onChange={e => this.setState({ [e.target.name]: e.target.value })}
                  />
               </div>
            );
         } else {
            allInputs.push(
               <div key={key}>
                  <label>{key}</label>
                  <textarea
                     name={key}
                     value={this.state[key]}
                     onChange={e => this.setState({ [e.target.name]: e.target.value })}
                  />
                  />
               </div>
            );
         }
      }
      return allInputs;
   }

   render() {
      return (
         <div className="headphone-create">
            <h1>New Headphone Creation Form</h1>
            <button onClick={() => history.push('/headphones/edit')}>Edit</button>
            <form onSubmit={this.onFormSubmit}>
               {/* All the input fields */}
               {this.mapStateKeysToJSX()}
               {/* Submit button */}
               <input type="submit" />
            </form>
         </div>
      );
   }
}

export default connect(
   null,
   { addGlobalError }
)(HeadphoneCreate);

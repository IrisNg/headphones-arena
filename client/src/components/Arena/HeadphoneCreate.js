import React from 'react';
import axios from 'axios';
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
      const postObj = {
         brand: this.state.brand,
         model: this.state.model,
         brandAndModel: `${this.state.brand} ${this.state.model}`,
         officialDescription: this.state.officialDescription,
         specification: {
            impedance: this.state.impedance,
            connector: this.state.connector,
            portability: this.state.portability,
            color: this.state.color,
            cable: this.state.cable,
            driver: this.state.driver,
            sensitivity: this.state.sensitivity,
            frequencyResponse: this.state.frequencyResponse,
            classification: this.state.classification,
            maximumPower: this.state.maximumPower,
            weight: this.state.weight,
            inTheBox: this.state.inTheBox
         },
         image: this.state.image,
         amazonLink: this.state.amazonLink,
         price: this.state.price
      };
      const response = await axios.post('/headphones', postObj);
      console.log(response);
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

export default HeadphoneCreate;

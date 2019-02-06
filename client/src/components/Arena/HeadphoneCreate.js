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
      const {
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
               <div key={key} className="headphone-create__field">
                  <label className="headphone-create__label">{key.toUpperCase()}</label>
                  <input
                     className="headphone-create__input"
                     type="text"
                     name={key}
                     value={this.state[key]}
                     onChange={e => this.setState({ [e.target.name]: e.target.value })}
                  />
                  <div className="headphone-create__full-stop" />
               </div>
            );
         } else {
            allInputs.push(
               <div key={key} className="headphone-create__field">
                  <label className="headphone-create__label">{key.toUpperCase()}</label>
                  <textarea
                     className="headphone-create__input"
                     name={key}
                     value={this.state[key]}
                     onChange={e => this.setState({ [e.target.name]: e.target.value })}
                  />
                  <div className="headphone-create__full-stop" />
               </div>
            );
         }
      }
      return allInputs;
   }

   render() {
      return (
         <div className="headphone-create">
            <div className="headphone-create__background" />
            <div className="headphone-create__content">
               <h1 className="headphone-create__page-name">CREATE A NEW HEADPHONE</h1>
               <form>
                  <div className="headphone-create__buttons">
                     {/* Edit button */}
                     <div className="headphone-create__edit-button" onClick={() => history.push('/edit-headphone')}>
                        EDIT
                     </div>
                     {/* Submit button */}
                     <div className="headphone-create__submit-button" onClick={this.onFormSubmit}>
                        UPLOAD HEADPHONE
                     </div>
                  </div>

                  {/* All the input fields */}
                  {this.mapStateKeysToJSX()}
               </form>
            </div>
         </div>
      );
   }
}

export default connect(
   null,
   { addGlobalError }
)(HeadphoneCreate);

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchListOfHeadphones, addGlobalError } from '../../actions';
import HeadphoneDelete from './HeadphoneDelete';
import './HeadphoneEdit.css';

class HeadphoneEdit extends React.Component {
   state = {
      _id: '',
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
   //Fetch the name list of all headphones
   componentDidMount() {
      this.props.fetchListOfHeadphones();
   }
   //Render a list of existing headphones' names to select which headphone needs updating
   renderExistingNames() {
      return this.props.listOfHeadphones.map(headphone => (
         <span
            key={headphone._id}
            className="headphone-edit__existing-name"
            onClick={() => this.fetchHeadphoneEntry(headphone._id)}
         >
            {headphone.brandAndModel}
         </span>
      ));
   }
   //Fetch the full headphone entry based on the headphone name clicked
   fetchHeadphoneEntry = async id => {
      try {
         const response = await axios.get(`/headphones/${id}`);
         //Destructuring from fetched entry
         const {
            _id,
            brand,
            model,
            image,
            officialDescription,
            amazonLink,
            price,
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
            }
         } = response.data;
         //Update state with the existing headphone data
         this.setState({
            _id,
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
         });
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };
   //This function maps every input field(State keys) we have into JSX - so that we don't have to do it one by one
   //Not sure about the performance though...
   mapStateKeysToJSX() {
      var allInputs = [];
      for (var key in this.state) {
         if (key !== '_id') {
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
                  </div>
               );
            }
         }
      }
      return allInputs;
   }
   onFormSubmit = event => {
      event.preventDefault();
      //Update form to database
      this.updateDatabase();
   };

   updateDatabase = async () => {
      //Format object to be updated to the database
      const updateObj = {
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
      //Update form to database
      try {
         const response = await axios.put(`/headphones/${this.state._id}`, updateObj);
         console.log(response.data);
      } catch (err) {
         this.props.addGlobalError(err.response.data);
      }
   };

   render() {
      return (
         <div className="headphone-edit">
            <h1>Headphone Edit Form</h1>
            {/* List of Existing Headphones */}
            <div>{this.props.listOfHeadphones.length > 0 ? this.renderExistingNames() : null}</div>
            <form onSubmit={this.onFormSubmit}>
               {/* All the input fields */}
               {this.mapStateKeysToJSX()}
               {/* Submit button */}
               <input type="submit" />
               {this.state._id ? <HeadphoneDelete id={this.state._id} /> : null}
            </form>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return { listOfHeadphones: state.listOfHeadphones };
};

export default connect(
   mapStateToProps,
   { fetchListOfHeadphones, addGlobalError }
)(HeadphoneEdit);

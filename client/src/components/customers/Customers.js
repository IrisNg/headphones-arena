import React from 'react';
import './Customers.css';

class Customers extends React.Component {
    state = { customers: "" };

    componentDidMount() {
       
        fetch('/api/customers')
          
            .then( res => res.json() )
               
                .then( customers => this.setState(
                    { customers: customers },
                    () => console.log('Customers fetched...', customers) 
                ));
    }
    
    render() {
        return (
            <div>
                <h2>Customers</h2>
                <ul>
                    <li>{this.state.customers}</li>
                </ul>
            </div>
        );
    }
}

export default Customers;
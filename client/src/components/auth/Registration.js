import React, { Component} from 'react';
import axios from 'axios';

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            admin: null,
            organization_id: null,
            registrationErrors: " "
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState( {
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        const {
            name,
            email,
            password,
            password_confirmation,
            admin,
            organization_id
        } = this.state;

        axios.post("http://172.16.1.100:3000/api/v1/registrations", {
            user: {
                name: name,
                email: email,
                password: password,
                password_confirmation: password_confirmation,
                admin: admin,
                organization_id: organization_id
            }
        },
        { withCredentials: true } 
        )
        .then(response => {
            if (response.data.status === 'created')
            this.props.handleSuccesfulAuth(response.data)
            else
            console.log("Update registrationError State")
        })
        .catch(error => {
            console.log("registration error", error);
        })
        event.preventDefault();
    }
    render() {
        const organizationData = this.props.organizationData
        const orgList = organizationData.map( (x) => <option key={x.id} value={x.id}>{x.name}</option> )
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input 
                    type="name" 
                    name="name" 
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleChange} 
                    required 
                    />

                    <input 
                    type="email" 
                    name="email" 
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange} 
                    required 
                    />
                    
                    <input 
                    type="password" 
                    name="password" 
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange} 
                    required 
                    />

                    <input 
                    type="password" 
                    name="password_confirmation" 
                    placeholder="Password Confirmation"
                    value={this.state.password_confirmation}
                    onChange={this.handleChange} 
                    required 
                    />

                    <select onChange={this.handleChange} name="organization_id">
                        {orgList}
                    </select>

                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }
}
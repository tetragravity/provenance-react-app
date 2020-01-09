import React, { Component } from 'react';
import axios from 'axios';
import Registration from './auth/Registration';
import Login from './auth/Login';
// import { throws } from 'assert';

export default class Home extends Component {
    constructor(props){
        super();
        
        this.handleSuccesfulAuth = this.handleSuccesfulAuth.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }
    handleSuccesfulAuth(data){
        this.props.handleLogin(data);
        this.props.history.push("/dashboard");
    }
    handleLogoutClick(){
        axios.delete('http://172.16.1.100:3000/api/v1/logout', {withCredentials: true})
        .then(response => {
            this.props.handleLogout(); 
        })
        .catch(error => {
            console.log("logout error", error);
        })
        
    }
    
    render() {
        return (
            <div>
                <h1>Home</h1>
                <h1>Status: {this.props.loggedInStatus}</h1>
                <button 
                onClick={() => this.handleLogoutClick()}>Logout</button>
                <Registration 
                handleSuccesfulAuth={this.handleSuccesfulAuth}
                organizationData={this.props.organizationData} />
                <Login handleSuccesfulAuth={this.handleSuccesfulAuth} />
            </div>
        )
    };
}
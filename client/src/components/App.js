import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Home from "./Home";
import Dashboard from "./Dashboard";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      organizationData: null,
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  checkLoginStatus(){
    axios.get('http://172.16.1.100:3000/api/v1/logged_in', {withCredentials: true})
    .then(response => {
      if(response.data.logged_in && this.state.loggedInStatus === "NOT_LOGGED_IN"){
        this.setState({
          loggedInStatus: "LOGGED_IN",
          user: response.data.user
        })
      }
      else if( !response.data.logged_in & this.state.loggedInStatus === "LOGGED_IN"){
        this.setState({
          loggedInStatus: "NOT_LOGGED_IN",
          user: {}
        })
      }
    })
    .catch(error =>{
      console.log("check login error", error)
    } )
  }

  getOrganizations(){
    fetch('http://172.16.1.100:3000/api/v1/organizations', {withCredentials: true})
    .then(results => { return results.json(); })
    .then(data => this.setState({organizationData: data}))
  }
  componentDidMount(){
    this.checkLoginStatus();
    this.getOrganizations();
  }
  handleLogout(){
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    })
  }

  handleLogin(data){
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data.user
    })
  }
  render() {
    if (this.state.organizationData === null) {
      return <div>Loading ...</div>;
    }
    return (
      <div className='app'>
        <BrowserRouter>
          <Switch>
            <Route 
            exact 
            path={"/"} 
            render={props => (
              <Home 
              { ...props} 
              handleLogin={this.handleLogin} 
              handleLogout={this.handleLogout}
              loggedInStatus={this.state.loggedInStatus}
              organizationData={this.state.organizationData} />
            )} />
            <Route 
            exact 
            path={"/dashboard"}
            render={props => (
              <Dashboard { ...props} 
              loggedInStatus={this.state.loggedInStatus} />
            )} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

import React, { Component } from "react";
import ContentTrackingContract from "./contracts/ContentTracking.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {document: " ",storageValue: 0,
       messageChecked: null, web3: null, hashedMessage: null, 
       accounts: null, contract: null};

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContentTrackingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ContentTrackingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance } );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange(event) {
    this.setState({document: event.target.value});
  }

  //This method posts a new document and hashes it onto the blockchain
  //This method should also store the hashed message in a state variable to be stored in DB later
  postHashedDocument = async (event) => {
    event.preventDefault();
    const { accounts, contract, document } = this.state;
    alert('A Document was submitted: ' + document);
  
    //Invoking set method in content tracking contract to post document to blockchain
    await contract.methods.storeDocument(document).send({ from: accounts[0] });

    //Method to set hashed document as a state variable
    const hashResponse = await contract.methods.returnHashedDocument(document).call();
    this.setState( { hashedMessage: hashResponse } );

    //Method to post document and hashed document to API as well as user ID
  }

  //This method takes in a new document to check if it already exists on the blockchain
  //Should return True/False
  checkNewDocument = async (event) => {
    event.preventDefault();
    const { contract, document } = this.state;
    //Invoking check method in content tracking contract
    const response = await contract.methods.newDocument(document).call();
    alert(response.toUpperCase());
    //Update state with the result.
    this.setState( { messageChecked: response } );

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <p>

          </p>

        </div>
        <form onSubmit={this.postHashedDocument}>
          <label>
            Post a Document to Blockchain: 
            <input type="text" placeholder="Post Document" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <form onSubmit={this.checkNewDocument}>
          <label>
            Check if a Document is on the Blockchain: 
            <input type="text" placeholder="Check Document" value={this.state.document} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;

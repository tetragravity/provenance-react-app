var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ContentTracking = artifacts.require("./ContentTracking.sol")

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ContentTracking);
};

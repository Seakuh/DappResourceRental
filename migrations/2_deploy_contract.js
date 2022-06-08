var Election = artifacts.require("./Election.sol");
var ResourceRental = artifacts.require("./ResourceRental.sol");

module.exports = function (deployer) {
  deployer.deploy(Election);
  deployer.deploy(ResourceRental);
};

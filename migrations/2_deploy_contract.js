var Election = artifacts.require("./Election.sol");
var ResourceRental = artifacts.require("./ResourceRental.sol");
var TrainingValidate = artifacts.require("./TrainingValidate.sol");

module.exports = function (deployer) {
  deployer.deploy(Election);
  deployer.deploy(TrainingValidate);
  deployer.deploy(ResourceRental);
};

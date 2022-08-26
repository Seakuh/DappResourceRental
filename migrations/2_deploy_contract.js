var Election = artifacts.require("./Election.sol");
var ResourceRental = artifacts.require("./ResourceRental.sol");
var TrainingValidate = artifacts.require("./TrainingValidate.sol");
var SafetyBriefing = artifacts.require("./SafetyBriefing.sol");

module.exports = function (deployer) {
  deployer.deploy(Election);
  deployer.deploy(TrainingValidate);
  deployer.deploy(ResourceRental);
  deployer.deploy(SafetyBriefing);
};

var ResourceRental = artifacts.require("./ResourceRental.sol");
var SafetyBriefing = artifacts.require("./SafetyBriefing.sol");

contract("ResourceRental", function (accounts) {
  it("initializes with two renters", function () {
    return ResourceRental.deployed()
      .then(function (instance) {
        return instance.rentersCount();
      })
      .then(function (count) {
        assert.equal(count, 2);
      });
  });

  it("it initializes the renters with the correct values", function () {
    return ResourceRental.deployed()
      .then(function (instance) {
        resourceRentalInstance = instance;
        return resourceRentalInstance.renters(1);
      })
      .then(function (renter) {
        assert.equal(renter[0], 1, "contains the correct id");
        assert.equal(renter[1], "Student 1", "contains the correct name");
        assert.equal(renter[2], 0, "contains the correct renters count");
        return resourceRentalInstance.renters(2);
      })
      .then(function (renter) {
        assert.equal(renter[0], 2, "contains the correct id");
        assert.equal(renter[1], "Professor 1", "contains the correct name");
        assert.equal(renter[2], 0, "contains the correct renters count");
      });
  });

  it("should add a resource", function () {
    return ResourceRental.deployed()
      .then(function (instance) {
        resourceRentalInstance = instance;
        resourceRentalInstance.addResource(
          "Concert Hall",
          "images/room1.jpeg",
          "Mannheim, Germani",
          "1654782938174",
          "1655992478797",
          1,
          { from: accounts[1] }
        );
        return instance.resourcesCount;
      })
      .then(function (resourceCount) {
        assert.equal(resourceCount, 1, "Counter increases");
      });
  });

  it("should create a safetyBriefing", function () {
    return SafetyBriefing.deployed()
      .then(function (instance) {
        safetyBriefingInstance = instance;
        safetyBriefingInstance.createBriefing({ from: accounts[1] });
        return instance.briefingsCount;
      })
      .then(function (briefingsCount) {
        assert.equal(briefingsCount, 1, "Counter increases");
      });
  });
});

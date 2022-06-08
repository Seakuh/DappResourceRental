var ResourceRental = artifacts.require("./ResourceRental.sol");

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
        assert.equal(renter[2], 0, "contains the correct votes count");
        return resourceRentalInstance.renters(2);
      })
      .then(function (renter) {
        assert.equal(renter[0], 2, "contains the correct id");
        assert.equal(renter[1], "Professor 1", "contains the correct name");
        assert.equal(renter[2], 0, "contains the correct votes count");
      });
  });
});

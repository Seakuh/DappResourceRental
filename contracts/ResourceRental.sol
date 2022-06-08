// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract ResourceRental {
    // Model a Rental
    struct Rental {
        string resourceName;
        uint256 bookingId;
        uint256 resourceId;
        uint256 startTimestamp;
        uint256 endTimestamp;
    }

    // Model a Renter
    struct Renter {
        uint256 renterId;
        string renterName;
        uint256 rentCount;
    }

    // Model a Renter

    // store renters
    // solidity generiert getter
    mapping(uint256 => Renter) public renters;

    // Store renters count
    uint256 public rentersCount;
    // Store Rental

    // Read Rental
    string public candidate;

    function addRenter(string memory _name) private {
        // represent Id of the renter
        rentersCount++;
        renters[rentersCount] = Renter(rentersCount, _name, 0);
    }

    // Store Rental -> from to free

    // Fetch Rental

    // Store Rental count

    // Constructor
    constructor() public {
        addRenter("Student 1");
        addRenter("Professor 1");
    }
}

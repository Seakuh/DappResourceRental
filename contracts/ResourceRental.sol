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

    // Model a Resource
    struct Resource {
        uint256 resourceId;
        string name;
        string picture;
        string location;
    }

    // Model a Resource Advert
    struct ResourceAdvert {
        uint256 advertId;
        uint256 resourceId;
        string fromTimeStamp;
        string toTimeStamp;
    }

    // Store renters
    // solidity generiert getter
    mapping(uint256 => Renter) public renters;
    mapping(uint256 => Resource) public resources;
    mapping(uint256 => ResourceAdvert) public resourcesAdverts;

    // Store renters count
    uint256 public rentersCount;
    uint256 public resourcesCount;
    uint256 public resourcesAdvertCount;

    // Store Rental

    // Read Rental
    string public candidate;

    function addRenter(string memory _name) private {
        // represent Id of the renter
        rentersCount++;
        renters[rentersCount] = Renter(rentersCount, _name, 0);
    }

    function addResource(
        string memory _name,
        string memory _picture,
        string memory _location
    ) private {
        // represent Id of the renter
        resourcesCount++;
        resources[resourcesCount] = Resource(
            resourcesCount,
            _name,
            _picture,
            _location
        );
    }

    function addResourceAdvert(
        uint256 _resourceId,
        string memory _fromTimeStamp,
        string memory _toTimeStamp
    ) private {
        // represent Id of the renter
        resourcesAdvertCount++;
        resourcesAdverts[resourcesAdvertCount] = ResourceAdvert(
            resourcesCount,
            _resourceId,
            _fromTimeStamp,
            _toTimeStamp
        );
    }

    // Store Rental -> from to free

    // Fetch Rental

    // Store Rental count

    // Constructor
    constructor() public {
        addRenter("Student 1");
        addRenter("Professor 1");
        addResource("Normal Room", "images/room1.jpeg", "Furtwangen, Germany");
        addResource("Concert Hall", "images/room1.jpeg", "Mannheim, Germani");
        addResource("Theater", "images/room1.jpeg", "Rom, Italy");
        addResource("Server Room", "images/room1.jpeg", "Paris, France");
        addResource("Test Room", "images/room1.jpeg", "Barcelona, Spain");
    }
}

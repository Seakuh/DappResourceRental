// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract ResourceRental {
    //----------------------------------------------------------
    // Storage
    //----------------------------------------------------------

    // Store renters
    // solidity generiert getter
    mapping(uint256 => Resource) public resources;
    mapping(address => Permission) public permissionedRenters;

    mapping(address => University) public universities;
    mapping(uint256 => Rental) public rentals;

    // Store index
    uint256 public rentersCount;
    uint256 public resourcesCount;
    uint256 public resourcesAdvertCount;
    uint256 public universitiesCount;
    uint256 public rentalsCount;

    // Store Rental

    // Read Rental
    string public candidate;

    //----------------------------------------------------------
    // Structs
    //----------------------------------------------------------

    // Model a Rental
    struct Rental {
        address renterAddress;
        string resourceName;
        uint256 bookingId;
        uint256 resourceId;
        string startTimestamp;
        string endTimestamp;
    }

    // Model a Resource
    struct Resource {
        uint256 resourceId;
        string name;
        string picture;
        string location;
        string fromTimeStamp;
        string toTimeStamp;
        Permission permission;
        // uint8[3] requiredTraining;
    }

    // Model a University
    struct University {
        uint256 universityId;
        string name;
        address universityAddress;
    }

    //----------------------------------------------------------
    // ENUM
    //----------------------------------------------------------

    // Permission for Users
    // For some Resources, the user need to have permissions
    // these permissions are given by universities
    enum Permission {
        ALL,
        STUDENT,
        SCIENTIFIC_ASSISTANT,
        PROFESSOR,
        ADMIN
    }

    //----------------------------------------------------------
    // Events
    //----------------------------------------------------------

    event RenterAdded(string _renterName, address _senderAddress);
    event ResourceCreated(uint256 _id, address _creatorAddress);
    event ResourceRented(
        address _renter,
        uint256 _resourceId,
        string _fromTimeStamp,
        string _toTimestamp,
        uint256 _rentalTimeStamp
    );
    event UniversityAdded();
    event PermissionToRenterAdded(
        uint256 permission,
        address useraddress,
        address authority
    );

    //----------------------------------------------------------
    // private Functions
    //----------------------------------------------------------

    function initializeUniversity(string memory _name, address _address)
        private
    {
        // represent Id of the University
        universitiesCount++;
        universities[msg.sender] = University(
            universitiesCount,
            _name,
            _address
        );
    }

    //----------------------------------------------------------
    // public Functions
    //----------------------------------------------------------

    function addUniversity(
        uint256 _universityId,
        string memory _name,
        address _newUniversityAddress
    ) private {
        require(msg.sender == universities[msg.sender].universityAddress);

        // represent Id of the University
        universitiesCount++;
        universities[msg.sender] = University(
            universitiesCount,
            _name,
            _newUniversityAddress
        );
    }

    function addPermissionToRenter(address renterAddress, uint256 permission)
        public
        _isUniversity
    {
        permissionedRenters[renterAddress] = Permission(permission);
        emit PermissionToRenterAdded(permission, renterAddress, msg.sender);
    }

    function addResource(
        string memory _name,
        string memory _metaDataLink,
        string memory _location,
        string memory _fromTimeStamp,
        string memory _toTimeStamp,
        Permission _permission // uint256 _universityId // uint8[] memory _requiredTraining
    ) public {
        // require();

        // represent Id of the renter
        resourcesCount++;
        resources[resourcesCount] = Resource(
            resourcesCount,
            _name,
            _metaDataLink,
            _location,
            _fromTimeStamp,
            _toTimeStamp,
            _permission
            // _requiredTraining
        );
        emit ResourceCreated(resourcesCount, msg.sender);
    }

    // making the function pure or view
    // to call it through web3.js without needing
    // a trancaction -> no gas cost, no confirmation delay
    function isSenderUniversity() public view returns (bool) {
        return msg.sender == universities[msg.sender].universityAddress;
    }

    function rentResource(uint256 _id) public {
        Resource memory resource = resources[_id];

        rentalsCount++;
        rentals[rentalsCount] = Rental(
            msg.sender,
            resource.name,
            rentalsCount,
            resource.resourceId,
            resource.fromTimeStamp,
            resource.toTimeStamp
        );

        delete resources[_id];

        emit ResourceRented(
            msg.sender,
            _id,
            resource.fromTimeStamp,
            resource.toTimeStamp,
            block.timestamp
        );
    }

    //----------------------------------------------------------
    // Modifier
    //----------------------------------------------------------

    // isUniversity
    modifier _isUniversity() {
        require(
            msg.sender == universities[msg.sender].universityAddress,
            "Caller is no university"
        );
        _;
    }

    modifier _hasPermission(Permission permission) {
        require(
            permissionedRenters[msg.sender] >= permission,
            "Caller is no eligible"
        );
        _;
    }

    //----------------------------------------------------------
    // Constructor
    //----------------------------------------------------------

    // Constructor
    constructor() public {
        // add example renters
        // addRenter("Student 1");
        // addRenter("Professor 1");

        // add example resources
        addResource(
            "Normal Room",
            "images/room1.jpeg",
            "Furtwangen, Germany",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );

        addResource(
            "Concert Hall",
            "images/room1.jpeg",
            "Mannheim, Germani",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );
        addResource(
            "Theater",
            "images/room1.jpeg",
            "Rom, Italy",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );
        addResource(
            "Server Room",
            "images/room1.jpeg",
            "Paris, France",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );
        addResource(
            "Test Room",
            "images/room1.jpeg",
            "Barcelona, Spain",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );
        addResource(
            "Schulungszentrum Darmstadt",
            "https://www.schulungszentrum-darmstadt.de/wp-content/uploads/2019/09/DSC1868.jpg",
            "Darmstadt, Germany",
            "1654782938174",
            "1655992478797",
            Permission.ALL
        );

        // add universities who are allowed to create resrouces
        // addUniversity(
        //     "Hochschule Furtwangen",
        //     0x9BB542Fa2BBC47dF6d5Da1F38dc78a186EA89CaB
        // );
        initializeUniversity(
            "Universität Mannheim",
            0xDeDE610A052Cd63D055B1e957b1952525d924F7e
        );
        // addUniversity("TUM", 0xA5f4A3aa3cFAA342FC401580aE6Af12Ab56EA822);
        // addUniversity(
        // "The Hague University of Applied Sciences",
        // 0xE82971C4A32C82556F072C73125e48C4c9c33a59
        // );
    }
}

// Template
// from truffle example https://github.com/truffle-box/pet-shop-box

var resourceRentalContract;
var accountAddress;
var currentAddress;

//-------------------------------------------------------

// Address of the Bloxberg Contract
const bloxbergContractAddress =
  "0x9aa655d59a6ba1663c1520fb79e1b5fcf55f1c35ab46f29ebdb1b4bee0ccf3fc";

//-------------------------------------------------------

// App Object with basic infromation
App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  // first entry function when entering the application
  init: function () {
    return App.initWeb3();
  },

  // init connection to local Blockchain
  initWeb3: async function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      currentAddress = web3.currentProvider.selectedAddress;

      $.getJSON("ResourceRental.json", function (ResourceRentalBloxberg) {
        // const networkId = web3.eth.net.getId().then();
        // const instance = new web3.eth.Contract();
      }),
        App.showUserAddress(currentAddress);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:5745"
      );
      // use the web3 Provider
      web3 = new Web3(App.web3Provider);
      App.showUserAddress(currentAddress);
    }
    return App.initContract();
  },

  // Display the user address on the account address attribute
  showUserAddress: function (address) {
    accountAddress = address;
    var loaderAddress = $("#loaderAddress");
    // show hint if the user is not conneced to metamask
    if (!address) {
      address = "login to Metamask";
    }
    // hide loader and show the account address
    loaderAddress.hide();
    return $("#accountAddress").html("Your Account: " + address);
  },

  // Load up contract into Fronted application
  // to interact with it
  initContract: function () {
    $.getJSON("ResourceRental.json", function (resource) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ResourceRental = TruffleContract(resource);
      // Connect provider to interact with contract
      App.contracts.ResourceRental.setProvider(App.web3Provider);

      return App.initTrainingValidateContract();
    });
  },

  // init savetybriefing contract
  // wip
  initTrainingValidateContract: function () {
    $.getJSON("TrainingValidate.json", function (resource) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.TrainingContract = TruffleContract(resource);
      // Connect provider to interact with contract
      App.contracts.TrainingContract.setProvider(App.web3Provider);

      App.contracts.TrainingContract.deployed().then(function (instance) {
        console.log(instance);
      });

      return App.listenForEvents();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.ResourceRental.deployed().then(function (instance) {
      App.render();
    });
  },

  render: function () {
    var resourceContractInstance;
    var loader = $("#loader");
    var content = $("#content");

    App.renderUserReantals();
    loader.show();
    content.hide();

    // Load contract data
    App.contracts.ResourceRental.deployed()
      .then(function (instance) {
        // check is user a university with blockchain call isSenderUniversity
        var isUniversity = instance.isSenderUniversity(1);
        var createAdvert = $("#create-advert");
        createAdvert.hide();

        if (isUniversity) {
          createAdvert.show();
        }
        return instance;
      })
      .then(function (instance) {
        resourceRentalContract = instance;
        resourceContractInstance = instance;
        return resourceContractInstance.resourcesCount();
      })
      .then(function (resourcesCount) {
        // loop over ressources and fill html template with ressources attributes
        // append them to html file
        for (var i = 1; i <= resourcesCount; i++) {
          resourceContractInstance.resources(i).then(function (resource) {
            if (!resource[1]) {
              return;
            }
            var id = resource[0];
            var name = resource[1];
            var picture = resource[2];
            var location = resource[3];
            var fromTimeStamp = resource[4];
            var toTimeStamp = resource[5];

            var fromDateFormatted = new Date(fromTimeStamp * 1);
            var toDateFormatted = new Date(toTimeStamp * 1);

            var resourcesRow = $("#resourcesRow");
            var resourceTemplate = $("#resourceTemplate");
            resourceTemplate.find(".panel-title").text(name);
            resourceTemplate.find("img").attr("src", picture);
            resourceTemplate.find(".resource-location").text(location);
            resourceTemplate.find(".resource-fromTime").text(fromDateFormatted);
            resourceTemplate.find(".resource-toTime").text(toDateFormatted);

            resourceTemplate.find(".btn-rent").attr("data-id", id);

            resourcesRow.append(resourceTemplate.html());
          });
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  bindEvents: function () {
    $(document).on("click", ".btn-rent", App.handlerent);
  },

  // Fetch Events from local storage
  // and show rental relevant event information on the application
  renderUserReantals: function () {
    var events = JSON.parse(localStorage.getItem("UserRentals")) || [];
    // get row from html file to append them later
    var resourcesRow = $("#userRentalsRow");
    // get tamplate from html file to fill it with event content
    var resourceTemplate = $("#userRentalsTemplate");

    if (events) {
      for (var i = 1; i <= events.length; i++) {
        var tx = events[i - 1].tx;
        console.log(events[i - 1].logs);
        const { _fromTimeStamp, _toTimestamp, _resourceId, _renter } =
          events[i - 1].logs[0].args;
        console.log(events[i - 1].logs);

        console.log(typeof _toTimestamp);
        resourceTemplate.find(".event-transaction-number").text(tx);
        resourceTemplate.find(".event-renter-number").text(_renter);

        // convert _fromTimeStamp to date and show it on the screen
        resourceTemplate
          .find(".from-rent-timestamp")
          .text(() => new Date(parseInt(_fromTimeStamp)));
        resourceTemplate
          .find(".to-rent-timestamp")
          .text(() => new Date(parseInt(_toTimestamp)));
        resourcesRow.append(resourceTemplate.html());
      }
    }
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

// User Interaction Functions ----------------------------------------------------------------

function createAdvert() {
  var name = document.getElementById("resourceName").value;
  var imagePath = document.getElementById("resourceImage").value;
  var location = document.getElementById("resourceLocation").value;

  var fromTimeStamp = document.getElementById("fromTimeStamp").value;
  var toTimeStamp = document.getElementById("toTimeStamp").value;

  var convertedFromTimeStamp = convertToTimeStamp(fromTimeStamp);
  var convertedToTimeStamp = convertToTimeStamp(toTimeStamp);

  var permission = document.getElementById("permission");
  var permissionText = permission.options[permission.selectedIndex].text;

  // Enum representation of the Smart Contract Permission enum
  const permissionObject = Object.freeze({
    ALL: 1,
    STUDENT: 2,
    SCIENTIFIC_ASSISTANT: 3,
    PROFESSOR: 4,
    ADMIN: 5,
  });

  var requiredBreifinfAddresses = document.getElementById(
    "requiredBreifinfAddresses"
  ).value;

  console.log(requiredBreifinfAddresses);

  // set default image path if no image path is provided from the user
  if (!imagePath) {
    imagePath =
      "https://cdn.prod.www.spiegel.de/images/6bbd78cd-0001-0004-0000-000001454027_w1600_r1.4790419161676647_fpx33.81_fpy50.jpg";
  }

  // Test function with truffle develop
  // truffle(develop)> ResourceRental.deployed().then(function(i) {app = i})
  // let instance = await ResourceRental.deployed()
  // app.addResource("MesseZentrum","Essen","Munich","1654782938174","1655992478797")
  App.contracts.ResourceRental.deployed().then(function (instance) {
    return instance.addResource(
      name,
      imagePath,
      location,
      convertedFromTimeStamp.toString(),
      convertedToTimeStamp.toString(),
      permissionObject[permissionText],
      { from: currentAddress }
    );
  });
}

function rentResource(id) {
  App.contracts.ResourceRental.deployed().then(function (instance) {
    return instance
      .rentResource(id, { from: currentAddress })
      .then(function (event) {
        saveEventToLocalStorage(event);
      });
  });
}

// Test function to interact with savetyBriefing Contract from the resourceRental contract
function sayHello() {
  App.contracts.ResourceRental.deployed().then(function (instance) {
    return instance
      .callSafetyBriefing({ from: currentAddress })
      .then(function (event) {
        console.log(event);
      });
  });
}

// save the event to the local storage of the user
function saveEventToLocalStorage(event) {
  var oldEvents = JSON.parse(localStorage.getItem("UserRentals")) || [];

  oldEvents.push(event);

  localStorage.setItem("UserRentals", JSON.stringify(oldEvents));
}

// Date format functions
function convertToDateFormat(timestamp) {
  var date = new Date(timestamp);
  return date;
}

function convertToTimeStamp(timeStamp) {
  const dateObject = new Date(timeStamp);
  var date = dateObject.getTime();
  return date;
}

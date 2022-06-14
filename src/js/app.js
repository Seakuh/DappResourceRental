// Template
// from truffle example https://github.com/truffle-box/pet-shop-box
var resourceRentalContract;
var accountAddress;
var currentAddress;
App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function () {
    return App.initResources();
  },

  initResources: async function () {
    // Load resources.
    // $.getJSON("../resources.json", function (data) {
    //   var resourcesRow = $("#resourcesRow");
    //   var resourceTemplate = $("#resourceTemplate");

    //   for (i = 0; i < data.length; i++) {
    //     resourceTemplate.find(".panel-title").text(data[i].name);
    //     resourceTemplate.find("img").attr("src", data[i].picture);
    //     resourceTemplate.find(".resource-breed").text(data[i].breed);
    //     resourceTemplate.find(".resource-age").text(data[i].age);
    //     resourceTemplate.find(".resource-location").text(data[i].location);
    //     resourceTemplate.find(".btn-rent").attr("data-id", data[i].id);

    //     resourcesRow.append(resourceTemplate.html());
    //   }
    // });

    return await App.initWeb3();
  },

  // init connection to local Blockchain
  initWeb3: async function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      currentAddress = web3.currentProvider.selectedAddress;
      App.showUserAddress(currentAddress);

      window.ethereum.enable().catch((error) => {
        // User denied account access
        console.log(error);
      });
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
      console.log("Address" + window.web3.currentProvider.selectedAddress);
      App.showUserAddress(currentAddress);
    }
    return App.initContract();
  },

  showUserAddress: function (address) {
    console.log(address);
    accountAddress = address;
    var loaderAddress = $("#loaderAddress");
    loaderAddress.hide();
    return $("#accountAddress").html("Your Account: " + address);
  },

  // Load up contract into Fronted application
  // to interact with it
  initContract: function () {
    console.log("init Contract");
    $.getJSON("ResourceRental.json", function (resource) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ResourceRental = TruffleContract(resource);
      // Connect provider to interact with contract
      App.contracts.ResourceRental.setProvider(App.web3Provider);

      console.log("init Contract...");
      return App.listenForEvents();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.ResourceRental.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      App.render();
    });
  },

  render: function () {
    var resourceContractInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // // Load account data
    // web3.eth.getCoinbase(function (err, account) {
    //   if (err === null) {
    //     App.account = account;
    //     $("#accountAddress").html("Your Account: " + account);
    //   }
    // });

    // Load contract data
    App.contracts.ResourceRental.deployed()
      .then(function (instance) {
        var isUniversity = instance.isSenderUniversity(1);
        var createAdvert = $("#create-advert");
        createAdvert.hide();

        if (isUniversity) {
          console.log("Is University");
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
        console.log(resourcesCount);
        console.log(resourceContractInstance.resourcesCount);
        var resourcesResults = $("#resroucesResults");
        // resourcesCount.empty();

        var resourcesSelect = $("#resourcesSelect");
        // resourcesCount.empty();

        console.log("ResourcesCount: " + resourcesCount);

        for (var i = 1; i <= resourcesCount; i++) {
          resourceContractInstance.resources(i).then(function (resource) {
            console.log(resource);
            if (!resource[1]) {
              return;
            }
            var id = resource[0];
            var name = resource[1];
            var picture = resource[2];
            var location = resource[3];
            var fromTimeStamp = resource[4];
            var toTimeStamp = resource[5];

            var fromDateFormatted = convertToDateFormat(fromTimeStamp);
            var toDateFormatted = convertToDateFormat(toTimeStamp);

            console.log(fromDateFormatted + toDateFormatted);

            var resourcesRow = $("#resourcesRow");
            var resourceTemplate = $("#resourceTemplate");
            resourceTemplate.find(".panel-title").text(name);
            resourceTemplate.find("img").attr("src", picture);
            resourceTemplate.find(".resource-location").text(location);
            resourceTemplate.find(".resource-fromTime").text(fromDateFormatted);
            resourceTemplate.find(".resource-toTime").text(toDateFormatted);

            resourceTemplate.find(".btn-rent").attr("data-id", id);

            resourcesRow.append(resourceTemplate.html());

            // // Render resource Result
            // var resourceTemplate =
            //   "<tr><th>" +
            //   id +
            //   "</th><td>" +
            //   name +
            //   "</td><td>" +
            //   voteCount +
            //   "</td></tr>";
            // resourcesResults.append(resourceTemplate);

            // Render resource ballot option
            // var resourceOption =
            //   "<option value='" + id + "' >" + name + "</ option>";
            // resourcesSelect.append(resourceOption);
          });
        }
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $("form").hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  bindEvents: function () {
    $(document).on("click", ".btn-rent", App.handlerent);
  },

  markrented: function () {
    /*
     * Replace me...
     */
  },

  handlerent: function (event) {
    event.preventDefault();

    var resourceId = parseInt($(event.target).data("id"));

    /*
     * Replace me...
     */
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

function createAdvert() {
  var name = document.getElementById("resourceName").value;
  var imagePath = document.getElementById("resourceImage").value;
  var location = document.getElementById("resourceLocation").value;

  var fromTimeStamp = document.getElementById("fromTimeStamp").value;
  var toTimeStamp = document.getElementById("toTimeStamp").value;

  // Test function with truffle develop
  // truffle(develop)> ResourceRental.deployed().then(function(i) {app = i})
  // let instance = await ResourceRental.deployed()
  // app.addResource("MesseZentrum","Essen","Munich","1654782938174","1655992478797")
  App.contracts.ResourceRental.deployed()
    .then(function (instance) {
      return instance.addResource(
        name,
        imagePath,
        location,
        convertToTimeStamp(fromTimeStamp),
        convertToTimeStamp(toTimeStamp),
        { from: currentAddress }
      );
    })
    .then();
}

function rentResource(id) {
  App.contracts.ResourceRental.deployed().then(function (instance) {
    // var idData = id.getAttribute("data-id");
    console.log(id);
    return instance.rentResource(id, { from: currentAddress });
  });
}

function convertToDateFormat(timestamp) {
  var date = new Date(timestamp * 1000);
  return date;
}

function convertToTimeStamp(timeStamp) {
  const dateObject = new Date(timeStamp);
  var date = dateObject.getTime();
  return date;
}

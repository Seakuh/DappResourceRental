// Template
// from truffle example https://github.com/truffle-box/pet-shop-box

App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function () {
    return App.initResources();
  },

  initResources: async function () {
    // Load resources.
    $.getJSON("../resources.json", function (data) {
      var resourcesRow = $("#resourcesRow");
      var resourceTemplate = $("#resourceTemplate");

      for (i = 0; i < data.length; i++) {
        resourceTemplate.find(".panel-title").text(data[i].name);
        resourceTemplate.find("img").attr("src", data[i].picture);
        resourceTemplate.find(".resource-breed").text(data[i].breed);
        resourceTemplate.find(".resource-age").text(data[i].age);
        resourceTemplate.find(".resource-location").text(data[i].location);
        resourceTemplate.find(".btn-rent").attr("data-id", data[i].id);

        resourcesRow.append(resourceTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  // init connection to local Blockchain
  initWeb3: async function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(window.ethereum);
      var currentAddress = web3.currentProvider.selectedAddress;
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
        resourceContractInstance = instance;
        return resourceContractInstance.resourcesCount();
      })
      .then(function (resourcesCount) {
        console.log(resourcesCount);
        console.log(resourceContractInstance.resourcesCount);
        var resourcesResults = $("#resroucesResults");
        resourcesCount.empty();

        var resourcesSelect = $("#resourcesSelect");
        resourcesCount.empty();

        console.log(resourcesCount);

        for (var i = 1; i <= resourcesCount; i++) {
          resourceContractInstance.resources(i).then(function (resource) {
            var id = resource[0];
            var name = resource[1];
            var picture = resource[2];
            var location = resource[3];

            var resourcesRow = $("#resourcesRow");
            var resourceTemplate = $("#resourceTemplate");

            for (i = 0; i < data.length; i++) {
              resourceTemplate.find(".panel-title").text(dname);
              resourceTemplate.find("img").attr("src", picture);
              resourceTemplate.find(".resource-breed").text(location);
              resourceTemplate
                .find(".resource-location")
                .text(data[i].location);
              resourceTemplate.find(".btn-rent").attr("data-id", data[i].id);

              resourcesRow.append(resourceTemplate.html());
            }

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
            var resourceOption =
              "<option value='" + id + "' >" + name + "</ option>";
            resourcesSelect.append(resourceOption);
          });
        }
        return resourceContractInstance.voters(App.account);
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

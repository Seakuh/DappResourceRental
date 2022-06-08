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

  initWeb3: async function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Resource.json", function (resource) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Resource = TruffleContract(resource);
      // Connect provider to interact with contract
      App.contracts.Resource.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.bindEvents();
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

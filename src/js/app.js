App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
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
        resourceTemplate.find(".btn-adopt").attr("data-id", data[i].id);

        resourcesRow.append(resourceTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    /*
     * Replace me...
     */

    return App.initContract();
  },

  initContract: function () {
    /*
     * Replace me...
     */

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-adopt", App.handleAdopt);
  },

  markAdopted: function () {
    /*
     * Replace me...
     */
  },

  handleAdopt: function (event) {
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

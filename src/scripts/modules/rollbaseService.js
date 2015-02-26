

(function (global) {
  var app = global.app = global.app || {};
  RollbaseService = function() {
  };
  RollbaseService.prototype = {
    init: function () {
    // init
      //console.log('Testing all...');
      //this._testAll();
    },
    login: function(username, password, success, error) {
       var data = { 
          "loginName" : username , 
          "password" : password,
          "custId"   : app.config.rollbase.custId
      };
    
      var method = 'login?' + $.param(data);

      $.get(app.config.rollbase.baseUrl + method , function(data){
          alert(data);
      });
    },

    getListItems: function(listName, success, error) {
    },

    getListItemById: function(listname, id, success, error) {
    },

    updateListItem: function(listname, etag, id, data, success, error) {
    },

    createListItem: function(listname, data, success, error) {
    },

    copy: function (buffer) {

    },

    attachPictureToListItem: function(listname, id , imageURI, success, error) {
    },

    getAttachmentByListItemId: function(listname, id, success, error) {

    },

    getUserId: function(userName, success, error) {

    },

    getUserGroups: function(userId, success, error) {

    }
  };
  app.rollbaseService = new RollbaseService();

})(window);

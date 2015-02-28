(function (global) {
  var app = global.app = global.app || {};
  RollbaseService = function() {
  };
  RollbaseService.prototype = {
    init: function () {
    
    }, 
    login: function(username, password, success, error) {
      var data = { 
          "loginName" : username , 
          "password" : password,
          "custId"   : app.config.rollbase.custId,
           "output"  : "json"
      };
        
      this._getCall("login", data, success, error);
    },
      
    getClaims: function(success, error) {
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "viewId" : "123733537",
          "output"   : "json"
      };
      this._getCall("getPage", data, success, error);
    },
      
    getClaimById:function(claimId, success, error){
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "composite" : "3",
          "id": claimId,
          "output": "json"
      };
        
      this._getCall("getRecord", data, success, error);
    },

    updateListItem: function(listname, etag, id, data, success, error) {
    },

    createListItem: function(listname, data, success, error) {
    },
      
    _getCall: function(method, data, success, error){
        var url = app.config.rollbase.baseUrl + method + '?' + $.param(data);
        $.get(url, function(data){
            success(data);
        }).fail(function(err){
            error(JSON.parse(err.responseText));
        });                 
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

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
        
      this._ajaxCall("POST","login", data, success, error);
    },
      
    getClaims: function(success, error) {
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "viewId" : "123733537",
          "output"   : "json",
          "composite": "1"
      };
      this._ajaxCall("GET", "getPage", data, success, error);
    },
      
    getClaimById:function(claimId, success, error){
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "composite" : "1",
          "id": claimId,
          "output": "json"
      };
        
      this._ajaxCall("GET","getRecord", data, success, error);
    },
  
    createNewClaim: function(data, success, error) {
    
    },
    
    copy: function (buffer) {
    },

      updateClaim: function(id, status, success, error) {
       var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "useIds" : "false",
          "id": id,
          "status":status,
          "output": "json"
      };
      this._ajaxCall("PUT","updateRecord", data, success, error);
    },
   
    _ajaxCall: function(type, method, data, success, error){
        var options = {
            url :app.config.rollbase.baseUrl + method + '?' + $.param(data),
            type : type,
            success : function(data){
              success(data);   
            }
        }
        
        // hack for CORS
        if (type === 'PUT'){
             options.type = 'POST';
             options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', 'PUT');
             }
        }
        
        $.ajax(options).fail(function(err){
            error(JSON.parse(err.responseText));
        });                 
    }
  };
  app.rollbaseService = new RollbaseService();

})(window);

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
      var newClaim = {
          objName       : 'tl_claims',
          sessionId     : app.settingsService.getSessionId(),
          name          : data.Title,
          tl_Amount     : data.Amount,
          tl_Descrption : data.Description,
          status        : data.Status,
          city          : data.City,
          streetAddr1   : data.Address,
          zip           : data.Zip,
          country       : data.Country 
      }

      this._ajaxCall('POST', 'createRecord', newClaim, success, error); 
    },
    
    attachPhoto: function (claimId, url, success, error) {
       var that = this;
       
        window.resolveLocalFileSystemURI(url, function(fileEntry) {
            fileEntry.file(function(file) { 
                var reader = new FileReader();
                reader.onloadend = function(e){ 
                    var uint = String.fromCharCode.apply(null, new Uint8Array(e.target.result));
                    var base64String = btoa(uint);
                    
                    var attachment = {
                      objName       : 'attachment14',
                      sessionId     : app.settingsService.getSessionId(),
                      contentType   : "Image",
                      R123755107    : claimId,
                      tl_Data       : e.target.result
                    };
                    that._ajaxCall('POST', 'createRecord', attachment, success, error, 'multipart/form-data'); 
                };
                 
                reader.readAsArrayBuffer(file);
               
            });
        });
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
   
    _ajaxCall: function(type, method, data, success, error, contentType){
        var options = {
            url :app.config.rollbase.baseUrl + method + '?' + $.param(data),
            type : type,
            success : function(data){
              success(data);   
            }
        }
        
        if (contentType){
          options.contentType = contentType;
        }
        
        $.ajax(options).fail(function(err){
            error(JSON.parse(err.responseText));
        });                 
    }
  };
  app.rollbaseService = new RollbaseService();

})(window);

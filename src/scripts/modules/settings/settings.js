(function (global) {
	var SettingsService,
        SettingsViewModel,
        app = global.app = global.app || {};
    
	SettingsViewModel = kendo.data.ObservableObject.extend({
        loggedIn: false,
        
        events: {
            logout: "logout"
        },
        
        onLogout: function() {
            var that = this;
            
            that.trigger(that.events.logout);
        }
	});
    
	SettingsService = kendo.Class.extend({
		viewModel: null,
        logged: false,
        consts: {
            localStorageKeyUsername: "claimsUsername",
            localStorageKeyPassword: "claimsPassword",
            localStorageKeySessionId : "sessionId"
        },
        
		init: function () {
			var that = this;

			that.viewModel = new SettingsViewModel();
			that.initModule = $.proxy(that._initModule, that);
            that.showModule = $.proxy(that._showModule, that);
		},   

		_initModule: function () {
			var that = this;
            
            that._bindToEvents();
		},
        
        _showModule: function() {
            var that = this;
            
            that.viewModel.$view = $(that.viewModel.viewId);
            that.viewModel.set("loggedIn", that.isLogged() !== null);
        },
       
        _bindToEvents: function() {
            var that = this;
            
            that.viewModel.bind(that.viewModel.events.logout, $.proxy(that.onLogout, that));
        }, 
        
        onLogout: function() {
           app.loginService.signInViewModel.logout(); 
        },
        
        logout : function(){
            localStorage.clear();   
        },
        
        setUserCredentials: function(username, password, sessionId) {
            localStorage.setItem(this.consts.localStorageKeyUsername, username);
            localStorage.setItem(this.consts.localStorageKeyPassword, password);
            localStorage.setItem(this.consts.localStorageKeySessionId, sessionId);
            
            if (username.toLowerCase() === 'claimsmanager'){
                localStorage.setItem("isAdmin", true);
            }
        },    
        
        setCurrentUserGroup: function(groups){
            for(var i =0; i< groups.length; i++){
                if(groups[i].Title == "TelstraOwner"){
                    localStorage.setItem("isAdmin", true);
                    break;
                }                
            }
        },
        
        getSessionId: function(){
        	return localStorage.getItem(this.consts.localStorageKeySessionId);    
        },
        
        setUserHash: function(userAuthHash){
            localStorage.setItem(this.consts.localStorageUserAuthHash, userAuthHash);
        },
        
        isLogged: function() {
        	return localStorage.getItem(this.consts.localStorageKeySessionId);
        },
        
        isAdmin: function(){
            return localStorage.getItem("isAdmin");   
        },
        
        removeCredentials: function() {
         	localStorage.clear();   
        },
        b64toBlob: function(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }
	});
    
	app.settingsService = new SettingsService();
})(window);
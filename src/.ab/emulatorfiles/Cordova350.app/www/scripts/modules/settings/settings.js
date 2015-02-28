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
        
        setUserCredentials: function(username, password, sessionId) {
            localStorage.setItem(this.consts.localStorageKeyUsername, username);
            localStorage.setItem(this.consts.localStorageKeyPassword, password);
            localStorage.setItem(this.consts.localStorageKeySessionId, sessionId);
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
        }
	});
    
	app.settingsService = new SettingsService();
})(window);
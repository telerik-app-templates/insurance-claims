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
            localStorageUserAuthHash: "userAuthHash",
            localStorageUserFormDigestValue: "formDigestValue"
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
        
        setUserCredentials: function(username, password,userAuthHash, formDigestValue) {
            localStorage.setItem(this.consts.localStorageUserFormDigestValue, formDigestValue);
            localStorage.setItem(this.consts.localStorageUserAuthHash, userAuthHash);
            localStorage.setItem(this.consts.localStorageKeyUsername, username);
            localStorage.setItem(this.consts.localStorageKeyPassword, password);
        },    
        
        setCurrentUserGroup: function(groups){
            for(var i =0; i< groups.length; i++){
                if(groups[i].Title == "TelstraOwner"){
                    localStorage.setItem("isAdmin", true);
                    break;
                }                
            }
        },
        
        getUserHash: function(){
        	return localStorage.getItem("userAuthHash");    
        },
        
        setUserHash: function(userAuthHash){
            localStorage.setItem(this.consts.localStorageUserAuthHash, userAuthHash);
        },
        
        isLogged: function() {
        	return localStorage.getItem("formDigestValue");
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
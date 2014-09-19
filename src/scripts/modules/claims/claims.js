(function (global) {
    var claim,
        claimsViewModel,
        claimsService,
        app = global.app = global.app || {};

    app.newLeafData = app.newLeafData || {};

    claim = kendo.data.ObservableObject.extend({
        ID: null,
        Title: "",
        Status: "",
        Amount: 0,
        Photo: "//:0",

        init: function (item) {
            var that = this;

            that.ID = item.ID;
            that.Title = item.Title;
            that.Status = item.Status;
            that.Amount = item.Amount;
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
    });

    claimsViewModel = kendo.data.ObservableObject.extend({
        viewId: "#claims-view",
        claimsDataSource: null,

        init: function () {
            var that = this;

            that.claimsDataSource = new kendo.data.DataSource({
                pageSize: 10
            });

            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
    });


    claimsService = kendo.Class.extend({
        viewModel: null,

        init: function () {
            var that = this;

            that.viewModel = new claimsViewModel();
            that._bindToEvents();

            that.initModule = $.proxy(that._initModule, that);
            that.showModule = $.proxy(that._showModule, that);
        },

        _bindToEvents: function () {
        },

        _initModule: function () {

        },

        _showModule: function (e) {
             if(!app.settingsService.isLogged()) {
            	app.common.navigateToView(app.config.views.signIn);
                return;
            }
            
            var that = this;
            
            that.status = e.view.params.status;
            if(!that.status){
                that.status = app.consts.status.Registered;
            }
            
            app.common.showLoading();
            that.viewModel.$view = $(that.viewModel.viewId);
            that.getclaimsData();
        },

        getclaimsData: function () {
            var that = this;

            app.sharepointService.getListItems("claims", $.proxy(that.storeclaims, that),$.proxy(that._onError, that, ""));
        },

        storeclaims: function (data) {
            var that = this,
                newclaim,
                ds = [];

            for (var i = 0; i < data.d.results.length; i++) {
                newclaim = new claim(data.d.results[i]);
                ds.push(newclaim);
            }

            that.viewModel.get("claimsDataSource").data(ds);
            that.viewModel.get("claimsDataSource").filter({ field: "Status",value: that.status,operator: "startswith" });
            app.common.hideLoading();
        },
         _onError: function (provider, e) {
            app.common.hideLoading();
            app.common.notification("Error loading claims list", JSON.stringify(e));
        }     
    });

    app.claimsService = new claimsService();
})(window);
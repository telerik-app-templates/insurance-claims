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
        Photo: "",
        Attachments: false,

        init: function (item) {
            var that = this;
            that.ID = item.id;
            that.Title = item.name;
            that.Status = item.status;
            that.Amount = item.tl_Amount
            that.Composite = item.composite;
            //that.Attachments = item.Attachments;
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
    });

    claimsViewModel = kendo.data.ObservableObject.extend({
        viewId: "#claims-view",
        claimsDataSource: null,
        claims: [],

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
            that.viewModel.set("claims",[]);
            that.getclaimsData();
        },

        getclaimsData: function () {
            var that = this;
            app.rollbaseService.getClaims($.proxy(that.storeclaims, that),$.proxy(that._onError, that));
        },

        storeclaims: function (data) {
            var that = this
            var count = 1;
            for (var i = 0; i < data.length; i++) {
                if(data[i].status == that.status){
                   that.processClaim(new claim(data[i]), function(){
                     
                   });
                }
            }
             that.viewModel.get("claimsDataSource").data(that.viewModel.get("claims"));
             that.viewModel.get("claimsDataSource").filter({ field: "Status",value: that.status, operator: "startswith" });
             app.common.hideLoading();
        },
        
        processClaim : function(claim, cb){
              var that = this;
              if (claim.Composite){
                    for (var claim_index = 0; claim_index < claim.Composite.length; claim_index++){
                        var composite = claim.Composite[claim_index];

                        if (composite.contentType && composite.contentType.toLowerCase().indexOf('image') >= 0){
                                claim.Photo = "url(" + app.rollbaseService.getImageUrl(composite.id) + ")";
                        }
                    }
               }
               that.viewModel.get("claims").push(claim); 
               cb(); 
        },
        
        setPhoto : function(id, success){
            var url = window.URL || window.webkitURL;
            
            var that = this;
            app.rollbaseService.getPhoto(id, function(imageData){
                var image = app.settingsService.base64Encode(imageData);
                var blob = app.settingsService.b64toBlob(image, 'Image');
                var imgSrc = url.createObjectURL(blob);
                success(imgSrc);
            }, that._onError);
        },
        
         _onError: function (e) {
            app.common.hideLoading();
            
            if (e.status === "login"){
               app.common.navigateToView(app.config.views.signIn);
            } 
            else{ 
                app.common.notification("Error loading claims list", e.message);
            }
        }     
    });

    app.claimsService = new claimsService();
})(window);
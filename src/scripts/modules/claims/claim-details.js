(function (global) {
	var claimDetailsViewModel,
		claimDetailsService,
        colors = {
           Approved: "#4AAD4D",
           Submitted: "#F5913B",
           Declined: "#E4400C"
        },
        app = global.app = global.app || {};

	claimDetailsViewModel = kendo.data.ObservableObject.extend({
        ID: "",
        Title: "",
        parentClass: "",
        Policy: "",
        innerClass: "",
        color: "",
        viewId: "#bill-details-view",
        Description: "",
        Amount: 0,
        Status: app.consts.status.Registered,
        Etag: "",
        Uri: "",
        Photo: "//:0",
        isStatusRegistered: false,
        isAdmin: false,
        Attachments: false,
        events: {
            approveClaim: "approveClaim", 
            capturePhoto: "capturePhoto",
            submitForApproval: "submitForApproval",
            approve: "approve",
            decline: "decline"
        },
        
		init: function () {
			var that = this;
			kendo.data.ObservableObject.fn.init.apply(that, arguments);
        },
        
        onApproveClaimClick: function() { 
            var that = this;            
            that.trigger(that.events.approveClaim, {});
        },
        onAddPhotoClick: function() {          
            var that = this;
            that.trigger(that.events.capturePhoto, {});  
        },
        onSubmitForApprovalClick: function() {          
            var that = this;
            that.trigger(that.events.submitForApproval, {});  
        },
        onApproveClick: function() {          
            var that = this;
            that.trigger(that.events.approve, {});  
        },
        onDeclineClick: function() {          
            var that = this;
            that.trigger(that.events.decline, {});  
        }
        
	});

	claimDetailsService = kendo.Class.extend({
        viewModel: null,
        view: "",
        
		init: function () {
			var that = this;

			that.viewModel = new claimDetailsViewModel();
            
            that._bindToEvents();
            
			that.initModule = $.proxy(that._initModule, that);
            that.showModule = $.proxy(that._showModule, that);
		},
        
        _bindToEvents: function() {
			var that = this;
            that.viewModel.bind(that.viewModel.events.approveClaim, $.proxy(that.onApproveClaim, that));
            that.viewModel.bind(that.viewModel.events.capturePhoto, $.proxy(that.onCapturePhoto, that));
            that.viewModel.bind(that.viewModel.events.submitForApproval, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Submitted));
            that.viewModel.bind(that.viewModel.events.approve, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Approved));
            that.viewModel.bind(that.viewModel.events.decline, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Declined));
        },

		_initModule: function (e) {
		
		},
        
        _showModule: function(e) {
            var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}
            
            that.view = e.view;
            
            app.common.showLoading();

            that.viewModel.set("ID", dataId);  

            app.rollbaseService.getClaimById(dataId,  $.proxy(that.setData, that),  $.proxy(that.onError, that));
             
            that.viewModel.$view = $(that.viewModel.viewId);
        },

		setData: function (claimData) {
            var that = this;
            
            that.viewModel.set("Title", claimData.name.split('|')[0]);
            
            if (claimData.name.split('|').length > 1){
            	that.viewModel.set("Policy", claimData.name.split('|')[1]);
            }else{
            	that.viewModel.set("Policy", "---");
            }
            
            that.viewModel.set("Description", claimData.tl_Descrption);
            that.viewModel.set("Status", claimData.status);
           
            that.viewModel.set("Amount", claimData.tl_Amount);
		    
            if(claimData.status == app.consts.status.Registered){
                that.viewModel.set("isStatusRegistered", true);    
                that.viewModel.set("isAdmin", false);
            }
            else if(claimData.status == app.consts.status.Submitted && app.settingsService.isAdmin()){
                that.viewModel.set("isStatusRegistered", false);    
                that.viewModel.set("isAdmin", true);
            }
            else {
                that.viewModel.set("isStatusRegistered", false);    
                that.viewModel.set("isAdmin", false);
            }
            that.viewModel.set("Attachments", claimData.composite);
            that.viewModel.set("StatusColor", colors[claimData.Status]);
            
            if (claimData.composite){
                 for (var claim_index = 0; claim_index < claimData.composite.length; claim_index++){
                    var composite = claimData.composite[claim_index];

                    if (composite.contentType && composite.contentType.toLowerCase().indexOf('image') >= 0){
                        that.viewModel.set("Photo",  app.rollbaseService.getImageUrl(composite.id));
                        app.common.hideLoading();
                    }
                 }
            }else{
                 app.common.hideLoading(); 
            }
            
            that.viewModel.set("Location", claimData.streetAddr1);
            
			$(".ds-detail-items .ds-top-container").height($(".ds-detail-items").outerHeight() - $(".ds-detail-items .ds-detail-container").height());
		},
        
        onChangeClaimStatus: function(status) {
            var that = this;
            app.common.showLoading("Approval proceeding. This might take a couple of minutes");
            app.rollbaseService.updateClaim (that.viewModel.get("ID"), status, $.proxy(that.claimApproved, that), that.onError)
        },
        
        onCapturePhoto: function() {
            var that = this;
            navigator.camera.getPicture(function(imageData){
                app.common.showLoading("Upload in progress!");
                app.rollbaseService.attachPhoto(that.viewModel.get("ID"), imageData,function(attachment){
                    app.common.hideLoading();
                    that._showModule({ view: that.view } );
                },function(e){
                    app.common.hideLoading();
                    alert(JSON.stringify(e));
                });
                
            }, this._onCaptureFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URL, targetWidth: 480,targetHeight: 600}); 
        },
        _onCaptureFail: function(message){
            app.common.notification("Error", JSON.stringify(message));
        },
        claimApproved: function(data) {
            var that = this;
            app.common.hideLoading();
            app.common.navigateToView(app.config.views.claims);
        },

		onError: function (e) {
		    app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.claimDetailsService = new claimDetailsService();
})(window);

(function (global) {
	var AddclaimViewModel,
        AddclaimService,
        app = global.app = global.app || {};
    
	AddclaimViewModel = kendo.data.ObservableObject.extend({
        viewId: "#add-bill-view",
        
        events: {
            addclaim: "addclaim",
            capturePhoto: "capturePhoto"  
        },
        
		init: function () {
			var that = this;

			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
        
        onAdd: function() {
            var that = this;
            
            that.trigger(that.events.addclaim);
        },
        
        onAddPhotoClick: function() {          
            var that = this;
            that.trigger(that.events.capturePhoto, {});  
        }
	});


	AddclaimService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new AddclaimViewModel();
            that.imageData = null;
            
			that.initModule = $.proxy(that._initModule, that);
            that.showModule = $.proxy(that._showModule, that);
		},
        
        _bindToEvents: function() {
            var that = this
				resizeTextArea = function (element) {
					element = element.target ? this : element;
			    	$(element)
			        	.css("height", 0)
			        	.css("height", element.scrollHeight);
			    },
				txarea = $(".ds-detail-container  textarea");
            
            that.viewModel.bind(that.viewModel.events.addclaim, $.proxy(that._onAddclaim, that));
            that.viewModel.bind(that.viewModel.events.capturePhoto, $.proxy(that.onCapturePhoto, that));
			
			resizeTextArea(txarea[0]);
			txarea.on("input", resizeTextArea);
        },
        
        _onAddclaim: function() {
            var that = this,
            newclaim = {
                "Title": that.viewModel.get("Title"),
                "Description": that.viewModel.get("Description"),
                "Location": that.viewModel.get("Location"),
                "Amount": that.viewModel.get("Amount"),
                "Status": app.consts.status.Registered,
                "__metadata": { 'type': 'SP.Data.ClaimsListItem' }
            }
            
            app.common.showLoading();
            app.sharepointService.createListItem("claims",newclaim,  $.proxy(that._addclaimCompleted, that), $.proxy(that._onError, that, ""));
        },
        
        
         onCapturePhoto: function() {
            var that = this;
            navigator.camera.getPicture(function(imageData){
                that.imageData = imageData;
            }, this._onCaptureFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URL, targetWidth: 480,targetHeight: 600}); 
        },
        
        _onCaptureFail: function(message){
            app.common.notification("Error", JSON.stringify(message));
        },
        
         _onError: function (provider, e) {
            app.common.hideLoading();
            app.common.notification("Error while adding claim", JSON.stringify(e));
        },
        
        _addclaimCompleted: function() {
            app.common.showLoading("Upload in progress!");
            app.sharepointService.attachPictureToListItem("Claims",claim.d.ID, that.imageData,function(){
                app.common.hideLoading();
                app.common.navigateToView(app.config.views.claims);
            },function(e){
                app.common.hideLoading();
                alert(JSON.stringify(e));
            });  
        }, 

		_initModule: function () {
			var that = this;

            that._bindToEvents();
		},
        
        _showModule: function(e) {
            var that = this;
            
            that.viewModel.$view = $(that.viewModel.viewId);
        },

       
	});
    
	app.addclaimService = new AddclaimService();
})(window);

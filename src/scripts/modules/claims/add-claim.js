(function (global) {
	var AddclaimViewModel,
        AddclaimService,
        app = global.app = global.app || {};
    
	AddclaimViewModel = kendo.data.ObservableObject.extend({
        viewId: "#add-bill-view",
        photo: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        
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
        			$(".ds-add-items .ds-top-container").height($(".ds-add-items").height() - $(".ds-add-items .ds-detail-container").height());
			    },
				txarea = $(".ds-detail-container  textarea");
            
            that.viewModel.bind(that.viewModel.events.addclaim, $.proxy(that._onAddclaim, that));
            that.viewModel.bind(that.viewModel.events.capturePhoto, $.proxy(that.onCapturePhoto, that));
			
			resizeTextArea(txarea[0]);
			txarea.on("input", resizeTextArea);
        },
        
        _onAddclaim: function() {
            var that = this;
            var country, zip, city;
            
            var address = JSON.parse(that.viewModel.get('Address'));
            
            for(var index = 0; index < address.length; index++){
                var component = address[index];
                
                if (component.types[0] === "locality" && !city)
                    city = component.short_name;
                
                if (component.types[0] === "postal_code" && !zip)
                    zip = component.short_name;
                
                if (component.types[0] === "country" && !country)
                    country = component.short_name;
            }
                      
            var newclaim = {
                "Title": that.viewModel.get("Title"),
                "Description": that.viewModel.get("Description"),
                "Policy":  that.viewModel.get("Policy"),
                "Address": that.viewModel.get('Location') ,
                "Zip": zip,
                "Country" : country,
                "City": city,
                "Amount": that.viewModel.get("Amount"),
                "Status": app.consts.status.Registered,
            };
            
            app.common.showLoading();
            app.rollbaseService.createNewClaim(newclaim,  $.proxy(that._addclaimCompleted, that), $.proxy(that._onError, that));
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
        
         _onError: function (e) {
            app.common.hideLoading();
            app.common.notification("Error while adding claim", e.message);
        },
        
        _addclaimCompleted: function(data) {
            var that = this;
            
            console.log(data);
            console.log(that);
            
            if(!that.imageData){
                  app.common.navigateToView(app.config.views.claims); 
            }else {                
                app.common.showLoading("Upload in progress!");
                app.rollbaseService.attachPhoto(data.id, that.imageData, function(){
                    app.common.hideLoading();
                    app.common.navigateToView(app.config.views.claims);
                },function(e){
                    app.common.hideLoading();
                    alert(e.message);
                });  
            }
        }, 

		_initModule: function () {
			var that = this;
            that._bindToEvents();
		},
        
        positionChanged : function(position){
            var that = this;
            
            if (google){
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                     new google.maps.Geocoder().geocode({'latLng':latLng}, function(results, status){
                        if (results && results.length){
                            if (results[0].formatted_address){
                                that.viewModel.set("Location", results[0].formatted_address);
                            }
                            if (results[0].address_components){
                                that.viewModel.set("Address", JSON.stringify(results[0].address_components));
                            }
                        } 
                    });
            }
        },
        
        positionChangeError : function(error){
          console.log(JSON.stringify(error));  
        },
        
        _showModule: function(e) {
            var that = this;
            that.viewModel.$view = $(that.viewModel.viewId);
            navigator.geolocation.getCurrentPosition($.proxy(that.positionChanged, that), that.positionChangeError);
        },
        
        adjustDimensions: function() {
			$(".ds-add-items .ds-top-container").height($(".ds-add-items").height() - $(".ds-add-items .ds-detail-container").height());
        }

       
	});
    
	app.addclaimService = new AddclaimService();
})(window);

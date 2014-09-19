(function (global) {
    var app = global.app = global.app || {};
    
    document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();

        new kendo.mobile.Application(document.body, {
            platform: "ios7",
            loading: "<h1></h1>"
        });
		
		// Prevent browser native scroller
		document.ontouchmove = function() { return false; }
        
        // initialize feedback
        //feedback.initialize('b0781da0-0808-11e4-a08e-bb4f9a025edb');

        
        // initialize analytics
        //var productId = "559f01781a29488390919deada10521f"; // App unique product key

        // Make analytics available via the window.analytics variable
        // Start analytics by calling window.analytics.Start()
        //var analytics = window.analytics = window.analytics || {};
        //analytics.Start = function () {
        //    // Handy shortcuts to the analytics api
        //    var factory = window.plugins.EqatecAnalytics.Factory;
        //    var monitor = window.plugins.EqatecAnalytics.Monitor;
        //    // Create the monitor instance using the unique product key for Analytics
        //    var settings = factory.CreateSettings(productId);
        //    settings.LoggingInterface = factory.CreateTraceLogger();
        //    factory.CreateMonitorWithSettings(settings,
        //        function () {
        //            console.log("Monitor created");
        //            // Start the monitor inside the success-callback
        //            monitor.Start(function () {
        //                console.log("Monitor started");
        //            });
        //        },
        //        function (msg) {
        //            console.log("Error creating monitor: " + msg);
        //        }
        //    );
        //};
        //analytics.Stop = function () {
        //    var monitor = window.plugins.EqatecAnalytics.Monitor;
        //    monitor.Stop();
        //};
        //analytics.Monitor = function () {
        //    return window.plugins.EqatecAnalytics.Monitor;
        //};

        //analytics.Start();
        
        //app.analytics = analytics;
    }, false);
    
})(window);
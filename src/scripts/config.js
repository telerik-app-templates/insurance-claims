(function (global) {
    var app = global.app = global.app || {};
    
    app.consts = {
        status: {
            Registered: "Registered",
            Submitted: "Submitted",
            Approved: "Approved",
            Declined: "Declined"            
        }
    };
    
    app.config = {
         sharepoint: {
             baseUrl: "http://192.168.52.31/_api/",
             userNamePrefix: "i:0#.w|win-2a27n7nvsvs\\"
        },
        views: {
            init: "#init-view",
            signIn: "scripts/modules/login/signin.html",
            dashboard: "scripts/modules/dashboard/dashboard.html",
            main: "scripts/modules/dashboard/dashboard.html",
            claims: "scripts/modules/claims/claims.html",
            settings: "scripts/modules/settings/settings.html",
            settingsStarting: "scripts/modules/settings/settings-starting.html"
        }
    };
})(window);

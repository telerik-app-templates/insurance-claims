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
         rollbase : {
            baseUrl : "https://www.rollbase.com/rest/api/",
            agentPass  : "u$sv438iHw@s",
            managerPass: "np#f3dcW9^sCW",
            user : 'mhossain',
            password : 'Ll72Wv44',
            custId : '123123189'
         },
         sharepoint: {
             baseUrl: "https://sp-platformdemo.telerik.com/_api/",
             domainName: "SP-PLATFORMDEMO\\",
             userNamePrefix: "i:0#.w|SP-PLATFORMDEMO\\",
             agentPass: "u$sv438iHw@s",
             managerPass: "np#f3dcW9^sCW"
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

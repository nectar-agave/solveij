/**
 * Definition of the main app module and its dependencies
 */
var AgaveAuth = angular
    .module('AgaveAuth', [
        "ui.router",
        'ngRoute',
        'oc.lazyLoad',
        'angularMoment',
        'ngStorage',
        'oauth',
        'ngMd5',
        'AgavePlatformScienceAPILib',
        'ui.select',
        'AlertService',
        'CommonsService',
    ]);

AgaveAuth.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
    });
})
//.config(function ($routeProvider) {
//    $routeProvider
//        .when('/access_token=:accessToken', {
//            template: '',
//            controller: function ($location, AccessToken) {
//                var hash = $location.path().substr(1);
//                AccessToken.setTokenFromString(hash);
//                $location.path('/success');
//                $location.replace();
//            }
//        });
//});


AgaveAuth.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        oauth: {
            clients: {
                'iplantc.org': 'fGxFxuyIuIkNMTXhjW3HvyEs_dEa'
            }, // sidebar menu state
            scope: 'PRODUCTION'
        },
        layout: {
            loginPage: false,
            tenantPage: true
        },
        tenants: [],
        assetsPath: '/assets',
        globalPath: '/assets/global',
        layoutPath: '/assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

//AgaveAuth.config(function(OAuthProvider) {
//    OAuthProvider.configure({
//        baseUrl: "https://agave.iplantc.org",
//        clientId: "3ekNmfvne9yN_wnfedCRMeA8XSUa",
//        clientSecret: null,
//        grantPath: '/token',
//        revokePath: '/revoke'
//    });
//});

AgaveAuth.constant('angularMomentConfig', {
    timezone: 'America/Chicago' // optional
});

// safe dependency injection
// this prevents minification issues
//config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];

/**
 * App routing
 *
 * You can leave it here in the config section or take it out
 * into separate file
 *
 */
AgaveAuth.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/");

    $stateProvider

        // Auth redirect
        .state('access_token', {
            url: "/access_token=:accessToken",
            templateUrl: "",
            data: {pageTitle: 'OAuth Redirect'},
            controller: function ($location, AccessToken,ProfilesController, $localStorage) {
                var hash = $location.path().substr(1);
                AccessToken.setTokenFromString(hash);
            }
        })

        // login success
        .state('success', {
            url: "/success",
            templateUrl: "views/success.html",
            data: {pageTitle: 'Login Success'},
            controller: "LoginSuccessController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //'../auth/css/tenants.css',
                            '../assets/global/plugins/countdown/jquery.countdown.min.js',
                            '../auth/scripts/controllers/LoginSuccessController.js',
                        ]
                    });
                }]
            }
        })

        // Login
        .state('tenants', {
            url: "/",
            templateUrl: "views/tenants.html",
            data: {pageTitle: 'Select Tenant'},
            controller: "TenantSelectionController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //'../auth/css/tenants.css',
                            '../auth/scripts/controllers/TenantSelectionController.js',
                        ]
                    });
                }]
            }
        })

        // Login
        .state('login', {
            url: "/login/:tenantId",
            templateUrl: "views/login.html",
            data: {pageTitle: 'Login'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //'../auth/css/tenants.css',
                            '../auth/scripts/controllers/LoginController.js',
                        ]
                    });
                }]
            }
        })

        // Logout
        .state('logout', {
            url: "/logout",
            templateUrl: "views/logout.html",
            data: {pageTitle: 'Logout'},
            controller: "LogoutController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //'../auth/css/tenants.css',
                            '../assets/global/plugins/countdown/jquery.countdown.min.js',
                            '../auth/scripts/controllers/LogoutController.js',
                        ]
                    });
                }]
            }
        })

        // Logout
        .state('signup', {
            url: "/signup",
            templateUrl: "views/signup.html",
            data: {pageTitle: 'SignUp'},
            controller: "SignupController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveAuth',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //'../auth/css/login.css',
                            'scripts/controllers/SignupController.js',
                        ]
                    });
                }]
            }
        });
    //$httpProvider.interceptors.push('authInterceptor');

}]);



/**
 * You can intercept any request or response inside authInterceptor
 * or handle what should happend on 40x, 50x errors
 *
 */
//angular
//    .module('AgaveAuth')
//    .factory('authInterceptor', authInterceptor);
//
//authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];
//
//function authInterceptor($rootScope, $q, LocalStorage, $location) {
//
//    return {
//
//        // intercept every request
//        request: function(config) {
//            config.headers = config.headers || {};
//            return config;
//        },
//
//        // Catch 404 errors
//        responseError: function(response) {
//            if (response.status === 401) {
//                $location.path('/auth/login');
//                return $q.reject(response);
//            } else if (response.status === 404) {
//                $location.path('/404.html');
//                return $q.reject(response);
//            } else {
//                $location.path('/500.html');
//                return $q.reject(response);
//            }
//        }
//    };
//}


/**
 * Run block
 */
AgaveAuth.run(["$rootScope", "$location", "$state", "$timeout", "$localStorage", "TenantsController", "ProfilesController", "settings", "Commons", function($rootScope, $location, $state, $timeout, $localStorage, TenantsController, ProfilesController, settings, Commons) {

    $rootScope.$state = $state;

    TenantsController.listTenants().then(
        function (response) {
            console.log(response);
            angular.forEach(response, function (tenant, key) {
                if (settings.debug
                    || !(Commons.contains(tenant.name.toLowerCase(), 'staging')
                        || Commons.contains(tenant.name.toLowerCase(), 'dev')))
                {
                    settings.tenants.push(tenant);
                }
            });
            console.log(settings.tenants);
            //$timeout(function () {
            //
            //}, 50);
        },
        function (message) {
            console.log("error: " + message);
            Alerts.danger({message: "Failed to retrieve tenant information."});
        }
    );

    $rootScope.$on('oauth:login', function(event, token) {
        console.log('Authorized third party app with token', token.access_token);
        $localStorage.token = token;

        ProfilesController.getProfile('me').then(
            function(profile) {
                $localStorage.activeProfile = profile;
                $location.path("/success");
                $location.replace();
            },
            function(message) {
                $localStorage.currentUser = null;
            }
        )
    });

    $rootScope.$on('oauth:logout', function(event) {
        console.log('The user has signed out');
    });

    $rootScope.$on('oauth:loggedOut', function(event) {
        console.log('The user is not signed in');
    });

    $rootScope.$on('oauth:denied', function(event) {
        console.log('The user did not authorize the third party app');
        //$location.href("/login");
    });

    $rootScope.$on('oauth:expired', function(event) {
        console.log('The access token is expired. Please refresh.');
        //$location.href("/login");
    });

    $rootScope.$on('oauth:profile', function(profile) {
        console.log('User profile data retrieved: ', profile);
    });

}]);
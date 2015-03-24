"use strict"

console.log("App.js");

var FrontierInspirationApp = angular.module ("FrontierInspirationApp", ["ui.router"]);

// Declare app level module using dependents
FrontierInspirationApp.config (['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');
	$stateProvider
		.state ('splash', {
			url: '/splash',
			templateUrl: 'partials/splash.html'
		})
		.state ('home', {
			url: '/',
			templateUrl: 'partials/home.html'
		})
		.state ('home.main', {
			url: 'home',
			templateUrl: 'partials/main.html'
		})
		.state ('home.journal', {
			url: 'myjournal',
			templateUrl: 'partials/myjournal.html'
		})
		.state ('home.journal.text-entry', {
			url: '/text',
			templateUrl: 'partials/textentry.html'
		})
		.state ('home.journal.img-entry', {
			url: '/image',
			templateUrl: 'partials/imgentry.html'
		})
		.state ('home.profile', {
			url: 'profile',
			templateUrl: 'partials/profile.html'
		})
		.state ('user-debug', {
			url: '/debug',
			templateUrl: 'partials/debug.html'
		});
}]);
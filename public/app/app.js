"use strict"

console.log("App.js");

var FrontierInspirationApp = angular.module("FrontierInspirationApp", ["ui.router"]);

// Declare app level module using dependents
FrontierInspirationApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/splash');
	$stateProvider
		.state('splash', {
			url: '/splash',
			templateUrl: 'partials/splash.html'
		})
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html'
		})
		.state('home.main', {
			url: 'home',
			templateUrl: 'partials/main.html'
		})
		.state('user-debug', {
			url: '/debug',
			templateUrl: 'partials/debug.html'
		});
});
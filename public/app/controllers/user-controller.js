"use strict";

console.log("user-controller.js");

angular.module("FrontierInspirationApp").controller('userController',
	function($scope, $rootScope, $http, $state)
	{
		$http.get("/api/users")
			.success( function(data) {
				console.log("SUCCESS! ", data);
			})
			.error( function(data) {
				console.log("ERROR! ", data);
			});
			
		$scope.addUser = function() {
			var fullname = $scope.formData.fullname;
			//var 
		}
	}
);
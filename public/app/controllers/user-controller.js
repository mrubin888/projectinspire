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
		
		if ($rootScope.username)
		{
			$http.get("/api/users/?username=" + $rootScope.username)
			.success( function(data) {
				console.log("SUCCESS! ", data);
			})
			.error( function(data) {
				console.log("ERROR! ", data);
			});
		}
		
		$scope.addUser = function() {
			
			if (!$scope.formData)
				return;
				
			$scope.message0 = "";
			$scope.message1 = "";
			$scope.message2 = "";
			$scope.message3 = "";
			
			if (!$scope.formData.fullname) {
				$scope.message0		= "Name cannot be blank.";
				return;
			}
			
			var fullName		= $scope.formData.fullname;
			var nameWords		= fullName.split(" ");
			var realWordsArray	= new Array();
			for (var i = 0; i < nameWords.length; i++)
				if (nameWords[i].length > 0)
					realWordsArray.push(nameWords[i]);
			
			if (realWordsArray.length < 2) {
				$scope.message0		= "Please enter your full name.";
				return;
			}
			
			var firstName	= realWordsArray[0];			
			var lastName	= "";
			for (var i = 1; i < realWordsArray.length; i++)
			{
				if (lastName)
					lastName	+= " ";
				lastName		+= realWordsArray[i];
			}
			
			if (!$scope.formData.email) {
				$scope.message1		= "Email cannot be blank.";
				return;
			}
			
			if (!$scope.formData.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
				$scope.message1		= "Invalid email address.";
				return;
			}
			
			if (!$scope.formData.username) {
				$scope.message2		= "Username cannot be blank.";
				return;
			}
			
			if ($scope.formData.username.length < 6 || $scope.formData.username.length > 12) {
				$scope.message2		= "Username must be between 6 and 12 characters.";
				return;
			}
			
			if (!$scope.formData.username.match(/^[a-zA-Z0-9]{6,12}$/)) {
				$scope.message2		= "Username cannot contain any special characters.";
				return;
			}
			
			if (!$scope.formData.password) {
				$scope.message3		= "Password cannot be blank.";
				return;
			}
			
			if ($scope.formData.password.length < 8 || $scope.formData.username.length > 20) {
				$scope.message3		= "Password must be between 8 and 20 characters.";
				return;
			}
			
			if (!$scope.formData.password.match(/^[a-zA-Z0-9!@#$%^&*]{8,20}$/)) {
				$scope.message3		= "Password contains invalid characters.";
				return;
			}
			
			if (!$scope.formData.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) {
				$scope.message3		= "Password must contain a number and a special character.";
				return;
			}
			
			var formData		= new FormData();
			formData.append("firstname",	firstName);
			formData.append("lastname",		lastName);
			formData.append("email",		$scope.formData.email);
			formData.append("username",		$scope.formData.username);
			formData.append("password",		$scope.formData.password);
			
			$http.post("/signup", formData,	{
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
			})
			.success(function(postData) {
				console.log(postData);
				$state.go("user-debug");
			})
			.error(function(data) {
				
			});
		}
	}
);
"use strict";

angular.module ("FrontierInspirationApp").controller ('journalController',
	function ($scope, $http, $state) {
		
		$scope.entries = [];
		
		var refreshEntries	= function () {
			$http.get ("/api/entries")
			.success (function (data) {
				$scope.entries = data;
				
				for (var i = 0; i < $scope.entries.length; i++) {
					var timeDiff	= (Date.now() - new Date($scope.entries[i].timestamp).getTime()) / 1000;
					timeDiff = Math.floor (timeDiff);
					
					if (timeDiff < 60) {
						$scope.entries[i].timeDiff = timeDiff + " seconds";
					}
					else {
						timeDiff = Math.floor (timeDiff / 60);
						
						if (timeDiff < 60) {
							$scope.entries[i].timeDiff = timeDiff + " minutes";
						}
						else {
							timeDiff = Math.floor (timeDiff / 60);
							
							if (timeDiff < 24) {
								$scope.entries[i].timeDiff = timeDiff + " hours";
							}
							else {
								timeDiff = Math.floor (timeDiff / 24);
								
								if (timeDiff < 30) {
									$scope.entries[i].timeDiff = timeDiff + " days";
								}
								else {
									timeDiff = Math.floor (timeDiff / 30);
								
									if (timeDiff < 12) {
										$scope.entries[i].timeDiff = timeDiff + " months";
									}
									else {
										timeDiff = Math.floor (timeDiff / 12);
										
										$scope.entries[i].timeDiff = timeDiff + " years";
									}
								}
							}
						}
					}
					
				}
			})
			.error (function (data) {
			
			});
		}
		
		refreshEntries ();
		
		$scope.addEntry = function () {
		
			if (!$scope.formData)
				return;
			
			var formData		= new FormData ();
			formData.append ("title", $scope.formData.title);
			
			if (!$scope.formData.content) {
				console.log ("No content found");
				return;	
			}
			
			if ($scope.formData.content.text)
			{
				formData.append ("content", $scope.formData.content.text);
				formData.append ("contentType", "text");
			}
			else if ($scope.formData.content.image)
			{
				console.log ($scope.formData.content.image);
				
				formData.append ("content", $scope.formData.content.image);
				formData.append ("contentType", "image");
			}
			else {
				return;
			}
			
			$http.post ("/api/entries", formData,	{
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
			})
			.success (function (data) {
				refreshEntries ();
				$scope.formData = {};
			})
			.error (function (data) {
				console.log (data);
			});
		}
		
		$scope.removeEntry	= function (id) {
			
			$http.delete ("/api/entry/" + id)
			.success (function (data) {
				refreshEntries ();
			})
			.error (function (data) {
			
			});
		}
		
		$scope.addPicture	= function (file) {
			if (!file || !file[0])
				return;
			if (!$scope.formData)
				$scope.formData	= new FormData();
			console.log ("File0: ", file[0]);
			$scope.formData.content	= {image: file[0]};
			
			$scope.formValid	= $scope.isFormValid ($scope.formData);
			$scope.$apply ();
		}
		
		$scope.isFormValid	= function (formData) {
		
			if (!formData)
				return false;
			
			if (!formData.title || formData.title === "")
				return false;
			
			if (!formData.content)
				return false;
			
			console.log ($state.current.name);
			
			if ($state.current.name === "home.journal.text-entry") {
				if (!formData.content.text || formData.content.text === "")
					return false;
			}
			else if ($state.current.name == "home.journal.img-entry") {
				if (!formData.content.image)
					return false;
			}
			
			return true;
		}
	}
);
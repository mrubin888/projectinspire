"use strict";

console.log ("auth-http-response-interceptor-service.js");

angular.module ("FrontierInspirationApp").factory ('authHttpResponseInterceptor', ['$q', '$injector', function ($q, $injector) {
	return {
		responseError: function (rejection) {
			if (rejection.status === 401) {
				console.log ("Intercepted a 401 error: ", rejection);
				$injector.get('$state').go('splash');
			}
			return $q.reject (rejection);
		}
	}
}])
.config (['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push ('authHttpResponseInterceptor');
}]);
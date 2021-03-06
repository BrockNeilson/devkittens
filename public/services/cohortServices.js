angular.module("devKittens")

.service('cohortServices', function($http, $q) {

	this.createNewCohort = function(obj) {
		var dfrd = $q.defer();
		$http({
			method: "POST",
			url: "/api/cohort",
			data: obj
		}).then(function(response) {
			dfrd.resolve(response.data);
		})
		return dfrd.promise;
	}

	this.updateCoursesOrder = function (newOrderById, cohortId) {
		if (!cohortId) return console.error('Missing cohort id');

		var deferred = $q.defer();
		var uri = '/api/cohort/' + cohortId;

		$http.put(uri, newOrderById)
		.success(function (response) {
			deferred.resolve(response);
		})
		.error(function (err) {
			deferred.resolve(err);
		});

		return deferred.promise;
	}

	this.getCohort = function(cohortId) {
		var dfrd = $q.defer();
		$http({
			url: "/api/cohort/" + cohortId,
			method: "GET"
		}).then(function(response) {
			dfrd.resolve(response.data);
		})
		return dfrd.promise;
	}

	this.getAllCohorts = function() {
		var dfrd = $q.defer();

		$http({
			method: "GET",
			url: '/api/all-cohorts'
		})
		.then(function (response) {
			dfrd.resolve(response.data);
		})
		.catch(function (err) {
			dfrd.reject(err);
		});

		return dfrd.promise;
	}
})
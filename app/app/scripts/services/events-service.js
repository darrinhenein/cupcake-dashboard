angular.module('cupcakeDashboard')
  .service('EventsService', function Events($http) {

    self = this;

    self._allEvents = [];

    this.getAllEvents = function(){
      return $http.get('/api/events/');
    }


  });
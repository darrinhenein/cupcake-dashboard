angular.module('cupcakeDashboard')
  .service('PhaseService', function Phases($http) {

        self = this;

        self._phases = [];
        self._total = null;

        this.phases = function(){
          var promise = $http.get('/api/phases', { cache: true }).then(function(res){
            self._phases = res.data;
            return res.data;
          })
          return promise;
        }

        this.total = function(){
          var promise = $http.get('/api/projects/total', { cache: true }).then(function(res){
            return res.data.total;
          })
          return promise;
        }
    });

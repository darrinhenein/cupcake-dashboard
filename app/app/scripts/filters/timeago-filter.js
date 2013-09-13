angular.module('cupcakeDashboard').filter('timeAgo', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});
angular.module('cupcakeDashboard')
  .directive('progressBar', function() {
    return {
      restrict: 'E',
      scope: {progress: '@'},
      template:
        "<div class='progress'>" +
          "<div class='bar'></div>" +
        "</div>",
      replace: true,
      link: function(scope, element, controller) {
        var newWidth = scope.progress + "%";
        var el = $(".bar", element);
        el.css({
          width: 0,
          transition: "all 0.5s ease-out"
        });
        setTimeout(function(){el.css("width", newWidth)}, 0);
      }
    }
  });

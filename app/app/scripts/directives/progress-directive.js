angular.module('cupcakeDashboard')
  .directive('progressBar', function() {
    return {
      restrict: 'E',
      scope: {
        project: '=',
        range: '='
      },
      template:
        "<div class='progress'>" +
          "<div class='bar'></div>" +
        "</div>",
      replace: true,
      link: function(scope, element, controller) {

        var drawGraph = function(){
          var newWidth = (scope.project.phase / (scope.range.length-1) * 100) + "%";
          var el = $(".bar", element);
          el.css({
            width: 0,
            transition: "all 0.5s ease-out"
          });
          _.defer(function(){el.css("width", newWidth)}, 0);
        }

        scope.$watchCollection('project', drawGraph);
        scope.$watchCollection('range', drawGraph);
      }
    }
  });

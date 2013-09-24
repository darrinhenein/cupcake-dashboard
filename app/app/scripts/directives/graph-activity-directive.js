angular.module('cupcakeDashboard')
  .directive("graphActivity", function($http) {
    // constants
     var margin = {left: 12, right: 12, top: 0, bottom: 0},
       width = 100,
       height = 20,
       color = d3.interpolateRgb("#f77", "#77f");

     return {
       restrict: 'A',
       scope: {
         id: '=graphActivity',
         grouped: '='
       },
       link: function (scope, element, attrs) {

        $http.get("/api/projects/" + scope.id + "/activity").then(function(res){
          scope.data = res.data;
        });

         // set up initial svg object
         var vis = d3.select(element[0])
           .append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));


         scope.$watch('data', function (newVal, oldVal) {

           // if 'val' is undefined, exit
           if (!newVal) {
             return;
           }

           if (!scope.data){
            return;
           }

           var minX = _.min(scope.data, function(d){
             var dateParts = d.date.split('-');
             return new Date(dateParts[2], dateParts[0], dateParts[1]);
           });
           var maxX = _.max(scope.data, function(d){
             var dateParts = d.date.split('-');
             return new Date(dateParts[2], dateParts[0], dateParts[1]);
           });

           var minParts = minX.date.split('-');
           minX = new Date(minParts[2], minParts[0], minParts[1]);

           var maxParts = maxX.date.split('-');
           maxX = new Date(maxParts[2], maxParts[0], maxParts[1]);

           maxR = _.max(scope.data, function(d){
            return d.count;
           });

           var x = d3.time.scale().domain([minX, maxX]).range([margin.left, width - margin.right]);
           var r = d3.scale.linear().domain([0, 20]).range([3, 12]).clamp(true);
           var color = d3.scale.linear().domain([0, 1, 20]).range(['#EEE', '#00D4F0', '#FF0084']).clamp(true);

           function dots() {
              vis.selectAll('*').remove();
              vis.selectAll('svg')
               .append('g')
               .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
               .data(scope.data)
               .enter()
                 .append('circle')
                 .transition()
                 .duration(10)
                 .attr("cx", function(d) {
                  // DD-MM-YYYY
                  var dateParts = d.date.split('-');
                  // Y, M, D
                  return x(new Date(dateParts[2], dateParts[0], dateParts[1]));
                 })
                 .attr("cy", function(d) { return height/2; })
                 .attr("r", function(d) { return 0; })
                 .attr("fill", function(d) { return "#FFF"; })
                 .each("end", transitionEnd);

                function transitionEnd(){
                 d3.select(this)
                  .transition()
                  .duration(500)
                  .ease("elastic")
                  .attr("r", function(d) { return r(d.count) / 2; })
                  .attr("fill", function(d) { return color(d.count); })
                }
           }

           dots();

         });
      }
    }
});
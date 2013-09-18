angular.module('cupcakeDashboard')
  .directive("graphEvents", function() {
    // constants
     var margin = 30,
       width = 740,
       height = 40,
       color = d3.interpolateRgb("#f77", "#77f");

     return {
       restrict: 'A',
       scope: {
         data: '=graphEvents',
         grouped: '='
       },
       link: function (scope, element, attrs) {

         // set up initial svg object
         var vis = d3.select(element[0])
           .append("svg")
             .attr("width", width + margin*2)
             .attr("height", height + margin*2)
             .attr("viewBox", "0 0 " + (width + margin*2) + " " + (height + margin*2));


         scope.$watch('data', function (newVal, oldVal) {

           // clear the elements inside of the directive
           vis.selectAll('*').remove();

           // if 'val' is undefined, exit
           if (!newVal) {
             return;
           }

            function getDateFromEvent(d){
              return new Date(d);
            }

            scope.data.sort(function(a, b){
              a = new Date(a.date);
              b = new Date(b.date);
              return a<b?-1:a>b?1:0;
            });

            var minX = getDateFromEvent(scope.data[0].date);
            var maxX = getDateFromEvent(scope.data[scope.data.length-1].date);

            scope.data.sort(function(a, b){
              a = new Date(a.date).getHours();
              b = new Date(b.date).getHours();
              return a - b;
            });

            var minY = getDateFromEvent(scope.data[0].date).getHours();
            var maxY = getDateFromEvent(scope.data[scope.data.length-1].date).getHours();

            var Xscale = d3.time.scale().domain([minX, maxX]).range([margin, width - margin]);
            var Yscale = d3.scale.linear().domain([maxY, minY]).range([0, height]);

            var color = d3.scale.linear().domain([maxY, minY]).range(['#E80275', '#00D4F0']);

            var dataPoints = [];

            scope.data.sort(function(a, b){
              a = new Date(a.date);
              b = new Date(b.date);
              return a<b?-1:a>b?1:0;
            });

            for(i = 0; i < scope.data.length; i++){
                d = new Date(scope.data[i].date);
                dataPoints.push([d.getDate() + d.getHours()/24 + d.getMinutes()/60, d.getHours() + d.getMinutes()/60]);
            }

            dataPoints.sort(function(a, b){
              return a[0] - b[0];
            });

            var xAxis = d3.svg.axis().scale(Xscale).orient('bottom');
            var yAxis = d3.svg.axis().scale(Yscale)
              .orient('left')
              .ticks(3)
              .tickFormat(function(d) {
                var t = 'a';
                if(d > 12){
                  d = d - 12;
                  t = 'p';
                }
                if(d == 0) d = 12;
                return d + t;
              });

            var flatline = d3.svg.line()
                .x(function(d){
                  return Xscale(getDateFromEvent(d.date)) + margin;
                })
                .y(function(d){
                  return height + margin + 5;
                })

            var line = d3.svg.line()
                .x(function(d){
                  return Xscale(getDateFromEvent(d.date)) + margin;
                })
                .y(function(d){
                  return Yscale(getDateFromEvent(d.date).getHours() + getDateFromEvent(d.date).getMinutes()/60) + margin;
                })

            function transitionDots() {
               vis.append("path")
                .transition()
                .duration(100)
                .attr("d", flatline(scope.data))
                .attr("fill", "none")
                .attr("stroke", "#CCC")
                .each("end", transitionLine);

                function transitionLine() {
                  d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("d", line(scope.data));
                }


               vis.selectAll("svg")
               .append("g")
               .attr('transform', 'translate(' + margin + ',' + margin + ')')
               .data(scope.data)
               .enter().append("circle")
               .transition()
               .duration(100)
               .attr("opacity", "0.5")
               .attr("r", "2px")
               .attr("fill", "#FFF")
               .attr('transform', 'translate(' + margin + ',' + margin + ')')
               .attr({
                  'cx': function(e){ return Xscale(getDateFromEvent(e.date))},
                  'cy': height + margin + 5
               })
               .each("end", transitionEnd);

              vis.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + margin + "," + (height + margin + 10) + ")")
                .call(xAxis);

              vis.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (margin + 10) + "," + margin +  ")")
                .call(yAxis);

               function transitionEnd() {
                 d3.select(this)
                  .transition()
                  .duration(500)
                  .attr({
                     'cy': function(e){return Yscale(getDateFromEvent(e.date).getHours() + getDateFromEvent(e.date).getMinutes()/60)}
                  })
                  .attr("fill", function(e){d = new Date(e.date); return color(d.getHours())});
               }
             }

             transitionDots();

         });
      }
    }
});
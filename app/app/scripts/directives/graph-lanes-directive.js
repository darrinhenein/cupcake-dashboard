angular.module('cupcakeDashboard')
  .directive("graphPhaseLanes", function($http) {
    // constants
     var margin = {left: 45, right: 25, top: 0, bottom: 20},
       width = 740,
       height = 90;

     return {
       restrict: 'A',
       scope: {
         data: '=graphPhaseLanes',
         lanes: '=lanes'
       },
       link: function (scope, element, attrs) {

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

           if (!scope.data || !scope.lanes){
            return;
           }


           var temp = _.filter(_.map(scope.data, function(e){
            if(e.date && e.model)
            {
              return {date: e.date, phase: e.model.phase || 0};
            }
           }), function(o){
              return o != undefined;
           });

           var data = [];

           if(temp.length == 0) return;

           temp.sort(function(a, b){
             a = new Date(a.date);
             b = new Date(b.date);
             return a - b;
           });

           // add most recent state
           data.push(_.extend(temp[0], {index: 0}));

           var count = 1;

           for (var i = count; i <= temp.length - 1; i++) {
             if(temp[i].phase != temp[i-1].phase)
             {
              data.push(_.extend(temp[i], {index: count}));
              count++;
             }
           }

           if(data.length <= 1)
           {
            data.push(_.extend(temp[temp.length-1], {index: count}));
            count++;
           }

           var x = d3.scale.linear().domain([0, count-1]).range([margin.left, width]);
           var y = d3.scale.ordinal().domain(scope.lanes.map(function(p){return p.phase;})).rangeRoundBands([height, margin.bottom], 0.05);
           var color = d3.scale.linear().domain([0, scope.lanes.length-1]).range(['#00D4F0','#E80275']);

            var flatline = d3.svg.line()
                .x(function(d){
                  return x(d.index) + margin.left;
                })
                .y(function(d){
                  return height + 5 + margin.top;
                })

            var line = d3.svg.line()
                .x(function(d){
                  return x(d.index) + margin.left;
                })
                .y(function(d){
                  return y(d.phase) + 5;
                })
                .interpolate("step-after");

            var xAxis = d3.svg.axis().scale(x)
              .orient('bottom')
              .ticks(count-1)
              .tickFormat(function(d){
                var format = d3.time.format("%b %-d/%y");
                return format(new Date(data[d].date));
              });

            var yAxis = d3.svg.axis().scale(y)
              .orient('left')
              .tickSize(-width, 0, 0)
              .tickFormat(function(d) {
                return scope.lanes[d].title;
              });

           function lanes() {
               vis.selectAll('*').remove();

               vis.selectAll('svg').append('g')
                .data(scope.lanes)
                .enter()
                .append('rect')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr({
                  x: -margin.left,
                  y: function(d, i){return y(i) -1},
                  width: width + margin.left + margin.right,
                  height: 13
                })
                .attr('fill', function(d, i){ return color(i) })
                .attr('opacity', '0.6');

               vis.append("path")
                .transition()
                .duration(100)
                .attr("d", flatline(data))
                .attr("fill", "none")
                .attr("stroke", "#FFF")
                .each("end", transitionLine);

               vis.selectAll('svg').append('g')
                .data(data)
                .enter()
                .append('circle')
                .transition()
                .duration(100)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr({
                  cx: function(d, i) { return x(d.index); },
                  cy: height + margin.top,
                  r: 3,
                  fill: function(d){ return color(d.phase); },
                  stroke: '#FFF'
                })
                .each("end", transitionDots);

                function transitionDots() {
                  d3.select(this)
                    .transition()
                    .duration(500)
                    .attr({
                      cx: function(d, i) { return x(d.index); },
                      cy: function(d, i){return y(d.phase) + 5}
                    });
                }

                function transitionLine() {
                  d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("d", line(data));
                }

                 vis.append("g")
                     .attr("class", "x axis")
                     .attr('transform', 'translate(' + margin.left + ',' + (height) + ')')
                     .call(xAxis);

                 vis.append("g")
                   .attr("class", "y axis white")
                   .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top +  ")")
                   .call(yAxis);
           }

           lanes();

         });
      }
    }
});
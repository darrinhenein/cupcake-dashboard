angular.module('cupcakeDashboard')
.directive("graphPhaseDistribution", function($http) {
// constants
  var margin = {left: 15, right: 15, top: 10, bottom: 20},
  width = 320,
  height = 90,
  color = d3.interpolateRgb("#f77", "#77f");

  return {
    restrict: 'A',
    scope: {
      projects: '=',
      phases: '='
    },
  link: function (scope, element, attrs) {

    // set up initial svg object
    var vis = d3.select(element[0])
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var firstDraw = true;

    scope.$watchCollection('[projects, phases]', function (newVal, oldVal) {

    // // if 'val' is undefined, exit
    if (!newVal) {
      return;
    }

    if (!scope.projects || !scope.phases){
      return;
    }

    var counts = _.countBy(scope.projects, function(p){
      return p.phase;
    });

    _.each(scope.phases, function(phase){
      phase.count = counts[phase.phase] ? counts[phase.phase] : 0;
    });

    var data = scope.phases;

    var maxY = _.max(data, function(d){
      return d.count;
    }).count;

    var maxX = _.max(data, function(d){
      return d.phase;
    }).phase;

    var x = d3.scale.ordinal().domain(data.map(function (d) {return d.title; })).rangeRoundBands([margin.left, width], 0.05);
    var y = d3.scale.linear().domain([0, maxY]).range([0, height]).clamp(true);
    var color = d3.scale.linear().domain([0, maxX]).range(['#00D4F0','#E80275']).clamp(true);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var bars = function() {
      vis.selectAll('*').remove();
      vis.selectAll('svg')
      .data(data)
      .enter()
      .append("rect")
      .transition()
      .duration(100)
      .attr("x", function(d) { return x(d.title); })
      .attr("width", function(d) { return width / data.length - 10; })
      .text(function(d){ return d.count; })
      .attr("y", function(d) { return height; })
      .attr("height", function(d){ return 0; })
      .each("end", transitionEnd);

      vis.append("g")
      .attr("class", "axis")
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

      vis.selectAll("svg")
      .append("g")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function(d){
        return x(d.title) + ((width/data.length - 10)/2);
      })
      .attr("y", function(d){
        return (height - y(d.count)) + 12;
      })
      .attr("font-size", "11px")
      .attr("fill", "#FFF")
      .style("text-anchor", "middle")
      .text(function(d){if(d.count != 0){return d.count;} else { return '';} });

      function transitionEnd(){
        d3.select(this)
        .transition()
        .duration(500)
        .ease("elastic")
        .attr("fill", function(d) { return color(d.phase); })
        .attr("y", function(d) { return (height) - y(d.count); })
        .attr("height", function(d){ return y(d.count) });
      }
    }

    bars();

    });
    }
  }
});
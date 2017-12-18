var diameter = 1200;

function yearToY(year){ return (year-1890)*3.5;}
function getY(d) {
  //return d.y;
  return yearToY(d.born);
};

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 120])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .source(function(d){
        if(d.source.firstname=="")
          return {x: d.target.x, y: getY(d.source)};
        else
          return {x: d.source.x, y: getY(d.source)};
      })
    .target(function(d){ return {x: d.target.x, y: getY(d.target)};})
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("#circles").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

d3.json("family.json", function(error, root) {
  if (error) throw error;

  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);


  var decade = svg.selectAll(".decade")
      .data([1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020])
    .enter().append("g")
      .attr("class", "decade")
  decade.append("circle")
      .attr("r", function(d){return yearToY(d)});

  decade.append("text")
      .attr("dy", ".31em")
      .attr("transform", function(d) { return "translate(-10,-"+yearToY(d)+")" })
      .text(function(d) { return d; });

  svg.selectAll(".title")
    .data(["João e Maria Andrelina"])
    .enter().append("text")
      .attr("class", "title")
      .attr("transform", function(d) { return "translate(-50,20)" })
      .text(function(d) { return d; });

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + getY(d) + ")"; })

  var c = d3.scale.category10();
  node.append("circle")
      .attr("r", 4.5)
      .attr("stroke", function(d){return c(d.depth)});
  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { return d.firstname; });
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");

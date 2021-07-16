var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%Y%m%d");

var startDate = new Date("1987-01-01"),
    endDate = new Date("2022-01-01");

var margin = {top:50, right:50, bottom:0, left:50},
    width = 960 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);  

////////// slider //////////

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button");
    
var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);


var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          update(x.invert(currentValue)); 
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var label = slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (65) + ")")
    .attr("font-size","2em")

 
////////// plot //////////

var dataset;

var plot = svg.append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("dataWithLonLat.csv", prepare, function(data) {
  dataset = data;
  drawPlot(dataset);
  
  playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause");
    }
    console.log("Slider moving: " + moving);
  })
})

function prepare(d) {
  d.id = d.id;
  date = d['分公司核准設立日期'];

  if (date.length == 6){
    year = date.substring(0, 2)
    month = date.substring(2, 4)
    day = date.substring(4, 6)
  } else {
    year = date.substring(0, 3)
    month = date.substring(3, 5)
    day = date.substring(5, 7)
  }

  year = parseInt(year) + 1911 
  year = year.toString()

  
  d.date = parseDate(year + month + day);

  return d;
}
  
function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/((30)));
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function drawPlot(data) {
  var locations = plot.selectAll(".location")
    .data(data);

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function(d) { return parseFloat(d['Response_X'])/1000 + 100 })
    .attr("cy", function(d) { return height-(parseFloat(d['Response_Y'])/1000-2100) })
    .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
    .style("stroke", d3.hsl(0.9, 1, 0.1))
    //.style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
    .style("opacity", 0.3)
    .attr("r", 1)
//      .transition()
//     .duration(100)
//      .attr("r", 10)
//        .transition()
//        .attr("r", 0.3);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}

function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function(d) {
    return d.date < h;
  })
  drawPlot(newData);
}
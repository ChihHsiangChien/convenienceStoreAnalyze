d3.csv('data.csv',function (data) {
// CSV section
  //console.log(data,function (d) { return d['面積'] })
  var body = d3.select('body')
  var selectData = [ { "text" : "7-11店數" },
                     { "text" : "OK店數" },
                     { "text" : "全家店數" },
                     { "text" : "全聯店數" },
                     { "text" : "萊爾富店數" },
                     { "text" : "便利商店合計店數" },
                     { "text" : "人口" },
                     { "text" : "面積" },
                     { "text" : "便利商店平均服務人數" },
                     { "text" : "每平方公里有多少家便利商店" },
                     { "text" : "200公尺內可以遇到幾家店" },
                   ]

  // Select X-axis Variable
  var span = body.append('span')
    .text('X軸 ')
  var yInput = body.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Y軸 ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')


  //circle lable visable/visable
  var span = body.append('span')
      .text('縣市標籤')
  var toggle = body.append('input')
      .attr('type','checkbox')
      .attr('id','lableToggle')
  body.append('br')



  // Variables
  var body = d3.select('body')
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var h = 500 - margin.top - margin.bottom
  var w = 500 - margin.left - margin.right
  //var formatPercent = d3.format('.1%')
  var formatPercent = d3.format('')
  // Scales
  var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return parseFloat(d['面積'])})]),
      d3.max([0,d3.max(data,function (d) { return parseFloat(d['面積'])})]) 
      ])
    .range([0,w])
  

  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return parseFloat(d['面積'])})]),
      d3.max([0,d3.max(data,function (d) { return parseFloat(d['面積'])})]) 
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(formatPercent)
    .ticks(5)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickFormat(formatPercent)
    .ticks(5)
    .orient('left')
  

  // add the X gridlines
  var axisXGrid = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10)
    .tickFormat("")
    .tickSize(-h,0);
  

  // add the Y gridlines
  var axisYGrid = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10)
    .tickFormat("")
    .tickSize(-w,0);

  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale( parseFloat(d['面積'])) })
      .attr('cy',function (d) { return yScale( parseFloat(d['面積'])) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d['縣市'] +
                           '\n面積' + formatPercent( d['面積']) +
                           '\n人口' + formatPercent( d['人口']) 
                           })
  // Circles Label
  var circleLabels = svg.selectAll('circleLabel')
      .data(data)
      .enter()
    .append('text') // X-axis Label
      //.attr('id','circleLabel')
      .attr('id','circleLabel')
      .attr('x',function (d) { return xScale( parseFloat(d['面積']))+10  })
      .attr('y',function (d) { return yScale( parseFloat(d['面積']))+5 })
      .attr('font-size','small')
      .text(function (d) { return d['縣市'] })
      .style("opacity",0)

  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',30)
      .attr('x',w)
      .attr('dy','0.1em')
      .style('text-anchor','end')      
      .text('面積')
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(0)')
      .attr('x',0)
      .attr('y',-30)
      .attr('dy','.71em')
      .style('text-anchor','start')
      .text('面積')
  // X-grid
  svg.append('g')
      .attr('class','grid')
      .attr('id','xGrid')
      .attr('fill','none')
      .attr('stroke','rgba(0,0,0,.1)')
      .attr('transform','translate(0,'+ h +')' )
      .call(axisXGrid)
  // Y-grid
  svg.append('g')
      .attr('class','grid')
      .attr('id','yGrid')
      .attr('fill','none')
      .attr('stroke','rgba(0,0,0,.1)')
      // .attr('transform','translate(0,'+ w +')' )
      .call(axisYGrid)


  d3.select("#lableToggle").on("change",toggleChange);


  function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return parseFloat(d[value]) })]),
        d3.max([0,d3.max(data,function (d) { return parseFloat(d[value]) })])
        ])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('cy',function (d) { return yScale(d[value]) })
    d3.select('#yGrid') // redraw the yGrid
        .transition().duration(1000)
        .call(axisYGrid)   
    d3.selectAll('#circleLabel') // move the circlesLable
        .transition().duration(1000)
        .delay(function (d,i) { return i*100})
          .attr('y',function (d) { return yScale( parseFloat(d[value]))+5 })                
  }

  function xChange() {
    var value = this.value // get the new x value
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return parseFloat(d[value]) })]),
        d3.max([0,d3.max(data,function (d) { return parseFloat(d[value]) })])
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('cx',function (d) { return xScale(d[value]) })
    d3.select('#xGrid') // redraw the yGrid
      .transition().duration(1000)
      .call(axisXGrid)
    d3.selectAll('#circleLabel') // move the circlesLable
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('x',function (d) { return xScale( parseFloat(d[value]))+10 })        
  }

  function toggleChange() {

    if(d3.select("#lableToggle").property("checked")){
      d3.selectAll("#circleLabel")
      .style("opacity",1)
    } else {
      d3.selectAll("#circleLabel")
      .style("opacity",0)
    }


  }
})
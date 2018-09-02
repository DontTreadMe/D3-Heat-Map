
const margin = {
        top: 100,
        right: 0,
        bottom: 100,
        left: 120
      },
      width = 1400 - margin.right - margin.left,
      height = 580 - margin.top - margin.bottom,
      
      formatTime = d3.timeFormat("%Y - %B"),
      
      tip = d3.tip()
      .attr('class', 'd3-tip')
      .attr("id", "tooltip")
      .html((d) => formatTime(new Date(d.year, d.month - 1)) + '<br>' + 
        d.variance.toFixed(1) + "&#8451;"),
  
      svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom),
      
      div = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0),
      
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear(),
      colorScale = d3.scaleLinear().range([1, 0]),
      
      xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")),
      yAxis = d3.axisLeft(yScale);

svg.call(tip);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then((json) => {
  const dataset = json.monthlyVariance;
  const minMaxYear = d3.extent(dataset, (d) => d.year);
  const minMaxMonth = d3.extent(dataset, (d) => d.month);
  const minMaxVariance = d3.extent(dataset, (d) => d.variance);
  const quantityYear = minMaxYear[1] - minMaxYear[0] + 1;
  const quantityMonth = minMaxMonth[1] - minMaxMonth[0] + 1;
  xScale.domain(minMaxYear);
  xScale.range([margin.left, width - width / quantityYear + margin.left]);
  yScale.domain(minMaxMonth);
  yScale.range([margin.top, height - height / quantityMonth + margin.top]);
  colorScale.domain(minMaxVariance);
  
  svg.selectAll("rect")
    .data(dataset).enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", width / quantityYear)
    .attr("height", height / quantityMonth)
    .attr("fill", (d) => d3.interpolateRdYlBu(colorScale(d.variance)))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);  
})

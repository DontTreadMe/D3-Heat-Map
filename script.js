
const margin = {top: 100, right: 0, bottom: 100, left: 140},
      width = 1500 - margin.right - margin.left,
      height = 680 - margin.top - margin.bottom,
      
      tip = d3.tip()
      .attr('class', 'd3-tip')
      .attr("id", "tooltip")
      .html((d) => formatYM(new Date(d.year, d.month - 1)) + '<br>' + 
        d.variance.toFixed(1) + "&#8451;"),
  
      svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom),
      
      formatYM = d3.timeFormat("%Y - %B"),
      formatY = d3.timeFormat("%Y"),
      formatM = d3.timeFormat("%B"),
      
      xScale = d3.scaleLinear(),
      yScale = d3.scaleBand().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      colorScale = d3.scaleLinear().range([1, 0]),
      
      xAxis = d3.axisBottom(xScale)
      .tickFormat((y) => {
        const date = new Date(Date.UTC(y));
        return formatY(date);
      })
      .tickSizeInner(10)
      .tickSizeOuter(0),
      
      yAxis = d3.axisLeft(yScale)
      .tickFormat((m) => {
        const date = new Date(Date.UTC(0, m));
        return formatM(date);
      })
      .tickSizeInner(10)
      .tickSizeOuter(0);

svg.call(tip);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then((json) => {
  const dataset = json.monthlyVariance;
  const minMaxYear = d3.extent(dataset, (d) => d.year);  
  const minMaxVariance = d3.extent(dataset, (d) => d.variance);
  const quantityYear = minMaxYear[1] - minMaxYear[0] + 1;  
  xScale.domain(minMaxYear);
  xScale.range([margin.left, width - width / quantityYear + margin.left]);
  yScale.range([margin.top, margin.top + height]);
  colorScale.domain(minMaxVariance);
  xAxis.ticks(Math.round(dataset.length/120));
  
  svg.selectAll("rect")
    .data(dataset).enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month - 1))
    .attr("width", width / quantityYear)
    .attr("height", height / 12)
    .attr("fill", (d) => d3.interpolateRdYlBu(colorScale(d.variance)))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  
  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + (height + margin.top) + ")")
    .call(xAxis)
    .attr("id", "x-axis")    
    .classed("axes", true);
  
  svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + 0 + ")")
  .call(yAxis)
  .attr("id", "y-axis")    
  .classed("axes", true);
  
  // svg.append("rect")
  // .attr("x", margin.left)
  // .attr("y", margin.top)
  // .attr("width", 15)
  // .attr("height", height)
})

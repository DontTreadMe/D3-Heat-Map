
const margin = {top: 0, right: 0, bottom: 120, left: 110},
      width = 1500 - margin.right - margin.left,
      height = 480 - margin.top - margin.bottom,
      
      widthColorLabel = 500,
      
      quantityColorLabelTicks = 11,
      
      formatYM = d3.timeFormat("%Y - %B"),
      formatY = d3.timeFormat("%Y"),
      formatM = d3.timeFormat("%B"),
      
      tip = d3.tip()
      .attr('class', 'd3-tip')
      .attr("id", "tooltip"),
      
      section = d3.select("body")
        .append("section")
        .style("max-width", width + margin.right + margin.left + "px"),
      
      heading = section.append("heading"),
  
      svg = section.append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom),
      
      xScale = d3.scaleLinear(),
      yScale = d3.scaleBand().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      tempScale = d3.scaleLinear().range([1, 0]),
      
      colorScale = d3.scaleLinear().range([margin.left, margin.left + widthColorLabel]),
      
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
      .tickSizeOuter(0),

      colorAxis = d3.axisBottom(colorScale)
      .tickFormat(d3.format(".1f"))
      .tickSizeInner(10)
      .tickSizeOuter(0);

svg.call(tip);

const addLegend = (k, widthRect) => {
    const colors = d3.schemeRdYlBu[k].reverse();
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "svgGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");

    gradient.selectAll("stop")
      .data(colors).enter()
      .append("stop")
      .attr("offset", (d, i) => i * 100 / (k - 1) + "%")
      .attr("stop-color", d => d)
      .attr("stop-opacity", 1);

    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + margin.left + ", " + (height + margin.bottom / 2.2) + ")");
  
    legend.append("rect")
      .attr("width", widthRect)
      .attr("height", margin.bottom / 4)
      .attr("fill", "url(#svgGradient)")
      .style("stroke", "black");
  };
  

const calcTickValues = (arrMinMaxTemp, quantityCeils) => {    
    let arr = [], i, a = arrMinMaxTemp[0];
    for (i = 0; i < quantityCeils; i++) {
      arr = [...arr, a];
      a = a +(arrMinMaxTemp[1] - arrMinMaxTemp[0]) / (quantityCeils - 1);
    }
    return arr;
  };
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then((json) => {
  const dataset = json.monthlyVariance;
  const minMaxYear = d3.extent(dataset, d => d.year);  
  const minMaxTemperature = d3.extent(dataset, d => json.baseTemperature + d.variance);
  const quantityYear = minMaxYear[1] - minMaxYear[0] + 1;  
  const colorValues = calcTickValues(minMaxTemperature, quantityColorLabelTicks);
  colorAxis.tickValues(colorValues);
  xScale.domain(minMaxYear);
  xScale.range([margin.left, width - width / quantityYear + margin.left]);
  yScale.range([margin.top, margin.top + height]);
  tempScale.domain(minMaxTemperature);
  xAxis.ticks(Math.round(dataset.length/120));
  colorScale.domain(minMaxTemperature);
  
  heading.append("h1")
    .attr('id', 'title')
    .text("Monthly Global Land-Surface Temperature");
  heading.append("h2")
    .attr('id', 'description')
    .html(dataset[0].year + " - " + dataset[dataset.length - 1].year + 
      ": base temperature " + json.baseTemperature + "&#8451;");
  
  tip.html(d => formatYM(new Date(d.year, d.month - 1)) + "<br/>" + 
    "Temperature: " + (json.baseTemperature + d.variance).toFixed(1) + 
    "&#8451;" + '<br/>' + "Variance: " + d.variance.toFixed(1) + "&#8451;");
  
  svg.selectAll("rect")
    .data(dataset).enter()
    .append("rect")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month - 1))
    .attr("width", width / quantityYear)
    .attr("height", height / 12)
    .classed("cell", true)
    .attr("fill", d => 
    d3.interpolateRdYlBu(tempScale(json.baseTemperature + d.variance)))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => json.baseTemperature + 
      d.variance)
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
  
  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + (height + 
      margin.bottom / 2.2 + margin.bottom / 4) + ")")
    .call(colorAxis)
    .classed("axes", true);
  
  addLegend(11, widthColorLabel);
});

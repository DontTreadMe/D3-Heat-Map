
const margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
      },
      width = 1400 - margin.right - margin.left,
      height = 630 - margin.top - margin.bottom,
      
      svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom),
      
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear(),
      colorScale = d3.scaleLinear().range([1, 0]),
      
      xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")),
      yAxis = d3.axisLeft(yScale);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then((json) => {
  const dataset = json.monthlyVariance;
  const parseYear = d3.extent(dataset, (d) => d.year);
  const parseMonth = d3.extent(dataset, (d) => d.month - 1);
  const parseVariance = d3.extent(dataset, (d) => d.variance);
  const quantityYear = parseYear[1] - parseYear[0] + 1;
  const quantityMonth = parseMonth[1] - parseMonth[0] + 1;
  xScale.domain(parseYear);
  xScale.range([margin.left, width - width / quantityYear + margin.left]);
  yScale.domain(parseMonth);
  yScale.range([margin.top, height - height / quantityMonth + margin.top]);
  colorScale.domain(parseVariance)
  svg.selectAll("rect")
    .data(dataset).enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", width / quantityYear)
    .attr("height", height / quantityMonth)
    .attr("fill", (d) => d3.interpolateRdYlBu(colorScale(d.variance)))
})

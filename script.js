fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(response => response.json())
  .then(json => showChart(json.data));

function showChart(data) {
  const w = 800;
  const h = 600;
  const padding = 50;
  const parseDate = d3.timeParse("%Y-%m-%d");

  const xScale = d3.scaleTime()
    .domain([d3.min(data, d => parseDate(d[0])),
      d3.max(data, d => parseDate(d[0]))
    ])
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[1])])
    .range([h - padding, padding]);

  const svg = d3.select("#root")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale);

  const tooltip = d3.select("#root")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(parseDate(data[i][0])))
    .attr("y", (d, i) => yScale(data[i][1]))
    .attr("width", 2)
    .attr("height", (d, i) => h - padding - yScale(data[i][1]))
    .attr("data-date", (d, i) => data[i][0])
    .attr("data-gdp", (d, i) => data[i][1])
    .on("mouseover", (d, i) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      tooltip.html(`Date:${data[i][0]} GDP:${data[i][1]}`)
      tooltip.attr("data-date", data[i][0])
    })
    .on("mouseout", d => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis);
}

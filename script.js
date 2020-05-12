fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(response => response.json())
  .then(json => showChart(json.data));

function showChart(data) {
  const w = 800;
  const h = 400;
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
    .attr("height", h)
    .style("background", "LightCyan")
    .style("padding", "10px");

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale);

  const tooltip = d3.select("#root")
    .append("span")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("display", "inline-block")
    .style("opacity", 0)
    .style("background", "Ivory")
    .style("margin", "300px auto auto auto")
    .style("padding", "5px");

  const firstSegment = Math.floor(data.length / 3);
  const secondSegment = Math.floor(data.length * 2 / 3);
  const barWidth = 2;

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(parseDate(data[i][0])))
    .attr("y", (d, i) => yScale(data[i][1]))
    .attr("width", barWidth)
    .attr("height", (d, i) => h - padding - yScale(data[i][1]))
    .attr("data-date", (d, i) => data[i][0])
    .attr("data-gdp", (d, i) => data[i][1])
    .attr("fill", (d, i) => {
      if (i <= firstSegment) {
        return "slateBlue";
      } else if (i > firstSegment && i <= secondSegment) {
        return "Plum";
      } else {
        return "pink";
      }
    })
    .on("mouseover", (d, i) => {
      tooltip.style('opacity', 1)
        .html(`Date:${data[i][0]}<br>GDP:${data[i][1]}`)
        .attr("data-date", data[i][0]);
    })
    .on("mouseout", d => tooltip.style('opacity', 0));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis);
}

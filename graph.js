/* global d3, topojson */

const EDUCATION_FILE =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const COUNTY_FILE =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.queue()
    .defer(d3.json, COUNTY_FILE)
    .defer(d3.json, EDUCATION_FILE)
    .await(ready);

function ready(error, us, education) {
    if (error) {
        throw error;
    }
    console.log(us);
    console.log(education);

    const w = 1000;
    const h = 700;

    const colourScale = d3
        .scaleThreshold()
        .domain([10, 20, 30, 40, 50])
        .range(['yellow', 'orange', 'red', 'purple', 'black']);

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('id', 'svg-area')
        .attr('width', w)
        .attr('height', h);

    var tooltip = d3
        .select('#chart')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    const resultCountyMatch = d => education.filter(e => e.fips === d.id)[0];

    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-education', d => resultCountyMatch(d).bachelorsOrHigher)
        .attr('d', d3.geoPath())
        .style('fill', d => colourScale(resultCountyMatch(d).bachelorsOrHigher))
        .on('mouseover', function (d) {
            tooltip.style('opacity', 0.9);
            tooltip
                .html(
                    () =>
                        resultCountyMatch(d).area_name +
                        ', ' +
                        resultCountyMatch(d).state +
                        ': ' +
                        resultCountyMatch(d).bachelorsOrHigher +
                        '%'
                )
                .attr('data-education', resultCountyMatch(d).bachelorsOrHigher)
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('opacity', 0);
        });

    const legend = svg.append('g').attr('id', 'legend');

    legend
        .selectAll('rect')
        .data(colourScale.domain())
        .enter()
        .append('rect')
        .attr('x', (d, i) => 200 + i * 50)
        .attr('y', 5)
        .attr('width', 50)
        .attr('height', 20)
        .style('fill', d => colourScale(d - 0.1));

    legend
        .selectAll('text')
        .data(colourScale.domain())
        .enter()
        .append('text')
        .attr('x', (d, i) => 240 + i * 50)
        .attr('y', 40)
        .text(d => d);
}

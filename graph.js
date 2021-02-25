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
        .scaleLinear()
        .domain([0, 100])
        .range(['white', 'navy']);

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
                .html(function () {
                    var result = education.filter(function (obj) {
                        return obj.fips === d.id;
                    });
                    if (result[0]) {
                        return (
                            result[0]['area_name'] +
                            ', ' +
                            result[0]['state'] +
                            ': ' +
                            result[0].bachelorsOrHigher +
                            '%'
                        );
                    }
                    // could not find a matching fips id in the data
                    return 0;
                })
                .attr('data-education', function () {
                    var result = education.filter(function (obj) {
                        return obj.fips === d.id;
                    });
                    if (result[0]) {
                        return result[0].bachelorsOrHigher;
                    }
                    // could not find a matching fips id in the data
                    return 0;
                })
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('opacity', 0);
        });

    // const xScale = d3
    //     .scaleBand()
    //     .domain(data.monthlyVariance.map(d => d.year))
    //     .range([p, w - p]);

    // const yScale = d3
    //     .scaleBand()
    //     .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    //     .range([p, h - p]);

    // const cScale = d3
    //     .scaleThreshold()
    //     .domain([-4, -2, 0, 2, 4])
    //     .range(['blue', 'lightblue', 'yellow', 'orange', 'red']);

    // const xAxis = d3
    //     .axisBottom(xScale)
    //     .tickValues(xScale.domain().filter(year => year % 20 === 0))
    //     .tickFormat(year => d3.timeFormat('%Y')(new Date(year, 0, 1)));

    // const yAxis = d3
    //     .axisLeft(yScale)
    //     .tickFormat(month => d3.timeFormat('%B')(new Date(1970, month, 1)));

    // svg.append('g')
    //     .attr('transform', `translate(${p}, 0)`)
    //     .attr('id', 'y-axis')
    //     .call(yAxis);

    // svg.append('g')
    //     .attr('transform', `translate(0, ${h - p})`)
    //     .attr('id', 'x-axis')
    //     .call(xAxis);

    // svg.selectAll('rect')
    //     .data(data.monthlyVariance)
    //     .enter()
    //     .append('rect')
    //     .attr('x', d => xScale(d.year))
    //     .attr('y', d => yScale(d.month - 1))
    //     .attr('width', xScale.bandwidth())
    //     .attr('height', yScale.bandwidth())
    //     .attr('class', 'cell')
    //     .attr('data-month', d => d.month - 1)
    //     .attr('data-year', d => d.year)
    //     .attr('data-temp', d => d.variance)
    //     .style('fill', d => cScale(d.variance))
    //     .on('mouseover', d => {
    //         svg.append('text')
    //             .text(d.year)
    //             .attr('id', 'tooltip')
    //             .attr('x', xScale(d.year) + 10)
    //             .attr('y', yScale(d.month) + 5)
    //             .attr('data-year', d.year);
    //     })
    //     .on('mouseout', () => {
    //         d3.selectAll('#tooltip').remove();
    //     });

    // const legend = svg.append('g').attr('id', 'legend');

    // legend
    //     .selectAll('rect')
    //     .data(cScale.domain())
    //     .enter()
    //     .append('rect')
    //     .attr('x', (d, i) => p + i * 50)
    //     .attr('y', 5)
    //     .attr('width', 50)
    //     .attr('height', 20)
    //     .style('fill', d => cScale(d - 0.1));

    // legend
    //     .selectAll('text')
    //     .data(cScale.domain())
    //     .enter()
    //     .append('text')
    //     .attr('x', (d, i) => p + 45 + i * 50)
    //     .attr('y', 40)
    //     .text(d => d);
}

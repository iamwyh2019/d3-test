const _width = window.innerWidth;
const _height = window.innerHeight;

const data = [
    {type: 'Auto', data: [80, 40]},
    {type: 'Public transit', data: [5, 35]},
    {type: 'Bike', data: [1, 3]},
    {type: 'Walk', data: [4, 23]}
];

function draw_background() {
    let padding = {left: (_width - SVG_WIDTH)/2, top: (_height - SVG_HEIGHT)/2};
    let svg = d3.select('#container')
        .select('svg')
        .attr('width', SVG_WIDTH)
        .attr('height', SVG_HEIGHT)
        .attr('transform', `translate(${padding.left}, ${padding.top})`);
    
    let title_y = SVG_HEIGHT * 0.08;
    let title = svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('id', 'title')
        .attr('x', SVG_WIDTH/2)
        .attr('y', title_y)
        .text('Transportation mode, by share of use');

    let subtitle_y = title_y + title.node().getBBox().height/2+10;
    let subtitle = svg.append('text')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('id', 'subtitle')
        .attr('x', SVG_WIDTH/2)
        .attr('y', subtitle_y)
        .text('Congressional Research Service');
    
    let ticks = svg.append('g')
        .attr('id', 'ticks');

    const tick_data = [
        ['0%', BOTTOM_LINE_COLOR],
        ['25%', TICK_LINE_COLOR],
        ['50%', TICK_LINE_COLOR],
        ['75%', TICK_LINE_COLOR]
    ];
    
    let tick_enter = ticks.selectAll('rect')
        .data(tick_data)
        .enter();
    
    tick_enter.append('rect')
        .attr('x', (SVG_WIDTH - BAR_AREA_WIDTH)/2)
        .attr('width', BAR_AREA_WIDTH)
        .attr('y', (d,i) => (subtitle_y + BAR_AREA_HEIGHT * (1-i/tick_data.length)))
        .attr('height', TICK_HEIGHT)
        .attr('fill', d => d[1]);
    
    tick_enter.append('text')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'ticktext')
        .attr('x', (SVG_WIDTH - BAR_AREA_WIDTH)/2 - 25)
        .attr('y', (d,i) => (subtitle_y + BAR_AREA_HEIGHT * (1-i/tick_data.length) + TICK_HEIGHT/2))
        .text(d => d[0]);
}

draw_background();
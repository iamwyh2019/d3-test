const _width = window.innerWidth;
const _height = window.innerHeight;

const data = [
    {type: 'Auto', data: [80, 45]},
    {type: 'Public transit', data: [5, 35]},
    {type: 'Bike', data: [1, 3]},
    {type: 'Walk', data: [4, 23]}
];

let tick_bottom_y;

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
    let bars = svg.append('g')
        .attr('id', 'bars');

    const tick_data = [
        ['0%', BOTTOM_LINE_COLOR],
        ['25%', TICK_LINE_COLOR],
        ['50%', TICK_LINE_COLOR],
        ['75%', TICK_LINE_COLOR]
    ];
    
    let tick_enter = ticks.selectAll('rect')
        .data(tick_data)
        .enter();

    tick_bottom_y = subtitle_y + BAR_AREA_HEIGHT;
    
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

function draw_bars() {
    let svg = d3.select('#container').select('svg');
    let n = data.length;
    // Calculate space between each groups
    // When there are n groups, there are (n-1) gaps
    // plus 0.5 gaps on each end, that sums up to n gaps
    // Space taken by bar groups: 2*BAR_WIDTH + BAR_GAP
    let group_gap = (BAR_AREA_WIDTH - (2*BAR_WIDTH+BAR_GAP)*n) / n;
    console.log(group_gap, BAR_AREA_WIDTH);
    // x-axis of middle point of each group
    let _x = (i) => SVG_WIDTH/2 - (n/2-i-0.5) * (group_gap + BAR_WIDTH*2 + BAR_GAP);
    let _h = (d) => d/100*BAR_AREA_HEIGHT;
    let _y = (d) => tick_bottom_y - _h(d);

    let bars_enter = svg.select('#bars')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g');

    bars_enter.append('rect')
        .attr('x', (d,i) => _x(i) - (BAR_GAP*0.5 + BAR_WIDTH))
        .attr('y', d => _y(d.data[0]))
        .attr('width', BAR_WIDTH)
        .attr('height', d => _h(d.data[0]))
        .attr('fill', AVERAGE_BAR_COLOR);

    bars_enter.append('rect')
        .attr('x', (d,i) => _x(i) + BAR_GAP*0.5)
        .attr('y', d => _y(d.data[1]))
        .attr('width', BAR_WIDTH)
        .attr('height', d => _h(d.data[1]))
        .attr('fill', TRANSIT_BAR_COLOR);

    bars_enter.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', (d,i) => _x(i))
        .attr('y', tick_bottom_y + 40)
        .attr('class', 'typetext')
        .attr('dominant-baseline', 'hanging')
        .text(d => d.type);
}

draw_background();
draw_bars();
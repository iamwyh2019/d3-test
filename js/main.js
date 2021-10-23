const _width = window.innerWidth;
const _height = window.innerHeight;

let tick_bottom_y, top_line_height;

let nonlinear = x => (1/(1+Math.exp(-5*x+3))-0.047426)/0.833371;

function get_text_size(className) {
    let svg = d3.select('#container').select('svg');
    let phony_text = svg.append('text').attr('class', className).text('1');
    let text_size = phony_text.node().getBBox();
    phony_text.remove();
    return text_size;
}

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

    tick_bottom_y = subtitle_y + BAR_AREA_HEIGHT;
    
    tick_enter.append('rect')
        .attr('x', (SVG_WIDTH - BAR_AREA_WIDTH)/2)
        .attr('width', BAR_AREA_WIDTH)
        .attr('y', (d,i) => (subtitle_y + BAR_AREA_HEIGHT * (1-i/tick_data.length)))
        .attr('height', TICK_HEIGHT)
        .attr('fill', d => d[1]);

    top_line_height = subtitle_y + BAR_AREA_HEIGHT/tick_data.length + TICK_HEIGHT/2;
    
    tick_enter.append('text')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'ticktext')
        .attr('x', (SVG_WIDTH - BAR_AREA_WIDTH)/2 - 25)
        .attr('y', (d,i) => (subtitle_y + BAR_AREA_HEIGHT * (1-i/tick_data.length) + TICK_HEIGHT/2))
        .text(d => d[0]);
}

function draw_bars() {
    const special_delay = 900;
    const data = [
        {type: 'Auto', data: [80, 45], edelay: 0},
        {type: 'Public\ntransit', data: [5, 35], edelay: special_delay + BAR_TWO_RISE_DURATION*2},
        {type: 'Bike', data: [1, 3], edelay: special_delay + BAR_TWO_RISE_DURATION},
        {type: 'Walk', data: [4, 23], edelay: special_delay}
    ];

    let svg = d3.select('#container').select('svg');
    let bars = svg.append('g')
        .attr('id', 'bars');
    let n = data.length;
    // Calculate space between each groups
    // When there are n groups, there are (n-1) gaps
    // plus 0.5 gaps on each end, that sums up to n gaps
    // Space taken by bar groups: 2*BAR_WIDTH + BAR_GAP
    let group_gap = (BAR_AREA_WIDTH - (2*BAR_WIDTH+BAR_GAP)*n) / n;
    // x-axis of middle point of each group
    let _x = (i) => SVG_WIDTH/2 - (n/2-i-0.5) * (group_gap + BAR_WIDTH*2 + BAR_GAP);
    let _h = (d) => d/100*BAR_AREA_HEIGHT;
    let _y = (d) => tick_bottom_y - _h(d);

    let bars_enter = bars.selectAll('g')
        .data(data)
        .enter()
        .append('g');

    bars_enter.append('rect')
        .attr('x', (d,i) => _x(i) - (BAR_GAP*0.5 + BAR_WIDTH))
        .attr('width', BAR_WIDTH)
        .attr('fill', AVERAGE_BAR_COLOR)
        .attr('height', 0)
        .attr('y', tick_bottom_y)
        .transition()
        .duration(BAR_ONE_RISE_DURATION)
        .delay(LEGEND_DURATION)
        .ease(nonlinear)
        .attr('y', d => _y(d.data[0]))
        .attr('height', d => _h(d.data[0]))
        ;

    bars_enter.append('rect')
        .attr('x', (d,i) => _x(i) + BAR_GAP*0.5)
        .attr('width', BAR_WIDTH)
        .attr('fill', TRANSIT_BAR_COLOR)
        .attr('y', tick_bottom_y)
        .attr('height', 0)
        .transition()
        .delay(d => SECOND_PART_DELAY + d.edelay)
        .duration(BAR_TWO_RISE_DURATION)
        .ease(nonlinear)
        .attr('y', d => _y(d.data[1]))
        .attr('height', d => _h(d.data[1]));

    let text_height = get_text_size('typetext').height*0.8;
    let text_enter = bars_enter.append('text')
        .attr('class', 'typetext')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', (d,i) => `translate(${_x(i)},${tick_bottom_y + text_height})`)
        .selectAll('tspan')
        .data(d => d.type.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('y', (d,i) => i*text_height)
        .text(d => d);
}

function draw_legends() {
    const legend_data = [
        {
            text: 'National average',
            color: AVERAGE_BAR_COLOR,
            duration: LEGEND_DURATION,
            delay: 0
        },
        {
            text: 'Transit-oriented\ndevelopments',
            color: TRANSIT_BAR_COLOR,
            duration: LEGEND_DURATION,
            delay: SECOND_PART_DELAY
        }
    ];

    let line_sz = get_text_size('legendtext');
    let line_wd = line_sz.width * legend_data[0].text.length, line_ht = line_sz.height*0.8;

    let svg = d3.select('#container').select('svg');
    let legend = svg.append('g').attr('id', 'legend');
    let legend_enter = legend.selectAll('g')
        .data(legend_data)
        .enter()
        .append('g');

    legend_enter.append('text')
        .attr('class', 'legendtext')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('transform', (d,i) => 
            `translate(${(SVG_WIDTH+BAR_AREA_WIDTH)/2},${top_line_height + (i-0.5)*2*(TICK_HEIGHT/2+line_ht)})`)
        .selectAll('tspan')
        .data(d => d.text.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('y', (d,i) => i*line_ht)
        .text(d => d);

    legend_enter.append('rect')
        .attr('height', LEGEND_SIZE)
        .attr('width', LEGEND_SIZE)
        .attr('fill', d => d.color)
        .attr('y', (d,i) => 
            top_line_height + (i-0.5)*2*(TICK_HEIGHT/2+10+LEGEND_SIZE/2) - LEGEND_SIZE/2)
        .attr('x', (SVG_WIDTH+BAR_AREA_WIDTH)/2 - line_wd);

    legend_enter.attr('transform', 'translate(-50,0)')
        .style('opacity', 0)
        .transition()
        .duration(d => d.duration)
        .delay(d => d.delay)
        .ease(nonlinear)
        .attr('transform', 'translate(0,0)')
        .style('opacity', 1);
}

draw_background();
draw_legends();
draw_bars();
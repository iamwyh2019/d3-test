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
    
    let title_y = SVG_HEIGHT * 0.1;
    let title = svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('id', 'title')
        .attr('x', SVG_WIDTH/2)
        .attr('y', title_y)
        .text('Transportation mode, by share of use');

    let subtitle_y = title_y + title.node().getBBox().height/2;
    let subtitle = svg.append('text')
        .attr('text-anchor', 'end')
        .attr('id', 'subtitle')
        .attr('x', SVG_WIDTH/2)
        .attr('y', subtitle_y)
        .text('Congressional Research Service');
    
    let ticks = svg.append('g')
        .attr('id', 'ticks');

    
}

draw_background();
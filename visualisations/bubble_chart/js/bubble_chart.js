d3.csv('commit_data.csv', function(data) {

				// Converting numerical values from strings to numbers
				var dataset = data.map(function(d) {
					d.commits = +d.commits;
					return d;
				});

				var diameter = 500,
					color = d3.scale.category20b(), 
					totalCommits = dataset.reduce(function(acc, val) {
						return acc + val.commits;
					}, 0);
				//console.log(totalCommits);

				var bubble = d3.layout.pack()
							   		  .sort(null)
							       	  .size([2 * diameter, diameter])
							   		  .padding(1.5)
							   		  .value(function(d) { return d.commits; });

				var svg = d3.select('#objective1')
							.append('svg')
							.attr('width', 2 * diameter)
							.attr('height', diameter)
							.attr('class', 'bubble');

				var nodes = bubble.nodes({children:data})
								  .filter(function(d) {
								  	return !d.children;
								  });
				console.log(nodes);

				// Set up the chart to display the bubbles
				var bubbles = svg.append('g')
								 .attr('transform', 'translate(0,0)')
								 .selectAll('.bubble')
								 .data(nodes)
								 .enter();

				// Create the bubbles and append them
				bubbles.append('circle')
					   .attr('r', function(d) { return d.r; })
					   .attr('cx', function(d) { return d.x; })
					   .attr('cy', function(d) { return d.y; })
					   .style('fill', function(d) { return color(d.commits); });

				// Add and format the text for each bubble
				bubbles.append('text')
					   .attr('x', function(d) { return d.x; })
					   .attr('y', function(d) { return d.y; })
					   .attr('text-anchor', 'middle')
					   .attr('dominant-baseline', 'text-after-edge')
					   .text(function(d) {
					   		if (d.commits !== 0) {					   			
					   			return d.author;
					   		}
					   })
					   .style({
					   		'fill':'white',
					   		'font-size':'0.8em'
					   });

				bubbles.append('text')
					   .attr('x', function(d) { return d.x; })
					   .attr('y', function(d) { return d.y; })
					   .attr('text-anchor', 'middle')
					   .attr('dominant-baseline', 'text-before-edge')
					   .text(function(d) {
					   		if (d.commits !== 0) {
					   			var percentFmt = Math.round(d.commits / totalCommits * 100).toFixed(2);
					   			return percentFmt + '%';
					   		}
					   })
					   .style({
					   		'fill':'white',
					   		'font-size':'0.7em'
					   });
			});
d3.csv('sum_by_authors.csv', function(data) {

				var am = data.map(function(d) {
					return +d['A-M'];
				});

				var nz = data.map(function(d) {
					return +d['N-Z'];
				});

				var days = data.map(function(d) {
					return +d['day'];
				});

				var margin = {top: 30, right: 100, bottom: 50, left: 50},
					width = 870 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;

				// Set the domains and ranges
				var x = d3.scale.linear().range([0, width]);
				var y = d3.scale.linear().range([height, 0]);
				x.domain(d3.extent(data, function(d) { return +d['day']; }));
				y.domain([0, d3.max(data, function(d) { return Math.max(+d['A-M'], +d['N-Z']); })]);

				// Define the axes
				var xAxis = d3.svg.axis().scale(x)
										 .orient('bottom')
										 .ticks(30);
				var yAxis = d3.svg.axis().scale(y)
										 .orient('left')
										 .ticks(5);

				// Define a line
				var lineAM = d3.svg.line()
							 	   .x(function(d) { return x(d['day']); })
							 	   .y(function(d) { return y(d['A-M']); });
				var lineNZ = d3.svg.line()
								   .x(function(d) { return x(d['day']); })
							 	   .y(function(d) { return y(d['N-Z']); });

				// Draw the canvas
				var svg = d3.select('#objective3')
							.append('svg')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom)
							.append('g')
							.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

				// Draw the line
				svg.append('path')
				   .attr('class', 'line')
				   .attr('d', lineAM(data))
				   .style('fill', 'none')
				   .style('stroke', 'steelblue')
				   .style('stroke-width', 1.5);

				svg.append('path')
				   .attr('class', 'line')
				   .attr('d', lineNZ(data))
				   .style('fill', 'none')
				   .style('stroke', 'orangered')
				   .style('stroke-width', 1.5);


				// Draw the axes
				svg.append('g')
				   .attr('class', 'x-axis')
				   .attr('transform', 'translate(0,' + height + ')')
				   .style('font-size', '0.7em')
				   .call(xAxis)
				svg.append('g')
				   .attr('class', 'y-axis')	
				   .style('font-size', '0.7em')		   
				   .call(yAxis);

				// Draw legends
				var legendBlockSize = 12;
				var legendSpacing = 5;
				var headers = d3.keys(data[0]).slice(1, 3);
				var colors = ['steelblue', 'orangered'];

				var legend = svg.selectAll('.legend')
								.data(headers)
								.enter()
								.append('g')
								.attr('class', 'legend')
								.attr('transform', function(d, i) {
									var height = legendBlockSize + legendSpacing;
									var horz = 0;
									var vert = i * height;
									return 'translate(' + horz + ',' + vert + ')';
								});

				legend.append('rect')
					  .attr('width', legendBlockSize)
					  .attr('height', legendBlockSize)
					  .attr('x', width + 10)
					  .attr('y', 50)
					  .style('fill', function(d, i) {
					  		return colors[i];
					  })

				legend.append('text')
					  .attr('x', width + legendBlockSize + legendSpacing + 10)
					  .attr('y', 50 + legendBlockSize)
					  .text(function(d, i) {
					  		return headers[i] + ':';
					  })
					  .style('font-size', '0.8em')

				legend.append('text')
					  .attr('x', width + legendBlockSize + legendSpacing + 40)
					  .attr('y', 50 + legendBlockSize)
					  .attr('class', 'display-count')
					  .attr('visibility', 'hidden')
					  .text(0)
					  .style('font-size', '0.8em')
					  .style('fill', function(d, i) {
					  		return colors[i];
					  })

				legend.append('text')
					  .attr('x', width + 10)
					  .attr('y', 40)
					  .attr('class', 'display-day')
					  .attr('visibility', 'hidden')
					  .text(0)
					  .style('font-size', '0.8em')
					  .style('font-weight', 'bold')

				// Create axis labels
				svg.append('text')
					  .attr('x', width / 2)
					  .attr('y', height + 40)
					  .text('Date')
					  .style('text-anchor', 'middle')
					  .style('font-weight', 'bold')
					  .style('font-size', '0.7em') 

				svg.append('text')
					  .attr('x', 0)
					  .attr('y', -10)
					  .text('Commits')
					  .style('text-anchor', 'middle')
					  .style('font-weight', 'bold')
					  .style('font-size', '0.7em') 

				// Draw vertical line
				svg.append('line')
				   .style('stroke', 'black')
				   .style('opacity', 0.7)
				   .style('stroke-width', '1px')
				   .attr('class', 'mouse-line')
				   .attr('x1', 0)
				   .attr('y1', 0)
				   .attr('x2', 0)
				   .attr('y2', 320)

				d3.select('#objective3').on('mousemove', function() {
					var screenCoords = d3.mouse(this);
					var correctedXPos = screenCoords[0];
					if (correctedXPos <= 50) {
						correctedXPos = 50;
					}
					if (correctedXPos >= 770) {
						correctedXPos = 770;
					}
					correctedXPos -= margin.left;

					// Check the current mouse position, if the mouse position is
					// at any of the days +- a small margin, display the count
					// next to the legend
					var tickUnit = width / 30;
					var currentDay = Math.floor(correctedXPos / tickUnit);
					var errorMargin = 10;
					if ((correctedXPos % tickUnit == 0) || 
						(correctedXPos % tickUnit <= errorMargin)) {
						// Update the number of commits
						d3.selectAll('.display-count')
					      .text(function(d, i){
					      		return i == 0 ? am[currentDay] : nz[currentDay];
					      })
					  	  .attr('visibility', 'visible')
					  	// Update the displayed day
					  	d3.select('.display-day')
					  	  .text(currentDay + 1 + ' Jan 2016')
					  	  .attr('visibility', 'visible')
					} else if ((correctedXPos % tickUnit) >= (tickUnit - errorMargin)) {
						// Update the number of commits
						d3.selectAll('.display-count')
					      .text(function(d, i) {
					      		return i == 0 ? am[currentDay + 1] : nz[currentDay + 1];
					      })
					  	  .attr('visibility', 'visible')
					  	// Update the displayed day
					  	d3.select('.display-day')
					  	  .text(currentDay + 2 + ' Jan 2016')
					  	  .attr('visibility', 'visible')
					} else {
						d3.selectAll('.display-count')
					  	  .attr('visibility', 'hidden')
					  	// Hide the displayed day
					  	d3.select('.display-day')
					  	  .attr('visibility', 'hidden')
					}

					svg.select('.mouse-line')
					   .attr('x1', correctedXPos)
					   .attr('x2', correctedXPos);
				});
			});
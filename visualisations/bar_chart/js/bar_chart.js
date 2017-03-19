d3.csv('monthly_sums.csv', function(data) {
				// Read in the data
				var months = data.map(function(d) {
					return d.month;
				});
				var headers = d3.keys(data[0]);
				var additionData = data.map(function(d) {
					return +d.additions;
				});
				var deletionData = data.map(function(d) {
					return +d.deletions;
				});
				
				// ---------------------------------------------------
				// Create an inverted double bar graph showing additions
				// on the left and deletions on the right
				// ---------------------------------------------------

				var w = 1000;
				var h = 250;
				var reservedForHeader = 40;
				var reservedForMonth = 40;
				var reservedForLabels = 100;
				var gh = h - reservedForHeader;
				var padding = 2;
				var textPadding = 10;
				var labelSize = '0.7em';
				var numbersSize = '0.6em';

				var min = Math.min(Math.min(...additionData), Math.min(...deletionData));
				var max = Math.max(Math.max(...additionData), Math.max(...deletionData));
				var scale = d3.scale.linear()
									.domain([0, max])
									.range([0, ((w - reservedForMonth) / 2) - reservedForLabels]);

				var svg = d3.select('#objective2')
							.append('svg')
							.attr('width', w)
							.attr('height', h)

				// ---------------- MONTH LABELS ---------------------

				svg.selectAll('.textLabel')
					.data(months)
					.enter()
					.append('text')
					.text(function(d) {
						return d;
					})
					.attr('class', 'textLabel')
					// Style
					.style('text-transform', 'uppercase')
					.style('font-size', labelSize)
					.style('font-weight', 'bold')
					// Fixes alignment issues
					.attr('text-anchor', 'middle')
					.attr('dominant-baseline', 'central')
					// Positions text
					.attr('x', (w / 2))
					.attr('y', function(d, i) {
						return (i * (gh / additionData.length)) + ((gh / additionData.length - padding) / 2) + reservedForHeader;
					});

				svg.selectAll('.textLegend')
					.data(headers)
					.enter()
					.append('text')
					.text(function(d) {
						if (d === 'additions' || d === 'deletions') {
							return d;
						}
					})
					.attr('class', 'textLegend')
					// Style
					.style('text-transform', 'uppercase')
					.style('font-size', labelSize)
					.style('font-weight', 'bold')
					.style('fill', function(d) {
						return d === 'additions' ? 'green' : 'red';
					})
					// Fixes alignment issues
					.attr('text-anchor', function(d) {
						return d === 'additions' ? 'end' : 'start';
					})
					.attr('dominant-baseline', 'central')
					.attr('x', function(d) {
						return d === 'additions' ? (w / 2) - reservedForMonth : (w / 2) + reservedForMonth;
					})
					.attr('y', reservedForHeader / 2);

				// ---------------------------------------------------

				// ------------------ ADDITION -----------------------

				// Draw the bars for addition
				svg.selectAll('.rectAdd')
					.data(additionData)
					.enter()
					.append('rect')
					.attr('class', 'rectAdd')
					// Style
					.attr('fill', 'green')
					// Position of rects
					.attr('x', function(d) {
						return (w / 2) - reservedForMonth - scale(d);
					})
					.attr('y', function(d, i) {
						return (i * (gh / additionData.length)) + reservedForHeader;
					})
					// Size of rects
					.attr('width', function(d) {
						return scale(d);
					})
					.attr('height', (gh / additionData.length) - padding);

				/* Display the addition numbers as text
				svg.selectAll('.textAdd')
					.data(additionData)
					.enter()
					.append('text')
					.text(function(d) {
						return d;
					})
					.attr('class', 'textAdd')
					// Style
					.style('font-size', numbersSize)
					//.style('font-weight', 'bold')
					// Fixes alignment issues
					.attr('text-anchor', 'end')
					.attr('dominant-baseline', 'central')
					// Positions text
					.attr('x', function(d) {
						return (w / 2) - reservedForMonth - (scale(d)) - textPadding;
					})
					.attr('y', function(d, i) {
						return (i * (gh / additionData.length)) + ((gh / additionData.length - padding) / 2) + reservedForHeader;
					});
				*/

				// ---------------------------------------------------

				// ------------------ DELETION -----------------------

				// Draw the bars for deletion
				svg.selectAll('rectDel')
					.data(deletionData)
					.enter()
					.append('rect')
					.attr('class', 'rectDel')
					// Style
					.attr('fill', 'red')
					// Position of rects
					.attr('x', function(d) {
						return (w / 2) + reservedForMonth;
					})
					.attr('y', function(d, i) {
						return (i * (gh / deletionData.length)) + reservedForHeader;
					})
					// Size of rects
					.attr('width', function(d) {
						return scale(d);
					})
					.attr('height', (gh / additionData.length) - padding);

				/* Display the deletion numbers as text
				svg.selectAll('.textDel')
					.data(deletionData)
					.enter()
					.append('text')
					.text(function(d) {
						return d;
					})
					.attr('class', 'textDel')
					// Style
					.style('font-size', numbersSize)
					//.style('font-weight', 'bold')
					// Fixes alignment issues
					.attr('text-anchor', 'start')
					.attr('dominant-baseline', 'central')
					// Positions text
					.attr('x', function(d) {
						return (w / 2) + reservedForMonth + (scale(d)) + textPadding;
					})
					.attr('y', function(d, i) {
						return (i * (gh / deletionData.length)) + ((gh / deletionData.length - padding) / 2) + reservedForHeader;
					});
				*/

				// ---------------------------------------------------

				// --------------- MOUSE HANDLERS --------------------

				// Define the tooltip
				var toolTipAdd = d3.select('#objective2')
								   .append('div')
								   .attr('class', 'toolTipAdd')
								   .style('position', 'absolute')

				toolTipAdd.append('div')
						  .attr('class', 'label')

				d3.selectAll('.rectAdd').on('mouseover', function(d, i) {
					toolTipAdd.selectAll('.label')
							  .html(d + ' (+)');
					d3.selectAll('.rectAdd')[0][i].style.opacity = 0.7;

					toolTipAdd.style('visibility', 'visible')
							  .style('font-size', labelSize)

					var heightOfDiv = document.getElementsByClassName('label')[0].offsetHeight;
					var heightOfBar = gh / additionData.length - padding;
					var toolTipPosX = (w / 2) + reservedForMonth + (scale(d)) + textPadding;
					var toolTipPosY = reservedForHeader + i * (heightOfBar + padding) + ((heightOfBar / 2) - (heightOfDiv / 2)) - padding;

					toolTipAdd.style('right', toolTipPosX + 'px')
							  .style('top', toolTipPosY + 'px');
				});

				d3.selectAll('.rectAdd').on('mouseout', function(d, i) {
					d3.selectAll('.rectAdd')[0][i].style.opacity = 1;
					toolTipAdd.style('visibility', 'hidden');
				});

				// Mouse handler for delete
				var toolTipDel = d3.select('#objective2')
								   .append('div')
								   .attr('class', 'toolTipDel')
								   .style('position', 'absolute')

				toolTipDel.append('div')
						  .attr('class', 'label')

				d3.selectAll('.rectDel').on('mouseover', function(d, i) {
					toolTipDel.select('.label')
							  .html(d + ' (-)');
					d3.selectAll('.rectDel')[0][i].style.opacity = 0.7;

					toolTipDel.style('visibility', 'visible')
							  .style('font-size', labelSize)

					var heightOfDiv = document.getElementsByClassName('label')[1].offsetHeight;
					//console.log(heightOfDiv);
					var heightOfBar = gh / deletionData.length - padding;
					var toolTipPosX = (w / 2) + reservedForMonth + (scale(d)) + textPadding;
					var toolTipPosY = reservedForHeader + i * (heightOfBar + padding) + ((heightOfBar / 2) - (heightOfDiv / 2)) - padding;

					toolTipDel.style('left', toolTipPosX + 'px')
							  .style('top', toolTipPosY + 'px');
				});

				d3.selectAll('.rectDel').on('mouseout', function(d, i) {
					d3.selectAll('.rectDel')[0][i].style.opacity = 1;
					toolTipDel.style('visibility', 'hidden');
				});

				// Mouse handler for months
				d3.selectAll('.textLabel').on('mouseover', function(d, i) {
					// Show the line for add
					toolTipAdd.selectAll('.label')
							  .html(additionData[i] + ' (+)');
					d3.selectAll('.rectAdd')[0][i].style.opacity = 0.7;

					toolTipAdd.style('visibility', 'visible')
							  .style('font-size', labelSize)

					var heightOfDiv = document.getElementsByClassName('label')[0].offsetHeight;
					//console.log(heightOfDiv);
					var heightOfBar = gh / additionData.length - padding;
					var toolTipPosX = (w / 2) + reservedForMonth + (scale(additionData[i])) + textPadding;
					var toolTipPosY = reservedForHeader + i * (heightOfBar + padding) + ((heightOfBar / 2) - (heightOfDiv / 2)) - padding;

					toolTipAdd.style('right', toolTipPosX + 'px')
							  .style('top', toolTipPosY + 'px');

					// Show the line for delete as well
					toolTipDel.select('.label')
							  .html(deletionData[i] + ' (-)');
					d3.selectAll('.rectDel')[0][i].style.opacity = 0.7;

					toolTipDel.style('visibility', 'visible')
							  .style('font-size', labelSize)

					var heightOfDiv = document.getElementsByClassName('label')[1].offsetHeight;
					//console.log(heightOfDiv);
					var heightOfBar = gh / deletionData.length - padding;
					var toolTipPosX = (w / 2) + reservedForMonth + (scale(deletionData[i])) + textPadding;
					var toolTipPosY = reservedForHeader + i * (heightOfBar + padding) + ((heightOfBar / 2) - (heightOfDiv / 2)) - padding;

					toolTipDel.style('left', toolTipPosX + 'px')
							  .style('top', toolTipPosY + 'px');
				});

				d3.selectAll('.textLabel').on('mouseout', function(d, i) {
					// Hide the line for add
					d3.selectAll('.rectAdd')[0][i].style.opacity = 1;
					toolTipAdd.style('visibility', 'hidden');
					// Hide the line for delete
					d3.selectAll('.rectDel')[0][i].style.opacity = 1;
					toolTipDel.style('visibility', 'hidden');
				});

				// ---------------------------------------------------

			});
// -------------------------------------------------------------------------- //
//                              LINE GRAPHS                                   //
// -------------------------------------------------------------------------- //

function riskLine (svg, file, y_offset)
{
    var width  = document.getElementById("riskDiv").clientWidth * 0.9;
    var height = document.getElementById("riskDiv").clientHeight * 0.9 - y_offset;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, y_offset]);

	  // define the lines
    var inbag_path = d3.line()
      .x(function(d) { return x(d.index); })
      .y(function(d) { return y(d.inbag); });

    var oob_path = d3.line()
      .x(function(d) { return x(d.index); })
      .y(function(d) { return y(d.oob); });

    // Get the data
    d3.csv(file, function (error, data) {

    	if (error) throw error;

    	// format the data
    	data.forEach(function(d) {
    	  d.index = +d.index;
    	  d.inbag = +d.inbag;
    	});

    	// Scale the range of the data
    	x.domain(d3.extent(data, function(d) { return d.index; }));
    	y.domain([0, d3.max(data, function(d) { return d.inbag; })]);

    	// gridlines in x axis function
    	function make_x_gridlines() {		
    		return d3.axisBottom(x).ticks(5)
    	}

    	// gridlines in y axis function
    	function make_y_gridlines() {		
    		return d3.axisLeft(y).ticks(5)
    	}

    	// add the X gridlines
    	svg.append("g")			
    	  .attr("class", "grid")
    	  .attr("transform", "translate(0," + height + ")")
    	  .call(make_x_gridlines()
    	      .tickSize(-height + y_offset)
    	      .tickFormat("")
    	  )

    	// add the Y gridlines
    	svg.append("g")			
    	  .attr("class", "grid")
    	  .call(make_y_gridlines()
    	      .tickSize(-width)
    	      .tickFormat(""));

    	// define the area
    	var inbag_area = d3.area()
    	    .x(function(d) { return x(d.index); })
    	    .y0(height)
    	    .y1(function(d) { return y(d.inbag); });

	   var oob_area = d3.area()
    	    .x(function(d) { return x(d.index); })
    	    .y0(height)
    	    .y1(function(d) { return y(d.oob); });

    	// Add the valueline path.
    	svg.append("path")
    	  .data([data])
    	  .attr("class", "inbag_line")
    	  .attr("d", inbag_path);

    	svg.append("path")
    	  .data([data])
    	  .attr("class", "oob_line")
    	  .attr("d", oob_path);

    	// Add the X Axis
    	svg.append("g")
    	  .attr("transform", "translate(0," + height + ")")
    	  .attr("class", "axisWhite")
    	  .call(d3.axisBottom(x)
					.ticks(5));

    	// Add the Y Axis
    	svg.append("g")
    	  .attr("class", "axisWhite")
    	  .call(d3.axisLeft(y)
					.ticks(4));

			var input = 20;

			var trueMax = d3.max(data, function (d) { return d.index; });
			// console.log(trueMax);

			function drawArea (input) {
				var maxIdx = d3.max(data, function (d) { return input; });

		  	var lineData = function () {
					return [
				  	{ "x": maxIdx, "y": y_offset},
				  	{ "x": maxIdx, "y": height}
				  ];
		  	}

				var data_sel = data.filter(function (d) { return x(d.index) <= input; })

      	var lineFun = d3.line()
      	    .x(function (d) { return d.x; })
      	    .y(function (d) { return d.y; });

    		// add the area
    		svg.append("path")
    		    .data([data_sel])
    		    .attr("class", "inbag_area")
						.attr("id", "area")
    		    .attr("d", inbag_area);
						

				svg.append("path")
    		    .data([data_sel])
    		    .attr("class", "oob_area")
						.attr("id", "area")
    		    .attr("d", oob_area); 

				// Add the valueline path.
    		svg.append("path")
    		  .data([data_sel])
					.attr("id", "myline")
    		  .attr("class", "inbag_line_sel")
    		  .attr("d", inbag_path);
				
    		svg.append("path")
    		  .data([data_sel])
					.attr("id", "myline")
    		  .attr("class", "oob_line_sel")
    		  .attr("d", oob_path);

		  	// Add red line:
				svg.append("path")
				  .attr("id", "redLine")
      	  .attr("stroke", "rgb(139,0,0)")
      	  .attr("stroke-width", 6)
      	  .attr("fill", "none")
      	  .attr("d", lineFun(lineData()))			  
					/*
					.on("click", function () {
						d3.select(this)
							svg.selectAll("#area").remove();
							svg.selectAll("#redLine").remove();
							svg.selectAll("#myline").remove();
						  drawArea(20);
					})
					*/
					.call(d3.drag()
					  .on("start", function (d) { 
							d3.select(this).raise().classed("active", true); 
						})
					  .on("drag", function (d) { 

							svg.selectAll("#area").remove();
							svg.selectAll("#redLine").remove();
							svg.selectAll("#myline").remove();
							svg.selectAll("#mytext").remove();

							var myVar = d3.event.x;

							if (myVar < 0) { myVar = 0; }
							if (myVar > width) { myVar = width; }

							var trueVar = Math.trunc(myVar / width *  (trueMax - 1) + 1);
							
							drawArea(myVar); 
							/*
							console.log(myVar);
							console.log(maxIdx);
							console.log(width);
							*/
							svg.append("text")
								.text(trueVar)
								.attr("id", "mytext")
								.attr("x", myVar)
								.attr("y", y_offset - 4)
								.attr("fill", "white")
								.attr("font-size", "22px")
								.style("text-anchor", "middle");
					  })
						.on("end", function (d) { 

							// Update hexagon after mouse isn't dragged anymore
							var myVar = d3.event.x;

							if (myVar < 0) { myVar = 0; }
							if (myVar > width) { myVar = width; }

							var trueVar = Math.trunc(myVar / width *  (trueMax - 1) + 1);

							svg.append("text")
								.text(trueVar)
								.attr("id", "mytext")
								.attr("x", width)
								.attr("y", y_offset - 4)
								.attr("fill", "white")
								.attr("font-size", "22px")
								.style("text-anchor", "middle");

							d3.select(this).classed("active", false); 
						}));
			} // drawArea

			drawArea(width);

	}); // d3.csv
}
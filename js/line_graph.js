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

    	// add the area
    	svg.append("path")
    	    .data([data])
    	    .attr("class", "inbag_area")
    	    .attr("d", inbag_area); 

		svg.append("path")
    	    .data([data])
    	    .attr("class", "oob_area")
    	    .attr("d", oob_area); 

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
    	  .call(d3.axisBottom(x));

    	// Add the Y Axis
    	svg.append("g")
    	  .attr("class", "axisWhite")
    	  .call(d3.axisLeft(y));
	  
	}); // d3.csv
}
// -------------------------------------------------------------------------- //
//                                HEXAGON                                     //
// -------------------------------------------------------------------------- //

var _s32 = (Math.sqrt(3)/2);

// @description Count how often an element occurs in an array:
//
// @param array [array]
//   Array with elements.
// @param what [arbitrary(1)]
//   The element which should be counted.
function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

// @description Function to get hexagon data for specific x, y and radius
//
// @param x [numeric(1)]
//   x coordinate of the center of the hexagon.
// @param y [numeric(1)]
//   y coordinate of the center of the hexagon.
// @param r [numeric(1)]
//   Radius of the hexagon. The points of the hexagon data are on the circle of this radius.
function hexagonData (x, y, r)
{
    return [ { "x": r + x,     "y": 0 + y         }, 
             { "x": r/2 + x,   "y": r * _s32 + y  }, 
             { "x": - r/2 + x, "y": r * _s32 + y  }, 
             { "x": - r + x,   "y": 0 + y         },   
             { "x": - r/2 + x, "y": -r * _s32 + y }, 
             { "x": r/2 + x,   "y": -r * _s32 + y },
             { "x": r + x,     "y": 0 + y         } ];
}

// @description Global line function.
var lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

// @description Remove effect window after clicking on a hexagon.
function removeEffectWindow() {
    // document.getElementById("overlay").setAttribute("style", "");                
    var element = document.getElementById("overlay")
    element.outerHTML = "";
    element.innerHTML = "";
    delete element;
    // document.getElementById("demo").innerHTML = "Hello World";
}

// @description Actual plotting function which draw lines between hexagon data points
//
// @param svg 
//   Scalable vector graphics (svg) to append the hexagon on.
// @param fill [character(1)]
//   Color of the inner hexagon.
// @param stroke [character(1)]
//   Color of the edge of the hexagon.
// @param x [numeric(1)]
//   x coordinate of the center of the hexagon.
// @param y [numeric(1)]
//   y coordinate of the center of the hexagon.
// @param r [numeric(1)]
//   Radius of the hexagon. The points of the hexagon data are on the circle of this radius.
// @param fill_hover [character(1)]
//   Color of the inner hexagon while hovering over it.
// @param stroke_hover [character(1)]
//   Color of the edge of the hexagon while hovering over it. 
// @param x_init [numeric(1)]
//   Inital x coordinate from which the transition starts.
// @param y_init [numeric(1)]
//   Inital y coordinate from which the transition starts.
// @param transition_duration [numeric(1)]
//   Duration of the transition. 
// @param hover_info [character(1)]
//   Info which occurs if mouse hovers over hexagon.
function hexagon (svg, fill, stroke, x, y, r, fill_hover, stroke_hover, x_init, y_init, r_init,
    transition_duration, hover_info = "", delay = 0, file_path = "", ggtext)
{
    var tooltip = d3.select("body")
	    .append("div")
        .attr("id", "tooltip")
	    .style("position", "absolute")
	    .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "4px")
        .style("font-size", "18px");

    tooltip
        .append("p")
        .style("padding-left", "10px")
        .style("padding-right", "10px")
        .text(hover_info[0]);

    tooltip
        .append("p")
        .style("padding-left", "10px")
        .style("padding-right", "10px")
        .text(hover_info[1]);


    var hexagon = svg.append("path")
        .attr("d", lineFunction(hexagonData(x_init, y_init, r_init)))
        .attr("stroke", stroke)
        .attr("stroke-width", 2)
        .attr("fill", fill)
        .attr("id", "myhexs")
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("fill", fill_hover)
                .attr("stroke", stroke_hover);

            tooltip.style("visibility", "visible");
        })        
        .on("mousemove", function() {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("fill", fill)
                .attr("stroke", stroke);

            tooltip.style("visibility", "hidden");
            d3.selectAll("tooltip").remove();
        })
        .on("click", function() {
            if (document.getElementById("overlay")) {
                var element = document.getElementById("overlay")
                element.outerHTML = "";
                element.innerHTML = "";

                delete element;
            }            

            var element = document.createElement("div");
                element.innerHTML = '<div id="overlay"><button onclick="removeEffectWindow()">Hide Effect</button></div>';
                element.style.position = "absolute";
                element.style.left = x + 'px';
                element.style.top = y + 'px';
                document.getElementById('mainPanel').appendChild(element);

            d3.select("#overlay").append("text")
                .text(ggtext)
                .attr("x", 00)
                .attr("y", 20)
                .style("color", "white")
                .style("font-family", "Consolas")
                .style("font-size", "14px");

            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var button_height = 80;

            var width_ov  = document.getElementById("overlay").clientWidth - margin.left - margin.right;
            var height_ov = document.getElementById("overlay").clientHeight - margin.top - margin.bottom - button_height;

            var svg_ov = d3.select("#overlay")
              .append("svg")
                .attr("width", width_ov + margin.left + margin.right)
                .attr("height", height_ov + margin.top + margin.bottom)
              .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

            // set the ranges
            var xo = d3.scaleLinear().range([0, width_ov]);
            var yo = d3.scaleLinear().range([height_ov, 0]);

	        // define the lines
            var effect_path = d3.line()
              .x(function(d) { return xo(d.x); })
              .y(function(d) { return yo(d.y); });

            // var effect_file = file_path + "/effect.csv";

             // Get the data
             d3.csv(file_path, function (error, mydata) {
             
    	        if (error) throw error;

                mydata.forEach(function(d) {
    	          d.x = +d.x;
    	          d.y = +d.y;
    	        });

                var min = d3.min(mydata, function(d) { return d.y; });
                var max = d3.max(mydata, function(d) { return d.y; });
                var range = max - min;
                /*
                console.log(min);
                console.log(max);
                console.log(mydata);
                */     
    	        // Scale the range of the data
    	        xo.domain( d3.extent(mydata, function (d) { return d.x; }) );
    	        yo.domain( [min - range * 0.05, max + range * 0.05] )
                // yo.domain( d3.extent(mydata, function (d) { return d.y; }) );
            
    	        // gridlines in x axis function
    	        function make_x_gridlines() {		
    	        	return d3.axisBottom(xo).ticks(5)
    	        }
            
    	        // gridlines in y axis function
    	        function make_y_gridlines() {		
    	        	return d3.axisLeft(yo).ticks(5)
    	        }
    	        // add the X gridlines
    	        svg_ov.append("g")			
    	          .attr("class", "grid")
    	          .attr("transform", "translate(0," + height_ov + ")")
    	          .call(make_x_gridlines()
    	              .tickSize(-height_ov)
    	              .tickFormat("")
    	          )
            
    	        // add the Y gridlines
    	        svg_ov.append("g")			
    	          .attr("class", "grid")
    	          .call(make_y_gridlines()
    	              .tickSize(-width_ov)
    	              .tickFormat(""));

                // Add the X Axis
    	        svg_ov.append("g")
    	          .attr("transform", "translate(0," + height_ov + ")")
    	          .attr("class", "axisWhite")
    	          .call(d3.axisBottom(xo)
		        			.ticks(5));
                        
    	        // Add the Y Axis
    	        svg_ov.append("g")
    	          .attr("class", "axisWhite")
    	          .call(d3.axisLeft(yo)
		        			.ticks(4));

                svg_ov.append("path")
    		        .data([mydata])
    		        .attr("class", "effect_line")
    		        .attr("d", effect_path);                
             });
        });

    hexagon
        .transition()
        .duration(transition_duration)
        .attr("d", lineFunction(hexagonData(x, y, r))).delay(delay);

    return hexagon;
}

// @description Draw a set of hexagon specified within the hexagon centers object.
//
// @param svg 
//   svg element on which to append the hexagons.
// @param hexagon_centers [object]
//   The object which contains all the necessary data to plot the set.
// @param transition_duration [integer(1)]
//   Duration of the transition in milliseconds.
// @param file_path [character(1)]
//   Path to the folder which contains the data created by R.
function drawHexagons (svg, hexagon_centers, transition_duration = 1000, file_path = "", current_iter) 
{
    var file_path_temp = file_path;
    // Append hexagons and text by iterating over all elements:
    for (i = 0; i < hexagon_centers.length; i++) { 
        var effect_name = hexagon_centers[i]["blearner"].split(' ').join('');
        // console.log(effect_name);
        var effect_file = file_path_temp + "/effects/" + effect_name + ".csv"
        hexagon (
            svg    = svg,
            fill   = hexagon_centers[i]["fill"] + "0.7)", 
            stroke = "black", 
            x      = hexagon_centers[i]["x"], 
            y      = hexagon_centers[i]["y"], 
            r      = hexagon_centers[i]["radius"], 
            fill_hover   = hexagon_centers[i]["fill"] + "1)", 
            stroke_hover = "black", 
            x_init       = hexagon_centers[i]["x_init"],
            y_init       = hexagon_centers[i]["y_init"],
            r_init       = hexagon_centers[i]["radius_init"],
            transition_duration = transition_duration,
            hover_info = [ "Base-learner: " + hexagon_centers[i]["blearner"], 
                           "Selected " + hexagon_centers[i]["count"] + " times" ],
            delay = 70 * i,		
            file_path = effect_file,
            ggtext = "plot(cboost, learner = \"" + hexagon_centers[i]["blearner"] + "\", at = " + current_iter + ")"
        );
       svg.append("text")
            .text(hexagon_centers[i]["text_init"])
            .attr("x", hexagon_centers[i]["x_init"])
            .attr("y", hexagon_centers[i]["y_init"] + Math.trunc(hexagon_centers[i]["radius_init"])/3)
            .style("fill", "white")
            .style("font-family", "Century Gothic")
            .style("font-size", Math.trunc(hexagon_centers[i]["radius_init"]) + "px")
            .style("text-anchor", "middle")
            .transition()
            .duration(transition_duration)
            .attr("x", hexagon_centers[i]["x"])
            .attr("y", hexagon_centers[i]["y"] + Math.trunc(hexagon_centers[i]["radius"])/3)
            .style("font-size", Math.trunc(hexagon_centers[i]["radius"]) + "px")
            .attr("id", "myhexs")
            .text(hexagon_centers[i]["text"])
            .delay(70 * i);
    }
}

// @description Create new hexagons depending on a given array of base-learner and old state.
//
// @param svg 
//   svg element on which to append the hexagons.
// @param blearner [array]
//   Array which contains all base-learner.
// @param max_learner [integer(1)]
//   Maximal index of how much base-learner should be considered.
// @param hexagon_centers_old [array]
//   Array with old hexagon centers data.
function hexCenters (svg, blearner, max_learner, hexagon_centers_old) 
{
    // Empty array to store the base-learner and the count of their occurence:
    var unique_blearner = [];
    
    // Craete empty hash map for the base-learner (each has count 0):
    for (i = 0; i < blearner.length; i++) {
        unique_blearner[ blearner[i] ] = { count: 0, learner: blearner[i] };
    }
    // Count how often a base-learner occurs:
    for (i = 0; i < max_learner; i++) {
        unique_blearner[ blearner[i] ] = { count: unique_blearner[blearner[i]]["count"] + 1, learner: blearner[i] };
    }    
   
    // Character array of all unique base-learners: 
    var keys = Object.keys(unique_blearner);
    
    // Create array of counts per key and also a sorted array to get the order:
    var counts = [];
    var counts_sort = [];
    for (i = 0; i < keys.length; i++) {
        counts.push(unique_blearner[keys[i]]["count"]);
        counts_sort.push(unique_blearner[keys[i]]["count"]);
    }
    // Sort the counts in decreasing order:
    counts_sort.sort(function(a, b){return b-a});

    // Get order by matching sorted array with unsorted array. This loop
    // just takes the first index on which an element is. Hence, there are
    // some duplicates:
    var order = [];
    for (i = 0; i < counts.length; i++) {
        order.push(counts_sort.findIndex(x => x == counts[i]));
    }    
    // This loop completes the order by taking each duplicate and increases
    // this by one until all duplicates are removed:
    for (i = 0; i < order.length; i++) {
        idx = order[i];
        ct = countInArray(order, idx);
        var k = 1;
        var c = 1;
        // Increase the elements by c to avoid duplicates. This happens
        // by iterating over all elements after idx and incrementing 
        // that one which are equal to idx by c which is then also
        // increased:
        while (ct > 1) {
            var temp = order[i + k];
            if (temp == idx) {
                order[i + k] = idx + c;
                c = c + 1;
                ct = ct - 1;
            }
            k = k + 1;
        }
    }

    // Frame for hexagon centers:
    var hexagon_centers = [];
    var r;
    var r_init;

    for (i = 0; i < keys.length; i++) {
        
        var actual_key = hexagon_centers_old[i]["blearner"];
        var idx_key = keys.findIndex(x => x==actual_key);


        if (counts[idx_key] == 0) {
            r = 0;
        } else {
            r = coord_init[order[idx_key]]["radius"];
        }

        if (hexagon_centers_old[i]["count"] == 0) {
            r_init = 0;
        } else {
            r_init = hexagon_centers_old[i]["radius"];
        }
        

        hexagon_centers.push(
            {
                "x": coord_init[order[idx_key]]["x"],
                "y": coord_init[order[idx_key]]["y"],
                "radius": r,
                "fill": hexagon_centers_old[i]["fill"],
                "x_init": hexagon_centers_old[i]["x"],
                "y_init": hexagon_centers_old[i]["y"],
                "radius_init": r_init,
                "blearner": actual_key,
                "count": counts[idx_key],
                "text": hexagon_centers_old[i]["text"],
                "text_init": hexagon_centers_old[i]["text"]
            }
        );

    }
    drawHexagons(svg, hexagon_centers, 1000, "plot_data", max_learner);
    
    return hexagon_centers;
}

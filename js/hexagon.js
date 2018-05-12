// -------------------------------------------------------------------------- //
//                                HEXAGON                                     //
// -------------------------------------------------------------------------- //

var _s32 = (Math.sqrt(3)/2);

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

var lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

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
    transition_duration, hover_info = "", delay = 0)
{
    var tooltip = d3.select("body")
	    .append("div")
	    .style("position", "absolute")
	    .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.6)")
        .style("color", "white")
        .style("padding", "4px")
	    .text(hover_info);

    var hexagon = svg.append("path")
        .attr("d", lineFunction(hexagonData(x_init, y_init, r_init)))
        .attr("stroke", stroke)
        .attr("stroke-width", 2)
        .attr("fill", fill)
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
                .text("ggplot(blabla)")
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

             // Get the data
             d3.csv("../plot_data/effect.csv", function (error, mydata) {
             
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
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
function hexagon (svg, fill, stroke, x, y, r, fill_hover, stroke_hover, x_init, y_init, 
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
        .attr("d", lineFunction(hexagonData(x_init, y_init, r)))
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
        });

    hexagon
        .transition()
        .duration(transition_duration)
        .attr("d", lineFunction(hexagonData(x, y, r))).delay(delay);
    return hexagon;
}
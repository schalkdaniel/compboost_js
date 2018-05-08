function exampleViz()
{
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", 400)
        .attr("height", 700)

    var circle = svg
        .append("circle")
        .attr("cx", 100)
        .attr("cy", 100)
        .attr("r", 100)
        .attr("fill", "rgba(255, 0, 0, 0.5");

    var _s32 = (Math.sqrt(3)/2);

    // -------------------------------------------------------------------------- //
    //                                  TEXT                                      //
    // -------------------------------------------------------------------------- //    

    function textOutput (x, y, text, font_size, anchor, x_init)
    {
        var text_out = svg.append("text")
            .text(text)
            .attr("x", x_init)
            .attr("y", y)
            .style("fill", "white")
            .style("font-family", "Century Gothic")
            .style("font-size", font_size + "px")
            .style("text-anchor", anchor);

        text_out.transition()
            .duration(1000)
            .attr("x", x);

        return text_out;
    }

    // -------------------------------------------------------------------------- //
    //                                HEXAGON                                     //
    // -------------------------------------------------------------------------- //

    // Function to get hexagon data for specific x, y and "radius":
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

    function drawHexagon (fill, stroke, x, y, r, fill_hover, stroke_hover, x_init)
    {
        var hexagon = svg.append("path")
            .attr("d", lineFunction(hexagonData(x_init, y, r)))
            .attr("stroke", stroke)
            .attr("stroke-width", 2)
            .attr("fill", fill)
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill", fill_hover)
                    .attr("stroke", stroke_hover);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("fill", fill)
                    .attr("stroke", stroke);
            });

        hexagon
            .transition()
            .duration(1000)
            .attr("d", lineFunction(hexagonData(x, y, r)));

        return hexagon;
    }

    // -------------------------------------------------------------------------- //
    //                             COLOR GRADIENT                                 //
    // -------------------------------------------------------------------------- //

    var defs = svg.append("defs");
    linearGradient = function (col1, col2, opacity, id) {
        var gradient = defs.append("linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%");
        
        gradient.append("stop")
           .attr('class', 'start')
           .attr("offset", "0%")
           .attr("stop-color", col1)
           .attr("stop-opacity", opacity);
        
        gradient.append("stop")
           .attr('class', 'end')
           .attr("offset", "100%")
           .attr("stop-color", col2)
           .attr("stop-opacity", opacity);
        
        return gradient;
    }

    // -------------------------------------------------------------------------- //
    //                                EXMPLES                                     //
    // -------------------------------------------------------------------------- //

    var hexagon_radius = 25;
    var text_size = 18;

    var myBlueGradient  = linearGradient("rgb(122, 197, 205)", "#009ACD", 0.4, "blueGradient");
    var myGreenGradient = linearGradient("#CAFF70", "#6E8B3D", 0.4, "greenGradient");
    
    // var data = hexagonData(100, 100, 100);

    // Draw one hexagon with generic function:
    svg.append("path")
            // .data(data)
            // .attr("d", lineFunction)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "url(#blueGradient)")
            .attr("d", lineFunction(hexagonData(100, 100, 100)));

    drawHexagon ("red", "blue", 100, 100, 20, "blue", "red", 100);

    // Draw multiple hexagons with drawHexagon function and add title::
    hexagonCenter = [ { "x": 100,                            "y": 400, "text": "Var1" },
                      { "x": 100 + 2 * (hexagon_radius + 5), "y": 400, "text": "Var2" },
                      { "x": 100 + 4 * (hexagon_radius + 5), "y": 400, "text": "Var3" },
                      { "x": 100 + 6 * (hexagon_radius + 5), "y": 400, "text": "Var4" } ];

    hexagonColors = [ { "fill": "blueGradient" , "stroke": "#7EC0EE", "fill_hover": "rgba(122, 197, 205, 0.5)", "stroke_hover": "#BBFFFF" },
                      { "fill": "greenGradient", "stroke": "#A2CD5A", "fill_hover": "rgba(202, 255, 112, 0.5)", "stroke_hover": "#008000" },
                      { "fill": "blueGradient" , "stroke": "#7EC0EE", "fill_hover": "rgba(122, 197, 205, 0.5)", "stroke_hover": "#BBFFFF" },
                      { "fill": "greenGradient", "stroke": "#A2CD5A", "fill_hover": "rgba(202, 255, 112, 0.5)", "stroke_hover": "#008000" } ]

    for (j = 0; j < 3; j++) {
        textOutput (
            x         = hexagonCenter[0]["x"] - hexagon_radius, 
            y         = hexagonCenter[0]["y"] - (hexagon_radius + 5) + j*100, 
            text      = "Example Text:", 
            font_size = text_size, 
            anchor    = "start", 
            x_init    = hexagonCenter[0]["x"] - hexagon_radius
        );
        for (i = 0; i < hexagonCenter.length - j; i++) { 

            drawHexagon (
                fill   = "url(#" + hexagonColors[j]["fill"] + ")", 
                stroke = hexagonColors[j]["stroke"], 
                x      = hexagonCenter[i]["x"], 
                y      = hexagonCenter[i]["y"] + j*100, 
                r      = hexagon_radius, 
                fill_hover   = hexagonColors[j]["fill_hover"], 
                stroke_hover = hexagonColors[j]["stroke_hover"], 
                x_init       = hexagonCenter[0]["x"]
            );
            textOutput (
                x         = hexagonCenter[i]["x"], 
                y         = hexagonCenter[i]["y"] + 4 + j*100, 
                text      = hexagonCenter[i]["text"], 
                font_size = 12, 
                anchor    = "middle", 
                x_init    = hexagonCenter[0]["x"]);

        }   
    }
}
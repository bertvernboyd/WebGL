"use strict";

var canvas;
var gl;
var points = [];
var numTimesToSubdivide;
var v = 0.5;
var theta;
var thetaLoc;
var vertices;

window.onload = function init()
{
    vertices = [
      vec2( -v, -v ),
      vec2(  0,  v ),
      vec2(  v, -v )
    ];

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    // event handlers

    numTimesToSubdivide = document.getElementById("rec_slider").value;
    document.getElementById("rec_slider").onchange = function() {
      numTimesToSubdivide = event.srcElement.value;
      render();
    };
    theta = document.getElementById("twist_slider").value;
    document.getElementById("twist_slider").onchange = function() {
      theta = event.srcElement.value;
      render();
    };

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function lines( a, b, c )
{
    points.push( a, b );
    points.push( b, c );
    points.push( c, a );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        //triangle( a, b, c );
        lines( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // four new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ab, ac, bc, count );
    }
}

function render()
{
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2], numTimesToSubdivide);
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f(thetaLoc, theta);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES, 0, points.length );
    points = [];
}

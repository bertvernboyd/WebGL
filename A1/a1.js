"use strict";

var canvas;
var gl;
var points = [];
var numTimesToSubdivide;
var v = 0.5;
var theta;
var thetaLoc;
var vertices;
var primatives;
var holes;
var shape;
var remesh;

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    remesh = true;
    
    numTimesToSubdivide = document.getElementById("recursion_slider").value;
    document.getElementById("recursion_slider").onchange = function() {
      numTimesToSubdivide = event.srcElement.value;
      remesh = true;
      render();
    };
    theta = document.getElementById("twist_slider").value;
    document.getElementById("twist_slider").onchange = function() {
      theta = event.srcElement.value;
      render();
    };
    primatives = gl.TRIANGLES
    document.getElementById("primatives_triangles_radio").onchange = function() {
      primatives = gl.TRIANGLES
      remesh = true;
      render();
    }
    document.getElementById("primatives_lines_radio").onchange = function() {
      primatives = gl.LINES
      remesh = true;
      render();
    }

    shape = "triangle";
    document.getElementById("shapes_triangle_radio").onchange = function() {
      if(shape != "triangle" || holes){
        shape = "triangle";
        holes = false;
        remesh = true;
      }
      render();
    }
    document.getElementById("shapes_sierpinski_triangle_radio").onchange = function() {
      if(shape != "triangle" || !holes){
        shape = "triangle";
        holes = true;
        remesh = true;
      }
      render();
    }
    document.getElementById("shapes_square_radio").onchange = function() {
      if(shape != "square" || holes){
        shape = "square";
        holes = false;
        remesh = true;
      }
      render();
    }
    document.getElementById("shapes_sierpinski_square_radio").onchange = function() {
      if(shape != "square" || !holes){
        shape = "square";
        holes = true;
        remesh = true;
      }
      render();
    }
    
    render();
};

function triangle3( a, b, c )
{
    points.push( a, b, c );
}

function lines3( a, b, c )
{
    points.push( a, b );
    points.push( b, c );
    points.push( c, a );
}

function triangle4( a, b, c, d )
{
  points.push( a, b, c );
  points.push( c, a, d );
}

function lines4( a, b, c, d )
{
  points.push( a, b );
  points.push( b, c );
  points.push( c, d );
  points.push( d, a );
}

function divideTriangle( a, b, c, count )
{
    if ( count == 0 ) {
        if(primatives === gl.TRIANGLES){
          triangle3( a, b, c );
        }
        else if(primatives === gl.LINES){
          lines3( a, b, c );
        }
    }
    else {

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        if(!holes){
          divideTriangle( ab, ac, bc, count );
        } 
    }
}

function divideSquare( a, b, c, d, count )
{
    if ( count == 0 ) {
        if(primatives === gl.TRIANGLES){
          triangle4( a, b, c, d );
        }
        else if(primatives === gl.LINES){
          lines4( a, b, c, d );
        }
    }
    else{
      var s = 2.0/3.0;
      var aab = mix( a, b, s);
      var bba = mix( b, a, s);
      var bbc = mix( b, c, s);
      var ccb = mix( c, b, s);
      var ccd = mix( c, d, s);
      var ddc = mix( d, c, s);
      var dda = mix( d, a, s);
      var aad = mix( a, d, s);
      
      var aac = mix( a, c, s);
      var bbd = mix( b, d, s);
      var cca = mix( c, a, s);
      var ddb = mix( d, b, s);

      --count;

      divideSquare(a, aab, aac, aad, count);
      divideSquare(aab, bba, bbd, aac, count);
      divideSquare(b, bbc, bbd, bba, count);
      divideSquare(bbc, ccb, cca, bbd, count);
      divideSquare(c, ccd, cca, ccb, count);
      divideSquare(ccd, ddc, ddb, cca, count); 
      divideSquare(d, dda, ddb, ddc, count);
      divideSquare(dda, aad, aac, ddb, count);
      if(!holes)
      {
        divideSquare(aac, bbd, cca, ddb, count);
      }
  }
}

function render()
{
    if(shape === "triangle" && remesh){
      vertices = [
        vec2( -v, -v ),
        vec2(  0,  v ),
        vec2(  v, -v )
      ];
      points = [];
      divideTriangle( vertices[0], vertices[1], vertices[2], numTimesToSubdivide);
    }
    else if(shape === "square" && remesh){
      vertices = [
        vec2( -v, -v ),
        vec2( -v,  v ),
        vec2(  v,  v ),
        vec2(  v, -v )
      ];
      points = [];
      divideSquare( vertices[0], vertices[1], vertices[2], vertices[3], numTimesToSubdivide);
    }

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f(thetaLoc, theta);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.drawArrays( primatives, 0, points.length );
    remesh = false;
}

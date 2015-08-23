"use strict";

var BLACK = [ 0.0, 0.0, 0.0, 1.0 ];
var WHITE = [ 1.0, 1.0, 1.0, 1.0 ];

var gl;
var cyl_points = [];
var data;

window.onload = function init()
{
  var canvas = $( "#gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas[0] );
  if (! gl ) { alert( "WebGL isn't available" ); }
  gl.viewport( 0, 0, canvas.width(), canvas.height() );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  gl.enable( gl.DEPTH_TEST );
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program ); 

  data = to_gl_data( cyl_vtx(), cyl_tri_indx(), cyl_quad_indx() );
 
  console.log(data[0].length);
 
  var v_buf = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, v_buf );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(data[0]), gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition ); 

  //var c_buf = gl.createBuffer();
  //gl.bindBuffer( gl.ARRAY_BUFFER, c_buf );
  //gl.bufferData( gl.ARRAY_BUFFER, data[1], gl.STATIC_DRAW );

  //var vColor = gl.getAttribLocation( program, "vColor" );
  //gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  //gl.enableVertexAttribArray( vColor );

  render();
};

var v_cyl_buf;
var c_cyl_buf;

function cyl_vtx() {
  return [
    vec3(  0.00000,  0.00000,  1.00000 ),
    vec3(  0.00000,  1.00000,  1.00000 ),
    vec3(  0.38268,  0.92388,  1.00000 ),
    vec3(  0.70711,  0.70711,  1.00000 ),
    vec3(  0.92388,  0.38268,  1.00000 ),
    vec3(  1.00000,  0.00000,  1.00000 ),
    vec3(  0.92388, -0.38268,  1.00000 ),
    vec3(  0.70711, -0.70711,  1.00000 ),
    vec3(  0.38268, -0.92388,  1.00000 ),
    vec3(  0.00000, -1.00000,  1.00000 ),
    vec3( -0.38268, -0.92388,  1.00000 ),
    vec3( -0.70711, -0.70711,  1.00000 ),
    vec3( -0.92388, -0.38268,  1.00000 ),
    vec3( -1.00000,  0.00000,  1.00000 ),
    vec3( -0.92388,  0.38268,  1.00000 ),
    vec3( -0.70711,  0.70711,  1.00000 ),
    vec3( -0.38268,  0.92388,  1.00000 ),
    vec3(  0.00000,  0.00000, -1.00000 ),
    vec3(  0.00000,  1.00000, -1.00000 ),
    vec3(  0.38268,  0.92388, -1.00000 ),
    vec3(  0.70711,  0.70711, -1.00000 ),
    vec3(  0.92388,  0.38268, -1.00000 ),
    vec3(  1.00000,  0.00000, -1.00000 ),
    vec3(  0.92388, -0.38268, -1.00000 ),
    vec3(  0.70711, -0.70711, -1.00000 ),
    vec3(  0.38268, -0.92388, -1.00000 ),
    vec3(  0.00000, -1.00000, -1.00000 ),
    vec3( -0.38268, -0.92388, -1.00000 ),
    vec3( -0.70711, -0.70711, -1.00000 ),
    vec3( -0.92388, -0.38268, -1.00000 ),
    vec3( -1.00000,  0.00000, -1.00000 ),
    vec3( -0.92388,  0.38268, -1.00000 ),
    vec3( -0.70711,  0.70711, -1.00000 ),
    vec3( -0.38268,  0.92388, -1.00000 )
  ];
}

function cyl_tri_indx() {
  return [
     0,  1,  2,  0,  2,  3,  0,  3,  4,  0,  4,  5,
     0,  5,  6,  0,  6,  7,  0,  7,  8,  0,  8,  9,
     0,  9, 10,  0, 10, 11,  0, 11, 12,  0, 12, 13,
     0, 13, 14,  0, 14, 15,  0, 15, 16,  0, 16,  1,
    17, 18, 19, 17, 19, 20, 17, 20, 21, 17, 21, 22,
    17, 22, 23, 17, 23, 24, 17, 24, 25, 17, 25, 26,
    17, 26, 27, 17, 27, 28, 17, 28, 29, 17, 29, 30,
    17, 30, 31, 17, 31, 32, 17, 32, 33, 17, 33, 18
  ];
}

function cyl_quad_indx() {
  return [
     1,  2, 18, 19,  2,  3, 19, 20,  3,  4, 20, 21,
     4,  5, 21, 22,  5,  6, 22, 23,  6,  7, 23, 24,
     7,  8, 24, 25,  8,  9, 25, 26,  9, 10, 26, 27,
    10, 11, 27, 28, 11, 12, 28, 29, 12, 13, 29, 30,
    13, 14, 30, 31, 14, 15, 31, 32, 15, 16, 32, 33,
    16,  1, 33, 18
  ];
}

function to_gl_data(vtx, tri_indx, quad_indx){
  if( ( tri_indx.length % 3 ) != 0 ) {
    alert( " tri_indx.length must be divisible by 3 ");
    return;
  }
  if( ( quad_indx.length % 4 ) != 0 ) {
    alert( " quad_indx.length must be divisible by 4 ");
    return;
  }
  var points = [];
  var colors = [];
  for( var i = 0; i < tri_indx.length; i += 3){
    points.push( vtx[ tri_indx [ i ] ], vtx[ tri_indx [ i+1 ] ], vtx[ tri_indx [ i+2 ] ] );
    //colors.push( BLACK, BLACK, BLACK );     
  }
  for( var i = 0; i < quad_indx.length; i += 4){
    points.push( vtx[ quad_indx [ i ] ], vtx[ quad_indx [ i+1 ] ], vtx[ quad_indx [ i+2 ] ] );
    points.push( vtx[ quad_indx [ i ] ], vtx[ quad_indx [ i+2 ] ], vtx[ quad_indx [ i+3 ] ] );
    //colors.push( BLACK, BLACK, BLACK, BLACK, BLACK, BLACK );
  }
  return [points, colors]; 
}

function render() {
  window.requestAnimFrame( render );
  gl.clear( gl.COLOR_BUFFER_BIT );
 
  gl.drawArrays( gl.TRIANGLES, 0, data[0].length ); 
}

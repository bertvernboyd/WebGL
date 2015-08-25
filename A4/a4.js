"use strict";

var MAGENTA = vec4( 1.0, 0.0, 1.0, 1.0 );
var RED     = vec4( 1.0, 0.0, 0.0, 1.0 );
var YELLOW  = vec4( 1.0, 1.0, 0.0, 1.0 );
var GREEN   = vec4( 0.0, 1.0, 0.0, 1.0 );
var CYAN    = vec4( 0.0, 1.0, 1.0, 1.0 );
var BLUE    = vec4( 0.0, 0.0, 1.0, 1.0 );
var BLACK   = vec4( 0.0, 0.0, 0.0, 1.0 );
var WHITE   = vec4( 1.0, 1.0, 1.0, 1.0 );

var N_MODELS = 4;

var gl;
var vtx_buf = [];
var color_buf = []; 
var data = [];

var tx = 0.5;
var sc = 0.2;
var theta = [ [ 0, 0, 0 ], [ -90, 0, 0 ], [ 45, -45, 0 ], [ 0, 0, 0 ] ];
var trans = [ [ -tx,  tx, 0, 0 ], [ -tx, -tx, 0, 0 ], [ tx,  tx, 0, 0 ], [ tx, -0.5, 0, 0 ] ];
var scale = [ [ sc, sc, sc ], [ sc, sc, sc ], [ sc, sc, sc ], [ sc, sc, sc ] ];

var pos_loc;
var color_loc
var theta_loc;
var trans_loc;
var scale_loc;

window.onload = function init()
{
  gl_init();
  
  data = [ 
    to_gl_data( cube_vtx(), cube_tri_indx(), cube_quad_indx() ),
    to_gl_data( cone_vtx(), cone_tri_indx(), cone_quad_indx() ),
    to_gl_data( cyl_vtx(), cyl_tri_indx(), cyl_quad_indx() ),
    to_gl_data( sph_vtx(), sph_tri_indx(), sph_quad_indx() )
  ]
  
  for( var i = 0; i < N_MODELS; ++i){
    vtx_buf[i] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vtx_buf[i] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( data[i][0] ), gl.STATIC_DRAW );
    color_buf[i] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, color_buf[i] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( data[i][1] ), gl.STATIC_DRAW );
  }

  render();
};

function gl_init(){
  var canvas = $( "#gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas[0] );
  if (! gl ) { alert( "WebGL isn't available" ); }
  gl.viewport( 0, 0, canvas.width(), canvas.height() );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  gl.enable( gl.DEPTH_TEST );
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program ); 
  
  pos_loc = gl.getAttribLocation( program, "vPosition" );
  gl.enableVertexAttribArray( pos_loc ); 
  
  color_loc = gl.getAttribLocation( program, "vColor" );
  gl.enableVertexAttribArray( color_loc );   
  
  theta_loc = gl.getUniformLocation( program, "theta" );
  trans_loc = gl.getUniformLocation( program, "translation" );
  scale_loc = gl.getUniformLocation( program, "scale" );
}

function cube_vtx() {
  return [
    vec3(-1.00000, -1.00000,  1.00000),
    vec3(-1.00000,  1.00000,  1.00000),
    vec3( 1.00000,  1.00000,  1.00000),
    vec3( 1.00000, -1.00000,  1.00000),
    vec3(-1.00000, -1.00000, -1.00000),
    vec3(-1.00000,  1.00000, -1.00000),
    vec3( 1.00000,  1.00000, -1.00000),
    vec3( 1.00000, -1.00000, -1.00000),
  ];
}

function cube_tri_indx() {
    return [];
}

function cube_quad_indx() {
  return [
    1, 0, 3, 2, 2, 3, 7, 6, 3, 0, 4, 7,
    6, 5, 1, 2, 4, 5, 6, 7, 5, 4, 0, 1
  ];
}

function cone_vtx() {
  return [
    vec3(  0.00000,  0.00000,  1.00000 ),
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

function cone_tri_indx() {
  return [
     0,  2,  3,  1,  2,  3,  0,  3,  4,  1,  3,  4,
     0,  4,  5,  1,  4,  5,  0,  5,  6,  1,  5,  6,
     0,  6,  7,  1,  6,  7,  0,  7,  8,  1,  7,  8,
     0,  8,  9,  1,  8,  9,  0,  9, 10,  1,  9, 10,
     0, 10, 11,  1, 10, 11,  0, 11, 12,  1, 11, 12,
     0, 12, 13,  1, 12, 13,  0, 13, 14,  1, 13, 14,
     0, 14, 15,  1, 14, 15,  0, 15, 16,  1, 15, 16,
     0, 16, 17,  1, 16, 17,  0, 17,  2,  1, 17,  2
  ];
}

function cone_quad_indx() {
  return [ ];
}

function cyl_vtx() {
  return [
    vec3(  0.00000,  0.00000,  1.00000 ), //  0 
    vec3(  0.00000,  1.00000,  1.00000 ), //  1
    vec3(  0.38268,  0.92388,  1.00000 ), //  2 
    vec3(  0.70711,  0.70711,  1.00000 ), //  3 
    vec3(  0.92388,  0.38268,  1.00000 ), //  4 
    vec3(  1.00000,  0.00000,  1.00000 ), //  5 
    vec3(  0.92388, -0.38268,  1.00000 ), //  6 
    vec3(  0.70711, -0.70711,  1.00000 ), //  7 
    vec3(  0.38268, -0.92388,  1.00000 ), //  8 
    vec3(  0.00000, -1.00000,  1.00000 ), //  9 
    vec3( -0.38268, -0.92388,  1.00000 ), // 10 
    vec3( -0.70711, -0.70711,  1.00000 ), // 11  
    vec3( -0.92388, -0.38268,  1.00000 ), // 12 
    vec3( -1.00000,  0.00000,  1.00000 ), // 13 
    vec3( -0.92388,  0.38268,  1.00000 ), // 14 
    vec3( -0.70711,  0.70711,  1.00000 ), // 15 
    vec3( -0.38268,  0.92388,  1.00000 ), // 16 
    vec3(  0.00000,  0.00000, -1.00000 ), // 17 
    vec3(  0.00000,  1.00000, -1.00000 ), // 18 
    vec3(  0.38268,  0.92388, -1.00000 ), // 19 
    vec3(  0.70711,  0.70711, -1.00000 ), // 20 
    vec3(  0.92388,  0.38268, -1.00000 ), // 21
    vec3(  1.00000,  0.00000, -1.00000 ), // 22
    vec3(  0.92388, -0.38268, -1.00000 ), // 23 
    vec3(  0.70711, -0.70711, -1.00000 ), // 24 
    vec3(  0.38268, -0.92388, -1.00000 ), // 25 
    vec3(  0.00000, -1.00000, -1.00000 ), // 26 
    vec3( -0.38268, -0.92388, -1.00000 ), // 27 
    vec3( -0.70711, -0.70711, -1.00000 ), // 28
    vec3( -0.92388, -0.38268, -1.00000 ), // 29
    vec3( -1.00000,  0.00000, -1.00000 ), // 30
    vec3( -0.92388,  0.38268, -1.00000 ), // 31
    vec3( -0.70711,  0.70711, -1.00000 ), // 32
    vec3( -0.38268,  0.92388, -1.00000 )  // 33
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
     1,  2, 19, 18,  2,  3, 20, 19,  3,  4, 21, 20, 
     4,  5, 22, 21,  5,  6, 23, 22,  6,  7, 24, 23, 
     7,  8, 25, 24,  8,  9, 26, 25,  9, 10, 27, 26, 
    10, 11, 28, 27, 11, 12, 29, 28, 12, 13, 30, 29, 
    13, 14, 31, 30, 14, 15, 32, 31, 15, 16, 33, 32, 
    16,  1, 18, 33
  ];
}

function sph_vtx() {
  return [
    vec3(  0.00000,  0.00000,  1.00000 ),
    vec3(  0.52573,  0.00000,  0.85065 ),
    vec3(  0.16246,  0.50000,  0.85065 ),
    vec3( -0.42532,  0.30901,  0.85065 ),
    vec3( -0.42532, -0.30901,  0.85065 ),
    vec3(  0.16246, -0.50000,  0.85065 ),
    vec3(  0.68819,  0.50000,  0.52574 ),
    vec3( -0.26287,  0.80901,  0.52574 ),
    vec3( -0.85065,  0.00000,  0.52574 ),
    vec3( -0.26287, -0.80901,  0.52574 ),
    vec3(  0.68819, -0.50000,  0.52574 ),
    vec3(  0.89443,  0.00000,  0.44722 ),
    vec3(  0.27639,  0.85065,  0.44722 ),
    vec3( -0.72361,  0.52573,  0.44722 ),
    vec3( -0.72361, -0.52573,  0.44722 ),
    vec3(  0.27639, -0.85065,  0.44722 ),
    vec3(  0.95106,  0.30901,  0.00000 ), 
    vec3(  0.58779,  0.80902,  0.00000 ),
    vec3(  0.00000,  1.00000,  0.00000 ),
    vec3( -0.58779,  0.80902,  0.00000 ),
    vec3( -0.95106,  0.30901,  0.00000 ),
    vec3( -0.95106, -0.30901,  0.00000 ),
    vec3( -0.58779, -0.80902,  0.00000 ),
    vec3(  0.00000, -1.00000,  0.00000 ),
    vec3(  0.58779, -0.80902,  0.00000 ),
    vec3(  0.95106, -0.30901,  0.00000 ),
    vec3(  0.72361,  0.52573, -0.44722 ),
    vec3( -0.27639,  0.85065, -0.44722 ),
    vec3( -0.89443,  0.00000, -0.44722 ),
    vec3( -0.27639, -0.85065, -0.44722 ), 
    vec3(  0.72361, -0.52573, -0.44722 ),
    vec3(  0.85065,  0.00000, -0.52574 ),
    vec3(  0.26287,  0.80901, -0.52574 ),
    vec3( -0.68819,  0.50000, -0.52574 ),
    vec3( -0.68819, -0.50000, -0.52574 ),
    vec3(  0.26287, -0.80901, -0.52574 ),
    vec3(  0.42532,  0.30901, -0.85065 ),
    vec3( -0.16246,  0.50000, -0.85065 ),
    vec3( -0.52573,  0.00000, -0.85065 ),
    vec3( -0.16246, -0.50000, -0.85065 ),
    vec3(  0.42532, -0.30901, -0.85065 ),
    vec3(  0.00000,  0.00000, -1.00000 )   
  ];
}

function sph_tri_indx(){
  return [
     0,  1,  2,  0,  2,  3,  0,  3,  4,  0,  4,  5,
     0,  5,  1,  1,  6,  2,  2,  7,  3,  3,  8,  4,
     4,  9,  5,  5, 10,  1,  1, 11,  6,  2,  6, 12,
     2, 12,  7,  3,  7, 13,  3, 13,  8,  4,  8, 14,
     4, 14,  9,  5,  9, 15,  5, 15, 10,  1, 10, 11,
    11, 16,  6, 16, 17,  6,  6, 17, 12,  2, 17, 18,
    12, 18,  7, 18,  7, 19,  7, 19, 13, 13, 19, 20,
    13, 20,  8, 20,  8, 21,  8, 21, 14, 21, 14, 22,
    14, 22,  9, 22,  9, 23,  9, 23, 15, 23, 15, 24,
    15, 24, 10, 24, 10, 25, 10, 25, 11, 25, 11, 16,
    16, 26, 17, 18, 27, 19, 20, 28, 21, 22, 29, 23,
    24, 30, 25, 30, 31, 25, 25, 31, 16, 31, 26, 16,
    26, 32, 17, 17, 32, 18, 32, 27, 18, 27, 33, 19,
    19, 33, 20, 33, 28, 20, 28, 34, 21, 21, 34, 22,
    34, 29, 22, 29, 35, 23, 23, 35, 24, 35, 30, 24,
    31, 36, 26, 26, 36, 32, 36, 32, 37, 32, 37, 27,
    37, 27, 33, 37, 33, 38, 33, 38, 28, 38, 34, 28,
    38, 39, 34, 34, 39, 29, 39, 35, 29, 39, 40, 35,
    35, 40, 30, 40, 31, 30, 40, 36, 31, 36, 41, 37,
    37, 41, 38, 38, 41, 39, 39, 41, 40, 40, 41, 36
  ];
}

function sph_quad_indx() {
    return [];
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
    colors.push( RED, RED, RED );     
  }
  for( var i = 0; i < quad_indx.length; i += 4){
    points.push( vtx[ quad_indx [ i ] ], vtx[ quad_indx [ i+1 ] ], vtx[ quad_indx [ i+2 ] ] );
    points.push( vtx[ quad_indx [ i ] ], vtx[ quad_indx [ i+2 ] ], vtx[ quad_indx [ i+3 ] ] );
    colors.push( BLACK, BLACK, BLACK, BLACK, BLACK, BLACK );
  }
  return [points, colors]; 
}

function render() {
  window.requestAnimFrame( render );
  gl.clear( gl.COLOR_BUFFER_BIT );
  
  for (var i = 0; i < N_MODELS; ++i)
  {
    gl.bindBuffer( gl.ARRAY_BUFFER, vtx_buf[i]);
    gl.vertexAttribPointer( pos_loc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, color_buf[i]);
    gl.vertexAttribPointer( color_loc, 4, gl.FLOAT, false, 0, 0 );
    gl.uniform3fv(theta_loc, theta[i]);
    gl.uniform4fv(trans_loc, trans[i]);
    gl.uniform3fv(scale_loc, scale[i]);
    gl.drawArrays( gl.TRIANGLES, 0, data[i][0].length ); 
  }
}

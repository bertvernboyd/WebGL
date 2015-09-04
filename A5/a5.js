"use strict";

var gl;
var v_buf;
var pos_loc;

var demo_vtx = [0, 1, 0, -1, -1, 0, 1, -1, 0];

window.onload = function init(){
  var canvas = $( "#gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas[0] );
  if (! gl ) { alert( "WebGL isn't available" ); }
  gl.viewport( 0, 0, canvas.width(), canvas.height() );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  gl.enable( gl.DEPTH_TEST );
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  pos_loc = gl.getAttribLocation( program, "vPosition" );
  gl.enableVertexAttribArray( pos_loc ); 

  v_buf = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, v_buf );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(demo_vtx), gl.STATIC_DRAW );
 
  render();
};

function render(){
  window.requestAnimFrame( render );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  gl.bindBuffer( gl.ARRAY_BUFFER, v_buf);
  gl.vertexAttribPointer( pos_loc, 3, gl.FLOAT, false, 0, 0 );
  gl.drawArrays( gl.TRIANGLES, 0, demo_vtx.length/3 ); 
}


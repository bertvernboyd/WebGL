"use strict";

var numTimesToSubdivide = 8;

var gl;
var v_buf;
var pos_loc;
var program;

var theta = [0.0, 0.0, 0.0];

var theta_loc;

var size = 1.0;

var near = -10;
var far = 10;
var left = -size;
var right = size;
var ytop =    size;
var bottom = -size;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var eye = vec3(0.0, 0.0, -5.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var points = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function triangle(a, b, c) {
  points.push(a);
  points.push(b);
  points.push(c);
}

function divideTriangle(a, b, c, count) {
  if ( count > 0 ) {
  
    var ab = mix( a, b, 0.5);
    var ac = mix( a, c, 0.5);
    var bc = mix( b, c, 0.5);
  
    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);
  
    divideTriangle( a, ab, ac, count - 1 );
    divideTriangle( ab, b, bc, count - 1 );
    divideTriangle( bc, c, ac, count - 1 );
    divideTriangle( ab, bc, ac, count - 1 );
  }
  else {
      triangle( a, b, c );
  }
}

function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}


function configureTexture( image ) {
  var texture = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA,
       gl.RGBA, gl.UNSIGNED_BYTE, image );
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                    gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

window.onload = function init(){
    
  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    
  var canvas = $( "#gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas[0] );
  if (! gl ) { alert( "WebGL isn't available" ); }
  gl.viewport( 0, 0, canvas.width(), canvas.height() );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  gl.enable( gl.DEPTH_TEST );
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  pos_loc = gl.getAttribLocation( program, "vPosition" );
  gl.enableVertexAttribArray( pos_loc ); 
  
  theta_loc = gl.getUniformLocation(program, "theta");
  
  modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
  projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

  v_buf = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, v_buf );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  
  var image = $("#texImage");
 
  
  configureTexture( image[0] );
  console.log(points);
  console.log(points.length/3);
 
  render();
};

function render(){
  window.requestAnimFrame( render );
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  theta[1] += 0.2;
  modelViewMatrix = lookAt(eye, at , up);
  projectionMatrix = ortho(left, right, bottom, ytop, near, far);


  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
  
  gl.bindBuffer( gl.ARRAY_BUFFER, v_buf);
  gl.vertexAttribPointer( pos_loc, 4, gl.FLOAT, false, 0, 0 );
  gl.uniform3fv(theta_loc, flatten(theta));
  gl.drawArrays( gl.TRIANGLES, 0, points.length); 
}


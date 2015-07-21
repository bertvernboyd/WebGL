"use strict";

var canvas;
var jcanvas;
var gl;


var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var paint = false;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


window.onload = function init() {
  
  canvas = document.getElementById( "gl-canvas" );
  jcanvas = $("#gl-canvas");
  
  jcanvas.mousedown(function(event) {
      switch (event.which) {
        case 1:
            paint = true;
        case 2:
            break;
        case 3:
            break;
        default:
            alert('You have a strange Mouse!');
    }
  });
  jcanvas.mouseup(function(event) {
     paint = false; 
  });

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
    
  canvas.addEventListener("mousemove", function(event){
    if(paint){
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
      var t = vec2(2*event.clientX/canvas.width-1,
                   2*(canvas.height-event.clientY)/canvas.height-1);
      gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      //t = vec4(colors[(index)%7]);
      t = vec4(0.0, 0.0, 0.0, 1.0);
      gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
      index++;
      }
    });


    gl.viewport( 0, 0, canvas.width, canvas.height );    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();

}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, index );

    window.requestAnimFrame(render);

}
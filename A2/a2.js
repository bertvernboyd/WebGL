"use strict";

var canvas;
var jcanvas;
var gl;
var maxNumVertices  = 60000;
var index = 0;
var paint = false;
var color = vec4(0, 0, 0, 1);
var endpoints = [0];
var vPosition;
var cBuffer;
var vBuffers;
var nBuffers = 25;
var brushes = [];
var brush;

window.onload = function init() {
  
  brushes[0] = [vec2(0,0)];
  brushes[1] = [vec2(0,0), vec2(-1,0), vec2(1,0), vec2(0,-1), vec2(0,1)];
  brushes[2] = [vec2(0,0), vec2(-1,0), vec2(1,0), vec2(0,-1), vec2(0,1), 
                vec2(-1,-1), vec2(-1,1), vec2(1,-1), vec2(1,1), vec2(-2,0), 
                vec2(0,-2), vec2(0,2), vec2(2,0)];
  brushes[2] = [vec2(0,0), vec2(-1,0), vec2(1,0), vec2(0,-1), vec2(0,1), 
                vec2(-1,-1), vec2(-1,1), vec2(1,-1), vec2(1,1), vec2(-2,0), 
                vec2(0,-2), vec2(0,2), vec2(2,0), vec2(-2,-1), vec2(-2,1),
                vec2(2,-1), vec2(2,1), vec2(-1,-2), vec2(-1,2), vec2(1,-2),
                vec2(1,2), vec2(-3,0), vec2(0,-3), vec2(0,3), vec2(3,0)];                
  
  
  brush = brushes[2];
  
  console.log(brushes.length);
  
  canvas = document.getElementById( "gl-canvas" );
  jcanvas = $("#gl-canvas");
  
  jcanvas.mousedown(function(event) {
      switch (event.which) {
        case 1:
            endpoints.push(index);
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
  
  jcanvas.mousemove(function(event){
    if(paint){
   
      var t;
      
      for(var v = 0; v < nBuffers && v < brush.length; v++)
      {
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[v] );
        t = c_to_s(event.clientX+brush[v][0], event.clientY+brush[v][1], canvas.width, canvas.height);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));  
      }
      
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(color));
      endpoints[endpoints.length-1] = ++index;
    }
  });

  $(".color_div").mousedown(function(event){
      var c = $(this).css("background-color");
      //console.log(c);
      //$(".board").css("cursor", )
      var c_vals = c.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      var r = parseInt(c_vals[1])/255.0;
      var g = parseInt(c_vals[2])/255.0;
      var b = parseInt(c_vals[3])/255.0;
      color = vec4(r, g, b, 1.0);
      var cursorId = c_vals[1] + "_" + c_vals[2] + "_" + c_vals[3];
      var cursorVal = "url(assets/" + cursorId + ".png), auto";
      $(".board").css("cursor", cursorVal);
  });

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.lineWidth(1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vBuffers = [];

    for(var v = 0; v < nBuffers; v++){
      vBuffers[v] = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[v]);
      gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    }
    
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    render();
}

function c_to_s(x, y, w, h){
    return vec2(2*x/w-1, 2*(h-y)/h-1);
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var v = 0; v < vBuffers.length; v++){
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[v]);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

      for(var i = 0; i < endpoints.length; i++){
        var a = (i == 0) ? 0 : endpoints[i-1];
        var b = endpoints[i];   
        gl.drawArrays( gl.LINE_STRIP, a, b-a );        
      }
    }

    window.requestAnimFrame(render);
}

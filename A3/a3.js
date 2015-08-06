"use strict";

var gl;
var points;
var vertex_colors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
];
var colors;

window.onload = function init()
{
    points = [];
    colors = [];

    color_cube();

    var canvas = $( "#gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas[0] );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL

    gl.viewport( 0, 0, canvas[0].width, canvas[0].height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    canvas.mousedown(function(event) {
      switch (event.which) {
        case 1:
            console.log('Click');
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            alert('You have a strange Mouse!');
    }
  });

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    window.requestAnimFrame(render);
}

function square_vertices() {
  return [
    vec3(-0.5, -0.5,  0.5),
    vec3(-0.5,  0.5,  0.5),
    vec3( 0.5,  0.5,  0.5),
    vec3( 0.5, -0.5,  0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5,  0.5, -0.5),
    vec3( 0.5,  0.5, -0.5),
    vec3( 0.5, -0.5, -0.5),
  ];
}

function quad(a, b, c, d){
  
  var vertices = square_vertices();
  var indices = [a, b, c, a, c, d];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push(vertex_colors[indices[i]] );
  }
}

function color_cube(){
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );
  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 ); 
}



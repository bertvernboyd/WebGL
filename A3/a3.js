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
var r = 0.1;
var a = []; // triangle point end indices
var b = []; // lines endpoint indices
var vertices;

var vBuffers = [];
var cBuffers = [];
var vPosition;
var vColor;
var nObj = 0;

var theta = [[ Math.random()*360, Math.random()*360, Math.random()*360 ]];
var thetaLoc;

var translation = [[0, 0, 0, 0]];
var translationLoc;


window.onload = function init()
{
    points = [];         

    colors = [];

    create_cube();

    var canvas = $( "#gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas[0] );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL

    gl.viewport( 0, 0, canvas[0].width, canvas[0].height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Load the data into the GPU

    vBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    translationLoc = gl.getUniformLocation(program, "translation");

    canvas.mousedown(function(event) {
      switch (event.which) {
        case 1:
            create_new_object();
        case 2:
            break;
        case 3:
            break;
        default:
            alert('You have a strange Mouse!');
    }
  });

    canvas.mousemove(function(event){
        //translate by
        var t = canvas_to_screen(event.clientX, event.clientY, canvas[0].width, canvas[0].height); 
        translation[nObj] = [t[0], t[1], 0, 0];

    });
    canvas.mouseout(function(event){
        translation[nObj] = [0, 0, 0, 0];
    });

    render();
};




function square_vertices() {
  return [
    vec3(-r, -r,  r),
    vec3(-r,  r,  r),
    vec3( r,  r,  r),
    vec3( r, -r,  r),
    vec3(-r, -r, -r),
    vec3(-r,  r, -r),
    vec3( r,  r, -r),
    vec3( r, -r, -r),
  ];
}

function square_vertic3s() {
    var t = (1.0 + Math.sqrt(5.0)) / 2.0;
    return [
      vec3(  -r, r*t,    0),
      vec3(   r, r*t,    0),
      vec3(  -r,-r*t,    0),
      vec3(   r,-r*t,    0),
      vec3(   0,  -r,  r*t),
      vec3(   0,   r,  r*t),
      vec3(   0,  -r, -r*t),
      vec3(   0,   r, -r*t),
      vec3( r*t,   0,   -r),
      vec3( r*t,   0,    r),
      vec3(-r*t,   0,   -r),
      vec3(-r*t,   0,    r)
    ];
}

function create_cube(){

  vertices = square_vertices();
  tri_quad( 1, 0, 3, 2 );
  tri_quad( 2, 3, 7, 6 );
  tri_quad( 3, 0, 4, 7 );
  tri_quad( 6, 5, 1, 2 );
  tri_quad( 4, 5, 6, 7 );
  tri_quad( 5, 4, 0, 1 ); 
  a[nObj] = points.length;
  line_quad( 1, 0, 3, 2 );
  line_quad( 2, 3, 7, 6 );
  line_quad( 3, 0, 4, 7 );
  line_quad( 6, 5, 1, 2 );
  line_quad( 4, 5, 6, 7 );
  line_quad( 5, 4, 0, 1 ); 
  b[nObj] = points.length;
}

function create_cub3()
{
    vertices = square_vertic3s();

    triangl3(0, 11, 5);
    triangl3(0, 5, 1);
    triangl3(0, 1, 7);
    triangl3(0, 7, 10);
    triangl3(0, 10, 11);
    triangl3(1, 5, 9);
    triangl3(5, 11, 4);
    triangl3(11, 10, 2);
    triangl3(10, 7, 6);
    triangl3(7, 1, 8);
    triangl3(3, 9, 4);
    triangl3(3, 4, 2);
    triangl3(3, 2, 6);
    triangl3(3, 6, 8);
    triangl3(3, 8, 9);
    triangl3(4, 9, 5);
    triangl3(2, 4, 11);
    triangl3(6, 2, 10);
    triangl3(8, 6, 7);
    triangl3(9, 8, 1);
    a[nObj] = points.length;
    lin3(0, 11, 5);
    lin3(0, 5, 1);
    lin3(0, 1, 7);
    lin3(0, 7, 10);
    lin3(0, 10, 11);
    lin3(1, 5, 9);
    lin3(5, 11, 4);
    lin3(11, 10, 2);
    lin3(10, 7, 6);
    lin3(7, 1, 8);
    lin3(3, 9, 4);
    lin3(3, 4, 2);
    lin3(3, 2, 6);
    lin3(3, 6, 8);
    lin3(3, 8, 9);
    lin3(4, 9, 5);
    lin3(2, 4, 11);
    lin3(6, 2, 10);
    lin3(8, 6, 7);
    lin3(9, 8, 1);
    b[nObj] = points.length;
}

function divideTriangle( a, b, c, count, primatives)
{
    if ( count == 0 ) {
        if(primatives === gl.TRIANGLES){
          triangl3( a, b, c );
        }
        else if(primatives === gl.LINES){
          lin3( a, b, c );
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
        divideTriangle( ab, ac, bc, count );
    }
}

function tri_quad(a, b, c, d){

  var indices = [a, b, c, a, c, d];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push(vertex_colors[indices[i]] );
  }
}

function line_quad(a, b, c, d){

  var indices = [a, b, b, c, c, d, d, a];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
  }
}

function triangl3(a, b, c)
{
    var indices = [a, b, c];
    for ( var i = 0; i < indices.length; ++i){
      points.push( vertices[indices[i]] );
      colors.push([ 1.0, 0.0, 0.0, 1.0 ]);       
    }   
}

function lin3(a,b,c)
{
    var indices = [a,b,b,c,c,a];
    for ( var i = 0; i < indices.length; ++i){
        points.push( vertices[indices[i]]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ])
    }
}

function canvas_to_screen(x, y, w, h){
    return vec2(2*x/w-1, 2*(h-y)/h-1);
}

function create_new_object()
{
    nObj++;
    points = [];         

    colors = [];
    create_cube();
    cBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    vBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    theta[nObj] = [Math.random()*360, Math.random()*360, Math.random()*360];
    translation[nObj] = translation[nObj-1];
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    for( var i = 0; i <= nObj; ++i)
    {
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[i]);
      gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
      gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[i]);
      gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
      
      gl.uniform3fv(thetaLoc, theta[i]);
      gl.uniform4fv(translationLoc, translation[i]);
      gl.drawArrays( gl.TRIANGLES, 0, a[i] );
      gl.drawArrays( gl.LINES, a[i], b[i] - a[i] );
    }

    window.requestAnimFrame(render);
}




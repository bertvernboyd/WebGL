"use strict";

var gl;
var points;
var BLACK = [ 0.0, 0.0, 0.0, 1.0 ];
var RED = [ 1.0, 0.0, 0.0, 1.0 ];
var YELLOW = [ 1.0, 1.0, 0.0, 1.0 ];
var GREEN = [ 0.0, 1.0, 0.0, 1.0 ];
var BLUE = [ 0.0, 0.0, 1.0, 1.0 ];
var MAGENTA = [ 1.0, 0.0, 1.0, 1.0 ];
var CYAN = [ 0.0, 1.0, 1.0, 1.0 ];
var WHITE = [ 1.0, 1.0, 1.0, 1.0 ];

var vertex_colors = [
        BLACK,  // black
        RED,  // red
        YELLOW,  // yellow
        GREEN,  // green
        BLUE,  // blue
        MAGENTA,  // magenta
        CYAN,  // cyan
        WHITE   // white
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
var modelIndex = 0;
var N_MODELS = 3;

var theta = [[ 0, 0, 0 ]];
var thetaLoc;

var translation = [[0, 0, 0, 0]];
var translationLoc;

var scalef = [[1.0, 1.0, 1.0]];
var scaleLoc;

var shape = "cube";

window.onload = function init()
{
    var canvas = $( "#gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas[0] );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    points = [];         
    colors = [];
    create();
    
    gl.viewport( 0, 0, canvas[0].width, canvas[0].height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    translationLoc = gl.getUniformLocation(program, "translation");
    scaleLoc = gl.getUniformLocation(program, "scale");

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
        //translation[nObj] = [0, 0, 0, 0];
    });
    
    $("#cube").change(function() {
        shape = "cube";
        replace_object();
    })
    $("#sphere").change(function() {
        shape = "sphere";
        replace_object();
    })
    $("#cylinder").change(function() {
        shape = "cylinder";
        replace_object();
    })
    $("#scaler").change(function() {
        var s = event.srcElement.value;
        scalef[nObj] = [s, s, s];
    })
    $("#rx").change(function() {
        var r = event.srcElement.value;
        theta[nObj] = [r, theta[nObj][1], theta[nObj][2]];
    })
    $("#ry").change(function() {
        var r = event.srcElement.value;
        theta[nObj] = [theta[nObj][0], r, theta[nObj][2]];
    })    
    $("#rz").change(function() {
        var r = event.srcElement.value;
        theta[nObj] = [theta[nObj][0], theta[nObj][1], r];
    })
    render();
};


function canvas_to_screen(x, y, w, h){
    return vec2(2*x/w-1, 2*(h-y)/h-1);
}


function create_new_object(){
    nObj++;
    points = [];         
    colors = [];
    create();
    cBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    vBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    theta[nObj] = theta[nObj-1];
    translation[nObj] = (nObj == 0) ? [0, 0, 0, 0] : translation[nObj-1];
    scalef[nObj] = scalef[nObj-1];
}

function replace_object(){
    points = [];         
    colors = [];
    create();
    cBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    vBuffers[nObj] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffers[nObj] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    theta[nObj] = [Math.random()*360, Math.random()*360, Math.random()*360];
    theta[nObj] = theta[nObj];
    translation[nObj] = (nObj == 0) ? [0, 0, 0, 0] : translation[nObj];
    scalef[nObj] = scalef[nObj];
}

function create(){
    (shape == "cube") ? create_cube() : (shape == "sphere") ? create_sphere() : create_cylinder();
}

// Cube Generation

function create_cube(){

  vertices = cube_vertices();
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

function cube_vertices() {
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

function tri_quad(i, j, k, l){

  var indices = [i, j, k, i, k, l];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push(vertex_colors[indices[i]] );
  }
}

function line_quad(i, j, k, l){

  var indices = [i, j, j, k, k, l, l, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
  }
}

// Sphere Creation

function create_sphere()
{
    vertices = sphere_vertices();

    var indices = [
           0, 11,  5,  0,  5,  1,  0,  1,  7,  0,  7, 10,  0, 10, 11,
           1,  5,  9,  5, 11,  4, 11, 10,  2, 10,  7,  6,  7,  1,  8,
           3,  9,  4,  3,  4,  2,  3,  2,  6,  3,  6,  8,  3,  8,  9,
           4,  9,  5,  2,  4, 11,  6,  2, 10,  8,  6,  7,  9,  8,  1
        ];

    var count = 1;
    for(var i = 0; i < indices.length; i += 3){
      divideTriangle(
              vertices[indices[i]], 
              vertices[indices[i+1]], 
              vertices[indices[i+2]], 
              count, gl.TRIANGLES);
    }

    a[nObj] = points.length;
    
    for(var i = 0; i < indices.length; i += 3){
      divideTriangle(
              vertices[indices[i]], 
              vertices[indices[i+1]], 
              vertices[indices[i+2]], 
              count, gl.LINES);
    }

    b[nObj] = points.length;
}

function sphere_vertices() {
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

function divideTriangle( a, b, c, count, primatives)
{
    if ( count == 0 ) {
        if(primatives === gl.TRIANGLES){
          sphere_tri( a, b, c );
        }
        else if(primatives === gl.LINES){
          sphere_line( a, b, c );
        }
    }
    else {
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        divideTriangle( a, ab, ac, count, primatives );
        divideTriangle( c, ac, bc, count, primatives );
        divideTriangle( b, bc, ab, count, primatives );
        divideTriangle( ab, ac, bc, count, primatives );
    }
}

function sphere_tri(a, b, c){
    var v = [a, b, c];
    for ( var i = 0; i < v.length; ++i){
      v[i] = normalize(v[i], false);
      colors.push(  [ 0.5*(1+v[i][0]), 0.5*(1+v[i][1]), 0.5*(1+v[i][2]), 1.0 ]  );
      v[i] = scale(1.6*r, v[i]);
      points.push( v[i] );           
    }   
}

function sphere_line(a,b,c)
{
    var v = [a,b,b,c,c,a];
    for ( var i = 0; i < v.length; ++i){
        v[i] = scale(1.6*r, normalize(v[i], false));
        points.push( v[i]) ;
        colors.push([ 0.0, 0.0, 0.0, 1.0 ])
    }
}

// Cylinder Creation

function create_cylinder(){
    vertices = cylinder_vertices();
    
    var triIndices = [
         0,  1,  2,  0,  2,  3,  0,  3,  4,  0,  4,  5,  
         0,  5,  6,  0,  6,  7,  0,  7,  8,  0,  8,  9,
         0,  9, 10,  0, 10, 11,  0, 11, 12,  0, 12, 13,
         0, 13, 14,  0, 14, 15,  0, 15, 16,  0, 16,  1,
        17, 18, 19, 17, 19, 20, 17, 20, 21, 17, 21, 22,
        17, 22, 23, 17, 23, 24, 17, 24, 25, 17, 25, 26,
        17, 26, 27, 17, 27, 28, 17, 28, 29, 17, 29, 30,
        17, 30, 31, 17, 31, 32, 17, 32, 33, 17, 33, 18
    ];
    
    var quadIndices = [
         1,  2, 18, 19,  2,  3, 19, 20,  3,  4, 20, 21,
         4,  5, 21, 22,  5,  6, 22, 23,  6,  7, 23, 24,
         7,  8, 24, 25,  8,  9, 25, 26,  9, 10, 26, 27,
        10, 11, 27, 28, 11, 12, 28, 29, 12, 13, 29, 30,
        13, 14, 30, 31, 14, 15, 31, 32, 15, 16, 32, 33,
        16,  1, 33, 18
    ]; 
    
    for(var i = 0; i < triIndices.length; i += 3){
        tri_tri(triIndices[i], triIndices[i+1], triIndices[i+2]);
    }
    for(var i = 0; i < quadIndices.length; i += 4){
        tri_quad2(quadIndices[i], quadIndices[i+1], quadIndices[i+2], quadIndices[i+3]);
    }
    a[nObj] = points.length;
    for(var i = 0; i < triIndices.length; i += 3){
        line_tri(triIndices[i], triIndices[i+1], triIndices[i+2]);
    }
    for(var i = 0; i < quadIndices.length; i += 4){
        line_quad2(quadIndices[i], quadIndices[i+1], quadIndices[i+2], quadIndices[i+3]);
    }
    b[nObj] = points.length;
}

function tri_tri(i, j, k){

  var indices = [i, j, k];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( RED );
  }
}

function tri_quad2(i, j, k, l){
  
  var indices = [i, j, k, j, l, k];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( RED );
  }
}

function line_tri(i, j, k){

  var indices = [i, j, j, k, k, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( BLACK );
  }
}

function line_quad2(i, j, k, l){
  
  var indices = [i, j, j, l, l, k, k, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( BLACK );
  }
}

function cylinder_vertices() {
    return [
      vec3(  0.00000*r,  0.00000*r,  1.00000*r ),
      vec3(  0.00000*r,  1.00000*r,  1.00000*r ),
      vec3(  0.38268*r,  0.92388*r,  1.00000*r ),
      vec3(  0.70711*r,  0.70711*r,  1.00000*r ),
      vec3(  0.92388*r,  0.38268*r,  1.00000*r ),
      vec3(  1.00000*r,  0.00000*r,  1.00000*r ),
      vec3(  0.92388*r, -0.38268*r,  1.00000*r ),
      vec3(  0.70711*r, -0.70711*r,  1.00000*r ),
      vec3(  0.38268*r, -0.92388*r,  1.00000*r ),
      vec3(  0.00000*r, -1.00000*r,  1.00000*r ),
      vec3( -0.38268*r, -0.92388*r,  1.00000*r ),
      vec3( -0.70711*r, -0.70711*r,  1.00000*r ),
      vec3( -0.92388*r, -0.38268*r,  1.00000*r ),
      vec3( -1.00000*r,  0.00000*r,  1.00000*r ),
      vec3( -0.92388*r,  0.38268*r,  1.00000*r ),
      vec3( -0.70711*r,  0.70711*r,  1.00000*r ),
      vec3( -0.38268*r,  0.92388*r,  1.00000*r ),
      vec3(  0.00000*r,  0.00000*r, -1.00000*r ),
      vec3(  0.00000*r,  1.00000*r, -1.00000*r ),
      vec3(  0.38268*r,  0.92388*r, -1.00000*r ),
      vec3(  0.70711*r,  0.70711*r, -1.00000*r ),
      vec3(  0.92388*r,  0.38268*r, -1.00000*r ),
      vec3(  1.00000*r,  0.00000*r, -1.00000*r ),
      vec3(  0.92388*r, -0.38268*r, -1.00000*r ),
      vec3(  0.70711*r, -0.70711*r, -1.00000*r ),
      vec3(  0.38268*r, -0.92388*r, -1.00000*r ),
      vec3(  0.00000*r, -1.00000*r, -1.00000*r ),
      vec3( -0.38268*r, -0.92388*r, -1.00000*r ),
      vec3( -0.70711*r, -0.70711*r, -1.00000*r ),
      vec3( -0.92388*r, -0.38268*r, -1.00000*r ),
      vec3( -1.00000*r,  0.00000*r, -1.00000*r ),
      vec3( -0.92388*r,  0.38268*r, -1.00000*r ),
      vec3( -0.70711*r,  0.70711*r, -1.00000*r ),
      vec3( -0.38268*r,  0.92388*r, -1.00000*r )
  ];
}

// Render

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
      gl.uniform3fv(scaleLoc, scalef[i])
      gl.drawArrays( gl.TRIANGLES, 0, a[i] );
      gl.drawArrays( gl.LINES, a[i], b[i] - a[i] );
    }

    window.requestAnimFrame(render);
}




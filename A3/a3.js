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
var color = WHITE;

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

var theta = [[ 45, 45, 30 ]];
var thetaLoc;

var translation = [[0, 0, 0, 0]];
var translationLoc;

var scalef = [[1.0, 1.0, 1.0]];
var scaleLoc;

var shape = "cube";
var rainbow = false;

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
        r = 0.1;
        replace_object();
    })
    $("#sphere").change(function() {
        shape = "sphere";
        r = 0.13;
        replace_object();
    })
    $("#cylinder").change(function() {
        r = 0.1;
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
    
    $(".color_div").click(function(event){
      var c = $(this).css("background-color");
      var c_vals = c.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      var r = parseInt(c_vals[1])/255.0;
      var g = parseInt(c_vals[2])/255.0;
      var b = parseInt(c_vals[3])/255.0;
      color = vec4(r, g, b, 1.0);
      rainbow = false;
      replace_object();
      
    });
    
    $(".rainbow").click(function(event){
        rainbow = true;
        replace_object();
    });
    
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
    theta[nObj] = theta[nObj];
    translation[nObj] = translation[nObj];
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
    if(rainbow){
        colors.push(vertex_colors[indices[i]] );   
    }else{
        colors.push(color);
    }
  }
}

function line_quad(i, j, k, l){

  var indices = [i, j, j, k, k, l, l, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( BLACK );
  }
}

// Sphere Creation

function create_sphere(){
    vertices = sphere_vertices();

    var indices = [
           0,  1,  2, 
           0,  2,  3, 
           0,  3,  4, 
           0,  4,  5, 
           0,  5,  1,
           1,  6,  2,
           2,  7,  3,
           3,  8,  4,
           4,  9,  5,
           5, 10,  1,
           1, 11,  6,
           2,  6, 12,
           2, 12,  7,
           3,  7, 13,
           3, 13,  8,
           4,  8, 14,
           4, 14,  9,
           5,  9, 15,
           5, 15, 10,
           1, 10, 11,
          11, 16,  6,
          16, 17,  6,
           6, 17, 12,
          12, 17, 18,
          12, 18,  7,
          18,  7, 19,
          7, 19, 13,
          13, 19, 20,
          13, 20, 8, 
          20,  8, 21,
           8, 21, 14,
          21, 14, 22,
          14, 22,  9,
          22,  9, 23,
           9, 23, 15,
          23, 15, 24,
          15, 24, 10,
          24, 10, 25,
          10, 25, 11,
          25, 11, 16, //
          16, 26, 17,
          18, 27, 19,       
          20, 28, 21,
          22, 29, 23,
          24, 30, 25,
          30, 31, 25,
          25, 31, 16,
          31, 26, 16,
          26, 32, 17,
          17, 32, 18,
          32, 27, 18,
          27, 33, 19,
          19, 33, 20,
          33, 28, 20,
          28, 34, 21,
          21, 34, 22,
          34, 29, 22,
          29, 35, 23,
          23, 35, 24,
          35, 30, 24,
          31, 36, 26,
          26, 36, 32,
          36, 32, 37,
          32, 37, 27,
          37, 27, 33,
          37, 33, 38,
          33, 38, 28,
          38, 34, 28, 
          38, 39, 34,  
          34, 39, 29,
          39, 35, 29, 
          39, 40, 35,
          35, 40, 30, 
          40, 31, 30,
          40, 36, 31,      
          36, 41, 37,
          37, 41, 38,
          38, 41, 39,
          39, 41, 40,
          40, 41, 36          
        ];
        
    for(var i = 0; i < indices.length; i += 3){
        tri_tri(indices[i], indices[i+1], indices[i+2]);
    }
    a[nObj] = points.length;
    for(var i = 0; i < indices.length; i += 3){
        line_tri(indices[i], indices[i+1], indices[i+2]);
    }
    b[nObj] = points.length;
}

function sphere_vertices() {
    return [
      vec3(  0.00000*r,  0.00000*r,  1.00000*r ), //  0
      vec3(  0.52573*r,  0.00000*r,  0.85065*r ), //  1
      vec3(  0.16246*r,  0.50000*r,  0.85065*r ), //  2
      vec3( -0.42532*r,  0.30901*r,  0.85065*r ), //  3
      vec3( -0.42532*r, -0.30901*r,  0.85065*r ), //  4
      vec3(  0.16246*r, -0.50000*r,  0.85065*r ), //  5
      vec3(  0.68819*r,  0.50000*r,  0.52574*r ), //  6
      vec3( -0.26287*r,  0.80901*r,  0.52574*r ), //  7
      vec3( -0.85065*r,  0.00000*r,  0.52574*r ), //  8
      vec3( -0.26287*r, -0.80901*r,  0.52574*r ), //  9
      vec3(  0.68819*r, -0.50000*r,  0.52574*r ), // 10
      vec3(  0.89443*r,  0.00000*r,  0.44722*r ), // 11
      vec3(  0.27639*r,  0.85065*r,  0.44722*r ), // 12
      vec3( -0.72361*r,  0.52573*r,  0.44722*r ), // 13
      vec3( -0.72361*r, -0.52573*r,  0.44722*r ), // 14
      vec3(  0.27639*r, -0.85065*r,  0.44722*r ), // 15
      vec3(  0.95106*r,  0.30901*r,  0.00000*r ), // 16 
      vec3(  0.58779*r,  0.80902*r,  0.00000*r ), // 17
      vec3(  0.00000*r,  1.00000*r,  0.00000*r ), // 18
      vec3( -0.58779*r,  0.80902*r,  0.00000*r ), // 19
      vec3( -0.95106*r,  0.30901*r,  0.00000*r ), // 20
      vec3( -0.95106*r, -0.30901*r,  0.00000*r ), // 21
      vec3( -0.58779*r, -0.80902*r,  0.00000*r ), // 22
      vec3(  0.00000*r, -1.00000*r,  0.00000*r ), // 23
      vec3(  0.58779*r, -0.80902*r,  0.00000*r ), // 24
      vec3(  0.95106*r, -0.30901*r,  0.00000*r ), // 25
      vec3(  0.72361*r,  0.52573*r, -0.44722*r ), // 26
      vec3( -0.27639*r,  0.85065*r, -0.44722*r ), // 27
      vec3( -0.89443*r,  0.00000*r, -0.44722*r ), // 28
      vec3( -0.27639*r, -0.85065*r, -0.44722*r ), // 29 
      vec3(  0.72361*r, -0.52573*r, -0.44722*r ), // 30
      vec3(  0.85065*r,  0.00000*r, -0.52574*r ), // 31
      vec3(  0.26287*r,  0.80901*r, -0.52574*r ), // 32
      vec3( -0.68819*r,  0.50000*r, -0.52574*r ), // 33
      vec3( -0.68819*r, -0.50000*r, -0.52574*r ), // 34
      vec3(  0.26287*r, -0.80901*r, -0.52574*r ), // 35
      vec3(  0.42532*r,  0.30901*r, -0.85065*r ), // 36
      vec3( -0.16246*r,  0.50000*r, -0.85065*r ), // 37
      vec3( -0.52573*r,  0.00000*r, -0.85065*r ), // 38
      vec3( -0.16246*r, -0.50000*r, -0.85065*r ), // 39
      vec3(  0.42532*r, -0.30901*r, -0.85065*r ), // 40
      vec3(  0.00000*r,  0.00000*r, -1.00000*r )  // 41
      
  ];
}

function tri_tri(i, j, k){

  var indices = [i, j, k];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    if(rainbow){
        var c = 0.5;
        colors.push( [c*(1.0+vertices[indices[i]][0]/r),
                      c*(1.0+vertices[indices[i]][1]/r),
                      c*(1.0+vertices[indices[i]][2]/r),
                      1.0] ) ;      
    }else{
       colors.push(color);
    }

  }
}

function line_tri(i, j, k){

  var indices = [i, j, j, k, k, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( BLACK );
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


function tri_quad2(i, j, k, l){
  
  var indices = [i, j, k, j, l, k];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    if(rainbow){
        var c = 0.5;
        colors.push( [c*(1.0+vertices[indices[i]][0]/r),
                      c*(1.0+vertices[indices[i]][1]/r),
                      c*(1.0+vertices[indices[i]][2]/r),
                      1.0] ) ;
    }
    else{
        colors.push(color);
    }
  }
}



function line_quad2(i, j, k, l){
  
  var indices = [i, j, j, l, l, k, k, i];

  for ( var i = 0; i < indices.length; ++i){
    points.push( vertices[indices[i]] );
    colors.push( BLACK );
  }
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




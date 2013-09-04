var gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}


function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


var shaderProgram;

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
  shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
}


function handleLoadedTexture(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}


var glassTexture;

function initTexture() {
  glassTexture = gl.createTexture();
  glassTexture.image = new Image();
  glassTexture.image.onload = function () {
    handleLoadedTexture(glassTexture)
  }

  glassTexture.image.src = "/images/3d/wikisigns_texture.jpg";
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}



var xRot = 0;
var xSpeed = 3;

var yRot = 0;
var ySpeed = -3;

var x =  0.0;
var y =  0.0;
var z = -5.0;


var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() {
  if (currentlyPressedKeys[33]) {
    // Page Up
    z -= 0.05;
  }
  if (currentlyPressedKeys[34]) {
    // Page Down
    z += 0.05;
  }
  if (currentlyPressedKeys[37]) {
    // Left cursor key
    ySpeed -= 5;
  }
  if (currentlyPressedKeys[39]) {
    // Right cursor key§
    ySpeed += 5;
  }
  if (currentlyPressedKeys[38]) {
    // Up cursor key
    xSpeed -= 5;
  }
  if (currentlyPressedKeys[40]) {
    // Down cursor key
    xSpeed += 5;
  }
}


var cubeVertexPositionBuffer;
var cubeVertexNormalBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;
function initBuffers() {
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

  var abstand = 0.0588235294117647;

  //var abstand = 0.618;

  var all_vertices = [];
  all_vertices[0] = [
    // ewx0 eckteil unten links vorne
    -1.0-abstand,  -1.0-abstand,  1.0+abstand,
    0.0-abstand,  -0.5-abstand,  1.0+abstand,
    0.0-abstand,   0.0-abstand,  0.0+abstand,
    -1.0-abstand,  -0.5-abstand,  0.0+abstand,

    // ewx0 eckteil unten links vorne
    -1.0-abstand,   0.0-abstand,  1.0+abstand,
    0.0-abstand,  -0.5-abstand,  1.0+abstand,
    0.0-abstand,   0.0-abstand,  0.0+abstand,
    -1.0-abstand,  -0.5-abstand,  0.0+abstand,

    -1.0-abstand,  -1.0-abstand,  1.0+abstand,
    -1.0-abstand,   0.0-abstand,  1.0+abstand,
    0.0-abstand,  -0.5-abstand,  1.0+abstand,
    -1.0-abstand,  -0.5-abstand,  0.0+abstand,

    ];
  all_vertices[1] = [
    ];
  all_vertices[2] = [
    // c8 eckteil oben links vorne
    -1.0-abstand,  1.0+abstand,  1.0+abstand,
    0.0-abstand,  0.5+abstand,  1.0+abstand,
    0.0-abstand,  0.0+abstand,  0.0+abstand,
    -1.0-abstand,  0.5+abstand,  0.0+abstand,

    // c8 eckteil oben links vorne
    -1.0-abstand,  0.0+abstand,  1.0+abstand,
    0.0-abstand,  0.5+abstand,  1.0+abstand,
    0.0-abstand,  0.0+abstand,  0.0+abstand,
    -1.0-abstand,  0.5+abstand,  0.0+abstand,

    // c8 eckteil oben links vorne deckel
    -1.0-abstand,  1.0+abstand,  1.0+abstand,
    -1.0-abstand,  0.0+abstand,  1.0+abstand,
    0.0-abstand,  0.5+abstand,  1.0+abstand,
    -1.0-abstand,  0.5+abstand,  0.0+abstand,

    ];
  all_vertices[3] = [
    // z8 deckel
    -1.0,  1.0+2*abstand,  1.0,
    0.0,  0.5+2*abstand,  1.0,
    0.0,  0.0+2*abstand,  0.0,
    -1.0,  0.5+2*abstand,  0.0,

    // z8 deckel
    1.0,  1.0+2*abstand,  1.0,
    1.0,  0.5+2*abstand,  0.0,
    0.0,  0.0+2*abstand,  0.0,
    0.0,  0.5+2*abstand,  1.0,

    // z8 deckel
    -1.0,  1.0+2*abstand,  -1.0,
    0.0,  0.5+2*abstand,  -1.0,
    0.0,  0.0+2*abstand,  0.0,
    -1.0,  0.5+2*abstand,  0.0,

    // z8 deckel
    1.0,  1.0+2*abstand,  -1.0,
    1.0,  0.5+2*abstand,  0.0,
    0.0,  0.0+2*abstand,  0.0,
    0.0,  0.5+2*abstand,  -1.0,

    // bugfix
    -1.0,  1.0+2*abstand,  1.0,
    0.0,  0.5+2*abstand,  1.0,
    1.0,  1.0+2*abstand,  1.0,
    // bugfix
    -1.0,  1.0+2*abstand,  -1.0,
    1.0,  1.0+2*abstand,  -1.0,
    0.0,  0.5+2*abstand,  -1.0,

    ];
  all_vertices[4] = [
    // a2 mittelteil vorne
    0.0,   0.5,  1.0+2*abstand,
    -1.0,   0.0,  1.0+2*abstand,
    0.0,   0.0,  0.0+2*abstand,

    // a2 mittelteil vorne
    0.0,   0.5,  1.0+2*abstand,
    1.0,   0.0,  1.0+2*abstand,
    0.0,   0.0,  0.0+2*abstand,

    // a2 mittelteil vorne
    0.0,  -0.5,  1.0+2*abstand,
    -1.0,   0.0,  1.0+2*abstand,
    0.0,   0.0,  0.0+2*abstand,

    // a2 mittelteil vorne
    0.0,  -0.5,  1.0+2*abstand,
    1.0,   0.0,  1.0+2*abstand,
    0.0,   0.0,  0.0+2*abstand,
    ];

  all_vertices[5] = [
    // dm3 eckteil unten links hinten
    -1.0-abstand,  -1.0-abstand,  -1.0-abstand,
    0.0-abstand,  -0.5-abstand,  -1.0-abstand,
    0.0-abstand,   0.0-abstand,   0.0-abstand,
    -1.0-abstand,  -0.5-abstand,   0.0-abstand,

    // dm3 eckteil unten links hinten
    -1.0-abstand,   0.0-abstand,  -1.0-abstand,
    0.0-abstand,  -0.5-abstand,  -1.0-abstand,
    0.0-abstand,   0.0-abstand,   0.0-abstand,
    -1.0-abstand,  -0.5-abstand,   0.0-abstand,

    // dm3 eckteil unten links hinten deckel
    -1.0-abstand,  -1.0-abstand,  -1.0-abstand,
    -1.0-abstand,   0.0-abstand,  -1.0-abstand,
    0.0-abstand,  -0.5-abstand,  -1.0-abstand,
    -1.0-abstand,  -0.5-abstand,   0.0-abstand,
    ];

  all_vertices[6] = [
    // h5 mittelteil links
    -1.0-2*abstand,   0.0,  1.0,
    -1.0-2*abstand,   0.5,  0.0,
    0.0-2*abstand,   0.0,  0.0,

    // h5 mittelteil links
    -1.0-2*abstand,   0.0,  -1.0,
    -1.0-2*abstand,   0.5,   0.0,
    0.0-2*abstand,   0.0,   0.0,

    // h5 mittelteil links
    -1.0-2*abstand,    0.0,  1.0,
    -1.0-2*abstand,   -0.5,  0.0,
    0.0-2*abstand,    0.0,  0.0,

    // h5 mittelteil links
    -1.0-2*abstand,    0.0,  -1.0,
    -1.0-2*abstand,   -0.5,   0.0,
    0.0-2*abstand,    0.0,   0.0,
    ];

  all_vertices[7] = [
    // t2 eckteil oben links hinten
    -1.0-abstand,  1.0+abstand,  -1.0-abstand,
    0.0-abstand,  0.5+abstand,  -1.0-abstand,
    0.0-abstand,  0.0+abstand,   0.0-abstand,
    -1.0-abstand,  0.5+abstand,   0.0-abstand,

    // t2 eckteil oben links hinten
    -1.0-abstand,  0.0+abstand,  -1.0-abstand,
    0.0-abstand,  0.5+abstand,  -1.0-abstand,
    0.0-abstand,  0.0+abstand,   0.0-abstand,
    -1.0-abstand,  0.5+abstand,   0.0-abstand,

    // t2 eckteil oben links hinten deckel
    -1.0-abstand,  1.0+abstand,  -1.0-abstand,
    -1.0-abstand,  0.0+abstand,  -1.0-abstand,
    0.0-abstand,  0.5+abstand,  -1.0-abstand,
    -1.0-abstand,  0.5+abstand,   0.0-abstand,
    ];

  all_vertices[8] = [
    // goq9 eckteil unten rechts vorne
    1.0+abstand,  -1.0-abstand,  1.0+abstand,
    0.0+abstand,  -0.5-abstand,  1.0+abstand,
    0.0+abstand,   0.0-abstand,  0.0+abstand,
    1.0+abstand,  -0.5-abstand,  0.0+abstand,

    // goq9 eckteil unten rechts vorne
    1.0+abstand,   0.0-abstand,  1.0+abstand,
    0.0+abstand,  -0.5-abstand,  1.0+abstand,
    0.0+abstand,   0.0-abstand,  0.0+abstand,
    1.0+abstand,  -0.5-abstand,  0.0+abstand,

    // goq9 eckteil unten rechts vorne deckel
    1.0+abstand,  -1.0-abstand,  1.0+abstand,
    1.0+abstand,   0.0-abstand,  1.0+abstand,
    0.0+abstand,  -0.5-abstand,  1.0+abstand,
    1.0+abstand,  -0.5-abstand,  0.0+abstand,
    ];

  all_vertices[9] = [
    // klrsv4 mittelteil rechts
    1.0+2*abstand,   0.0,  1.0,
    1.0+2*abstand,   0.5,  0.0,
    0.0+2*abstand,   0.0,  0.0,

    // klrsv4 mittelteil rechts
    1.0+2*abstand,   0.0,  -1.0,
    1.0+2*abstand,   0.5,   0.0,
    0.0+2*abstand,   0.0,   0.0,

    // klrsv4 mittelteil rechts
    1.0+2*abstand,    0.0,  1.0,
    1.0+2*abstand,   -0.5,  0.0,
    0.0+2*abstand,    0.0,  0.0,

    // klrsv4 mittelteil rechts
    1.0+2*abstand,    0.0,  -1.0,
    1.0+2*abstand,   -0.5,   0.0,
    0.0+2*abstand,    0.0,   0.0,
    ];

  all_vertices[10] = [
    // iy1 eckteil oben rechts vorne
    1.0+abstand,  1.0+abstand,  1.0+abstand,
    0.0+abstand,  0.5+abstand,  1.0+abstand,
    0.0+abstand,  0.0+abstand,  0.0+abstand,
    1.0+abstand,  0.5+abstand,  0.0+abstand,

    // iy1 eckteil oben rechts vorne
    1.0+abstand,  0.0+abstand,  1.0+abstand,
    0.0+abstand,  0.5+abstand,  1.0+abstand,
    0.0+abstand,  0.0+abstand,  0.0+abstand,
    1.0+abstand,  0.5+abstand,  0.0+abstand,

    // iy1 eckteil oben rechts vorne deckel
    1.0+abstand,  1.0+abstand,  1.0+abstand,
    1.0+abstand,  0.0+abstand,  1.0+abstand,
    0.0+abstand,  0.5+abstand,  1.0+abstand,
    1.0+abstand,  0.5+abstand,  0.0+abstand,
    ];

  all_vertices[11] = [
    // j1 mittelteil hinten
    0.0,   0.5,  -1.0-2*abstand,
    -1.0,   0.0,  -1.0-2*abstand,
    0.0,   0.0,   0.0-2*abstand,

    // j1 mittelteil hinten
    0.0,   0.5,  -1.0-2*abstand,
    1.0,   0.0,  -1.0-2*abstand,
    0.0,   0.0,   0.0-2*abstand,

    // j1 mittelteil hinten
    0.0,  -0.5,  -1.0-2*abstand,
    -1.0,   0.0,  -1.0-2*abstand,
    0.0,   0.0,   0.0-2*abstand,

    // j1 mittelteil hinten
    0.0,  -0.5,  -1.0-2*abstand,
    1.0,   0.0,  -1.0-2*abstand,
    0.0,   0.0,   0.0-2*abstand,
    ];

  all_vertices[12] = [
    // u7 boden
    -1.0,  -1.0-2*abstand,  1.0,
    0.0,  -0.5-2*abstand,  1.0,
    0.0,   0.0-2*abstand,  0.0,
    -1.0,  -0.5-2*abstand,  0.0,

    // u7 boden
    1.0,  -1.0-2*abstand,  1.0,
    1.0,  -0.5-2*abstand,  0.0,
    0.0,   0.0-2*abstand,  0.0,
    0.0,  -0.5-2*abstand,  1.0,

    // u7 boden
    -1.0,  -1.0-2*abstand,  -1.0,
    0.0,  -0.5-2*abstand,  -1.0,
    0.0,   0.0-2*abstand,   0.0,
    -1.0,  -0.5-2*abstand,   0.0,

    // u7 boden
    1.0,  -1.0-2*abstand,  -1.0,
    1.0,  -0.5-2*abstand,   0.0,
    0.0,   0.0-2*abstand,   0.0,
    0.0,  -0.5-2*abstand,  -1.0,

    //spezielles seitenteil bugfix
    -1.0,  -1.0-2*abstand,  1.0,
    0.0,  -0.5-2*abstand,  1.0,
    1.0,  -1.0-2*abstand,  1.0,

    //spezielles seitenteil bugfix
    1.0,  -1.0-2*abstand,  1.0,
    1.0,  -0.5-2*abstand,  0.0,
    1.0,  -1.0-2*abstand,  -1.0,

    ];

  all_vertices[13] = [
    // bn6 eckteil unten rechts hinten
    1.0+abstand,  -1.0-abstand,  -1.0-abstand,
    0.0+abstand,  -0.5-abstand,  -1.0-abstand,
    0.0+abstand,   0.0-abstand,   0.0-abstand,
    1.0+abstand,  -0.5-abstand,   0.0-abstand,

    // bn6 eckteil unten rechts hinten
    1.0+abstand,   0.0-abstand,  -1.0-abstand,
    0.0+abstand,  -0.5-abstand,  -1.0-abstand,
    0.0+abstand,   0.0-abstand,   0.0-abstand,
    1.0+abstand,  -0.5-abstand,   0.0-abstand,

    // bn6 eckteil unten rechts hinten deckel
    1.0+abstand,  -1.0-abstand,  -1.0-abstand,
    1.0+abstand,   0.0-abstand,  -1.0-abstand,
    0.0+abstand,  -0.5-abstand,  -1.0-abstand,
    1.0+abstand,  -0.5-abstand,   0.0-abstand,
    ];

  all_vertices[14] = [
    ];

  all_vertices[15] = [
    // f7 eckteil oben rechts hinten
    1.0+abstand,  1.0+abstand,  -1.0-abstand,
    0.0+abstand,  0.5+abstand,  -1.0-abstand,
    0.0+abstand,  0.0+abstand,   0.0-abstand,
    1.0+abstand,  0.5+abstand,   0.0-abstand,

    // f7 eckteil oben rechts hinten
    1.0+abstand,  0.0+abstand,  -1.0-abstand,
    0.0+abstand,  0.5+abstand,  -1.0-abstand,
    0.0+abstand,  0.0+abstand,   0.0-abstand,
    1.0+abstand,  0.5+abstand,   0.0-abstand,

    // f7 eckteil oben rechts hinten
    1.0+abstand,  1.0+abstand,  -1.0-abstand,
    1.0+abstand,  0.0+abstand,  -1.0-abstand,
    0.0+abstand,  0.5+abstand,  -1.0-abstand,
    1.0+abstand,  0.5+abstand,   0.0-abstand,
    ];

  all_vertices[16] = [
    // orange vorne unten links
    -abstand*0.0618,   -abstand*0.0618,  abstand*0.0618,
    -abstand*0.0618,    abstand*0.0618,  abstand*0.0618,
    abstand*0.0618,   -abstand*0.0618,  abstand*0.0618,

    // gelb unten
    -abstand*0.0618,   -abstand*0.0618,  abstand*0.0618,
    abstand*0.0618,   -abstand*0.0618,  abstand*0.0618,
    abstand*0.0618,   -abstand*0.0618, -abstand*0.0618,

    // grün rechts
    abstand*0.0618,  -abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,  -abstand*0.0618,
    abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,

    // hellblau hinten
    abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,  -abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,

    // violett oben
    -abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,

    // magenta links
    -abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,
    -abstand*0.0618,  -abstand*0.0618,   abstand*0.0618,


    // eckteil schwarz
    abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,   abstand*0.0618,

    abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,

    abstand*0.0618,   abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,   abstand*0.0618,
    abstand*0.0618,   abstand*0.0618,  -abstand*0.0618,


    // eckteil weiss
    -abstand*0.0618,  -abstand*0.0618,   -abstand*0.0618,
    -abstand*0.0618,  -abstand*0.0618,    abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,   -abstand*0.0618,

    -abstand*0.0618,  -abstand*0.0618,   -abstand*0.0618,
    -abstand*0.0618,  -abstand*0.0618,    abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,   -abstand*0.0618,

    -abstand*0.0618,  -abstand*0.0618,   -abstand*0.0618,
    -abstand*0.0618,   abstand*0.0618,   -abstand*0.0618,
    abstand*0.0618,  -abstand*0.0618,   -abstand*0.0618,
    ];

  all_vertices[17] = [
    // orange vorne unten links
    -abstand*0.00618,   -abstand*0.00618,  abstand*0.00618,
    -abstand*0.00618,    abstand*0.00618,  abstand*0.00618,
    abstand*0.00618,   -abstand*0.00618,  abstand*0.00618,

    // gelb unten
    -abstand*0.00618,   -abstand*0.00618,  abstand*0.00618,
    abstand*0.00618,   -abstand*0.00618,  abstand*0.00618,
    abstand*0.00618,   -abstand*0.00618, -abstand*0.00618,

    // grün rechts
    abstand*0.00618,  -abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,  -abstand*0.00618,
    abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,

    // hellblau hinten
    abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,  -abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,

    // violett oben
    -abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,

    // magenta links
    -abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,
    -abstand*0.00618,  -abstand*0.00618,   abstand*0.00618,


    // eckteil schwarz
    abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,   abstand*0.00618,

    abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,

    abstand*0.00618,   abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,   abstand*0.00618,
    abstand*0.00618,   abstand*0.00618,  -abstand*0.00618,


    // eckteil weiss
    -abstand*0.00618,  -abstand*0.00618,   -abstand*0.00618,
    -abstand*0.00618,  -abstand*0.00618,    abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,   -abstand*0.00618,

    -abstand*0.00618,  -abstand*0.00618,   -abstand*0.00618,
    -abstand*0.00618,  -abstand*0.00618,    abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,   -abstand*0.00618,

    -abstand*0.00618,  -abstand*0.00618,   -abstand*0.00618,
    -abstand*0.00618,   abstand*0.00618,   -abstand*0.00618,
    abstand*0.00618,  -abstand*0.00618,   -abstand*0.00618,

    ];


  var vertices = all_vertices[0].concat(all_vertices[1], all_vertices[2], all_vertices[3], all_vertices[4], all_vertices[5], all_vertices[6], all_vertices[7], all_vertices[8], all_vertices[9], all_vertices[10], all_vertices[11], all_vertices[12], all_vertices[13], all_vertices[14], all_vertices[15], all_vertices[16], all_vertices[17]);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = vertices.length / 3;

  cubeVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  var all_vertexNormals = [];

  all_vertexNormals[0] = [
    // ewx0 eckteil unten links vorne
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,

    // ewx0 eckteil unten links vorne
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,

    // ewx0 eckteil unten links vorne deckel
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,
    -1.0,  -1.0,  1.0,
    ];

  all_vertexNormals[1] = [
    ];

  all_vertexNormals[2] = [
    // c8 eckteil oben links vorne
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,
    -1.0,  0.0,  1.0,

    // c8 eckteil oben links vorne
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,

    // c8 eckteil oben links vorne deckel
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    ];

  all_vertexNormals[3] = [
    // z8 deckel
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    // z8 deckel
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    // z8 deckel
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    // z8 deckel
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    //bugfix
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    //bugfix
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    ];

  all_vertexNormals[4] = [
    // a2 mittelteil vorne
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,

    // a2 mittelteil vorne
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,

    // a2 mittelteil vorne
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,

    // a2 mittelteil vorne
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,
    ];

  all_vertexNormals[5] = [
    // dm3 eckteil unten links hinten
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,

    // dm3 eckteil unten links hinten
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,

    // dm3 eckteil unten links hinten
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    ];

  all_vertexNormals[6] = [
    // h5 mittelteil links
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,

    // h5 mittelteil links
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,

    // h5 mittelteil links
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,

    // h5 mittelteil links
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    ];

  all_vertexNormals[7] = [
    // t2 eckteil oben links hinten
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,
    -1.0,  0.0,  -1.0,

    // t2 eckteil oben links hinten
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,

    // t2 eckteil oben links hinten
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    ];

  all_vertexNormals[8] = [
    // goq9 eckteil unten rechts vorne
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,

    // goq9 eckteil unten rechts vorne
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,

    // goq9 eckteil unten rechts vorne
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,
    1.0,  -1.0,  1.0,
    ];

  all_vertexNormals[9] = [
    // klrsv4 mittelteil rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    // klrsv4 mittelteil rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    // klrsv4 mittelteil rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    // klrsv4 mittelteil rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    ];

  all_vertexNormals[10] = [
    // iy1 eckteil oben rechts vorne
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,
    1.0,  0.0,  1.0,

    // iy1 eckteil oben rechts vorne
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,

    // iy1 eckteil oben rechts vorne
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    ];

  all_vertexNormals[11] = [
    // j1 mittelteil hinten
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,

    // j1 mittelteil hinten
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,

    // j1 mittelteil hinten
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,

    // j1 mittelteil hinten
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,
    0.0,  0.0,  -1.0,
    ];

  all_vertexNormals[12] = [
    // u7 boden
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,

    // u7 boden
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,

    // u7 boden
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,

    // u7 boden
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,

    //bugfix
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,

    //bugfix
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    0.0,  -1.0,  0.0,
    ];

  all_vertexNormals[13] = [
    // bn6 eckteil unten rechts hinten
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,

    // bn6 eckteil unten rechts hinten
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,

    // bn6 eckteil unten rechts hinten
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,
    1.0,  -1.0,  -1.0,
    ];

  all_vertexNormals[14] = [
    ];

  all_vertexNormals[15] = [
    // f7 eckteil oben rechts hinten
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,
    1.0,  0.0,  -1.0,

    // f7 eckteil oben rechts hinten
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,

    // f7 eckteil oben rechts hinten
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    ];

  all_vertexNormals[16] = [
    // orange vorne
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,

    // gelb unten
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,

    // grün rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    // hellblau hinten
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,

    // violett oben
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    // magenta links
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,

    // eckteil schwarz
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,

    0.0,  1.0, 0.0,
    0.0,  1.0, 0.0,
    0.0,  1.0, 0.0,

    1.0,  0.0, 0.0,
    1.0,  0.0, 0.0,
    1.0,  0.0, 0.0,

    // eckteil weiss
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,

    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,

    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    ];

  all_vertexNormals[17] = [
    // orange vorne
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,

    // gelb unten
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,

    // grün rechts
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    // hellblau hinten
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,

    // violett oben
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

    // magenta links
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,

    // eckteil schwarz
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,
    0.0,  0.0, 1.0,

    0.0,  1.0, 0.0,
    0.0,  1.0, 0.0,
    0.0,  1.0, 0.0,

    1.0,  0.0, 0.0,
    1.0,  0.0, 0.0,
    1.0,  0.0, 0.0,

    // eckteil weiss
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,
    -1.0,  0.0, 0.0,

    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,
    0.0,  -1.0, 0.0,

    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    ];

  var vertexNormals = all_vertexNormals[0].concat(all_vertexNormals[1], all_vertexNormals[2], all_vertexNormals[3], all_vertexNormals[4], all_vertexNormals[5], all_vertexNormals[6], all_vertexNormals[7], all_vertexNormals[8], all_vertexNormals[9], all_vertexNormals[10], all_vertexNormals[11], all_vertexNormals[12], all_vertexNormals[13], all_vertexNormals[14], all_vertexNormals[15], all_vertexNormals[16], all_vertexNormals[17]);

  //	var vertexNormals = all_vertexNormals[0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  cubeVertexNormalBuffer.itemSize = 3;
  cubeVertexNormalBuffer.numItems = vertexNormals.length / 3;

  cubeVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);

  var all_textureCoords = [];
  all_textureCoords[0] = [
    // ewx0 eckteil unten links vorne
    0.0, 0.0,
    0.1, 0.0,
    0.1, 1.0,
    0.0, 1.0,

    // ewx0 eckteil unten links vorne
    0.1, 0.0,
    0.1, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // ewx0 eckteil unten links vorne deckel
    0.1, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    0.1, 0.0,
    ];

  all_textureCoords[1] = [
    ];

  all_textureCoords[2] = [
    // c8 eckteil oben links vorne
    0.8, 0.0,
    0.9, 0.0,
    0.9, 1.0,
    0.8, 1.0,

    // c8 eckteil oben links vorne
    0.9, 0.0,
    0.9, 1.0,
    0.8, 1.0,
    0.8, 0.0,

    // c8 eckteil oben links vorne deckel

    0.9, 1.0,
    0.8, 1.0,
    0.8, 0.0,
    0.9, 0.0,
    ];

  all_textureCoords[3] = [
    // Front face
    0.8, 0.0,
    0.9, 0.0,
    0.9, 1.0,
    0.8, 1.0,

    // Back face
    0.9, 0.0,
    0.9, 1.0,
    0.8, 1.0,
    0.8, 0.0,

    // Bottom face
    0.9, 1.0,
    0.8, 1.0,
    0.8, 0.0,
    0.9, 0.0,

    // Top face
    0.8, 1.0,
    0.8, 0.0,
    0.9, 0.0,
    0.9, 1.0,

    //bugfix
    0.8, 0.0,
    0.9, 0.0,
    0.9, 1.0,

    //bugfix
    0.8, 1.0,
    0.9, 1.0,
    0.9, 0.0,

    ];
  all_textureCoords[4] = [
    // a2 mittelteil vorne
    0.2, 0.0,
    0.3, 0.0,
    0.3, 1.0,

    // a2 mittelteil vorne
    0.3, 0.0,
    0.3, 1.0,
    0.2, 1.0,

    // a2 mittelteil vorne
    0.2, 1.0,
    0.2, 0.0,
    0.3, 0.0,

    // a2 mittelteil vorne
    0.3, 1.0,
    0.2, 1.0,
    0.2, 0.0,
    ];

  all_textureCoords[5] = [
    // dm3 eckteil unten links hinten
    0.4, 0.0,
    0.4, 1.0,
    0.3, 1.0,
    0.3, 0.0,

    // dm3 eckteil unten links hinten
    0.3, 0.0,
    0.4, 0.0,
    0.4, 1.0,
    0.3, 1.0,

    // dm3 eckteil unten links hinten deckel
    0.4, 1.0,
    0.3, 1.0,
    0.3, 0.0,
    0.4, 0.0,
    ];

  all_textureCoords[6] = [

    // h5 mittelteil links
    0.5, 0.0,
    0.6, 0.0,
    0.6, 1.0,

    // h5 mittelteil links
    0.6, 0.0,
    0.6, 1.0,
    0.5, 1.0,

    // h5 mittelteil links
    0.5, 0.0,
    0.5, 1.0,
    0.6, 0.0,

    // h5 mittelteil links
    0.6, 1.0,
    0.5, 1.0,
    0.5, 0.0,
    ];

  all_textureCoords[7] = [
    // t2 eckteil oben links hinten
    0.2, 0.0,
    0.3, 0.0,
    0.3, 1.0,
    0.2, 1.0,

    // t2 eckteil oben links hinten
    0.3, 0.0,
    0.3, 1.0,
    0.2, 1.0,
    0.2, 0.0,

    // t2 eckteil oben links hinten deckel
    0.3, 1.0,
    0.2, 1.0,
    0.2, 0.0,
    0.3, 0.0,

    ];

  all_textureCoords[8] = [
    // goq9 eckteil unten rechts vorne
    0.9, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.9, 1.0,

    // goq9 eckteil unten rechts vorne
    1.0, 0.0,
    1.0, 1.0,
    0.9, 1.0,
    0.9, 0.0,

    // goq9 eckteil unten rechts vorne deckel
    1.0, 1.0,
    0.9, 1.0,
    0.9, 0.0,
    1.0, 0.0,
    ];

  all_textureCoords[9] = [
    // klrsv4 mittelteil rechts
    0.4, 0.0,
    0.5, 0.0,
    0.5, 1.0,

    // klrsv4 mittelteil rechts
    0.5, 0.0,
    0.5, 1.0,
    0.4, 1.0,

    // klrsv4 mittelteil rechts
    0.4, 0.0,
    0.4, 1.0,
    0.5, 0.0,

    // klrsv4 mittelteil rechts
    0.5, 1.0,
    0.4, 1.0,
    0.4, 0.0,
    ];

  all_textureCoords[10] = [
    // iy1 eckteil oben rechts vorne
    0.1, 0.0,
    0.2, 0.0,
    0.2, 1.0,
    0.1, 1.0,

    // iy1 eckteil oben rechts vorne
    0.2, 0.0,
    0.2, 1.0,
    0.1, 1.0,
    0.1, 0.0,

    // iy1 eckteil oben rechts vorne deckel
    0.2, 1.0,
    0.1, 1.0,
    0.1, 0.0,
    0.2, 0.0,
    ];

  all_textureCoords[11] = [
    // j1 mittelteil hinten
    0.1, 0.0,
    0.2, 0.0,
    0.2, 1.0,

    // j1 mittelteil hinten
    0.2, 0.0,
    0.2, 1.0,
    0.1, 1.0,

    // j1 mittelteil hinten
    0.1, 1.0,
    0.1, 0.0,
    0.2, 0.0,

    // j1 mittelteil hinten
    0.2, 1.0,
    0.1, 1.0,
    0.1, 0.0,
    ];

  all_textureCoords[12] = [
    // u7 boden
    0.7, 0.0,
    0.8, 0.0,
    0.8, 1.0,
    0.7, 1.0,

    // u7 boden
    0.8, 0.0,
    0.8, 1.0,
    0.7, 1.0,
    0.7, 0.0,

    // u7 boden
    0.7, 1.0,
    0.7, 0.0,
    0.8, 0.0,
    0.8, 1.0,

    // u7 boden
    0.8, 1.0,
    0.7, 1.0,
    0.7, 0.0,
    0.8, 0.0,

    // u7 bugfix
    0.8, 0.0,
    0.8, 1.0,
    0.7, 1.0,

    // u7 bugfix
    0.8, 1.0,
    0.7, 1.0,
    0.7, 0.0,
    ];

  all_textureCoords[13] = [
    // bn6 eckteil unten rechts hinten
    0.6, 0.0,
    0.7, 0.0,
    0.7, 1.0,
    0.6, 1.0,

    // bn6 eckteil unten rechts hinten
    0.7, 0.0,
    0.7, 1.0,
    0.6, 1.0,
    0.6, 0.0,

    // bn6 eckteil unten rechts hinten deckel
    0.7, 1.0,
    0.6, 1.0,
    0.6, 0.0,
    0.7, 0.0,
    ];

  all_textureCoords[14] = [
    ];

  all_textureCoords[15] = [
    // f7 eckteil oben rechts hinten
    0.7, 0.0,
    0.8, 0.0,
    0.8, 1.0,
    0.7, 1.0,

    // f7 eckteil oben rechts hinten
    0.8, 0.0,
    0.8, 1.0,
    0.7, 1.0,
    0.7, 0.0,

    // f7 eckteil oben rechts hinten deckel
    0.8, 1.0,
    0.7, 1.0,
    0.7, 0.0,
    0.8, 0.0,
    ];

  all_textureCoords[16] = [
    // a2 mittelteil vorne
    0.1, 0.0,
    0.1, 1.0,
    0.0, 0.0,

    // a2 mittelteil vorne
    1.0, 0.0,
    1.0, 1.0,
    0.9, 0.0,

    // a2 mittelteil vorne
    0.7, 1.0,
    0.7, 0.0,
    0.8, 0.0,

    // a2 mittelteil vorne
    0.6, 1.0,
    0.5, 1.0,
    0.5, 0.0,

    // a2 mittelteil vorne
    0.9, 0.0,
    0.9, 1.0,
    0.8, 0.0,

    // a2 mittelteil vorne
    0.4, 0.0,
    0.4, 1.0,
    0.3, 0.0,

    // eckteil schwarz
    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    // eckteil weiss
    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,
    ];

  all_textureCoords[17] = [
    // a2 mittelteil vorne
    0.1, 0.0,
    0.1, 1.0,
    0.0, 0.0,

    // a2 mittelteil vorne
    1.0, 0.0,
    1.0, 1.0,
    0.9, 0.0,

    // a2 mittelteil vorne
    0.7, 1.0,
    0.7, 0.0,
    0.8, 0.0,

    // a2 mittelteil vorne
    0.6, 1.0,
    0.5, 1.0,
    0.5, 0.0,

    // a2 mittelteil vorne
    0.9, 0.0,
    0.9, 1.0,
    0.8, 0.0,

    // a2 mittelteil vorne
    0.4, 0.0,
    0.4, 1.0,
    0.3, 0.0,

    // eckteil schwarz
    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    // eckteil weiss
    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,

    0.2, 0.0,
    0.2, 1.0,
    0.1, 0.0,
    ];

  var textureCoords = all_textureCoords[0].concat(all_textureCoords[1], all_textureCoords[2], all_textureCoords[3], all_textureCoords[4], all_textureCoords[5], all_textureCoords[6], all_textureCoords[7], all_textureCoords[8], all_textureCoords[9], all_textureCoords[10], all_textureCoords[11], all_textureCoords[12], all_textureCoords[13], all_textureCoords[14], all_textureCoords[15], all_textureCoords[16], all_textureCoords[17]);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  cubeVertexTextureCoordBuffer.itemSize = 2;
  cubeVertexTextureCoordBuffer.numItems = textureCoords.length / 2;

  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  var n = 0;
  var all_cubeVertexIndices = [];
  all_cubeVertexIndices[0] = [
    n+0, n+1, n+2,      n+0, n+2, n+3,	//0, 2, 1,	0, 3, 2,	// Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    	//4, 6, 5,	4, 7, 6,	// Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[0].length / 3;

  all_cubeVertexIndices[1] =[

    ];

  n = n + all_vertices[1].length / 3;

  all_cubeVertexIndices[2] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[2].length / 3;

  all_cubeVertexIndices[3] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,     n+8, n+10, n+11,  // Top face
    n+12, n+13, n+14,   n+12, n+14, n+15, // Bottom face
    n+0, n+4, n+12,
    //	    n+0, n+1, n+4,
    n+0, n+12, n+8,
    n+4, n+5, n+12,
    //	    n+8, n+12, n+15,
    n+0, n+8, n+11,
    n+16, n+17, n+18,
    n+19, n+20, n+21,
    ];

  n = n + all_vertices[3].length / 3;

  all_cubeVertexIndices[4] =[
    n+0, n+1,  n+2,          // Front face
    n+3, n+4,  n+5,          // Back face
    n+6, n+7,  n+8,         // Top face
    n+9, n+10, n+11,       // Bottom face
    n+0, n+1,  n+6,
    n+0, n+4,  n+6,
    ];

  n = n + all_vertices[4].length / 3;

  all_cubeVertexIndices[5] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[5].length / 3;

  all_cubeVertexIndices[6] =[
    n+0, n+1, n+2,
    n+3, n+4, n+5,
    n+6, n+7, n+8,
    n+9, n+10, n+11,
    n+0, n+4, n+7,
    n+3, n+4, n+7,
    ];

  n = n + all_vertices[6].length / 3;

  all_cubeVertexIndices[7] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[7].length / 3;

  all_cubeVertexIndices[8] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face	];
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[8].length / 3;

  all_cubeVertexIndices[9] =[
    n+0, n+1, n+2,          // Front face
    n+3, n+4, n+5,          // Back face
    n+6, n+7, n+8,         // Top face
    n+9, n+10, n+11,       // Bottom face
    n+4, n+0, n+7,
    n+4, n+3, n+7,
    ];

  n = n + all_vertices[9].length / 3;

  all_cubeVertexIndices[10] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[10].length / 3;

  all_cubeVertexIndices[11] =[
    n+0, n+1, n+2,          // Front face
    n+3, n+4, n+5,          // Back face
    n+6, n+7, n+8,         // Top face
    n+9, n+10, n+11,       // Bottom face
    n+0, n+1,  n+6,
    n+0, n+4,  n+6,
    ];

  n = n + all_vertices[11].length / 3;

  all_cubeVertexIndices[12] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,   // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,     n+8, n+10, n+11,  // Top face
    n+12, n+13, n+14,   n+12, n+14, n+15, // Bottom face
    n+0, n+4, n+12,
    //	    n+0, n+1, n+4,
    n+0, n+12, n+8,
    //	    n+4, n+5, n+12,
    n+8, n+12, n+15,
    n+0, n+8, n+11,
    n+16, n+17, n+18,
    n+19, n+20, n+21,
    ];

  n = n + all_vertices[12].length / 3;

  all_cubeVertexIndices[13] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[13].length / 3;

  all_cubeVertexIndices[14] =[
    ];

  n = n + all_vertices[14].length / 3;

  all_cubeVertexIndices[15] =[
    n+0, n+1, n+2,      n+0, n+2, n+3,    // Front face
    n+4, n+5, n+6,      n+4, n+6, n+7,    // Back face
    n+8, n+9, n+10,	 n+8, n+9, n+11,
    ];

  n = n + all_vertices[15].length / 3;


  all_cubeVertexIndices[16] =[
    n+0, n+1, n+2,          // Front face
    n+3, n+4, n+5,          // Back face
    n+6, n+7, n+8,         // Top face
    n+9, n+10, n+11,       // Bottom face
    n+12, n+13, n+14,       // Bottom face
    n+15, n+16, n+17,       // Bottom face
    n+18, n+19, n+20,       // s bei orange
    n+21, n+22, n+23,       // s bei violett
    n+24, n+25, n+26,       // s bei grün
    n+27, n+28, n+29,       //w bei magenta
    n+30, n+31, n+32,       // w bei gelb
    n+33, n+34, n+35,       // w bei hellblau
    ];

  n = n + all_vertices[16].length / 3;

  all_cubeVertexIndices[17] =[
    n+0, n+1, n+2,          // Front face
    n+3, n+4, n+5,          // Back face
    n+6, n+7, n+8,         // Top face
    n+9, n+10, n+11,       // Bottom face
    n+12, n+13, n+14,       // Bottom face
    n+15, n+16, n+17,       // Bottom face
    n+18, n+19, n+20,       // s bei orange
    n+21, n+22, n+23,       // s bei violett
    n+24, n+25, n+26,       // s bei grün
    n+27, n+28, n+29,       //w bei magenta
    n+30, n+31, n+32,       // w bei gelb
    n+33, n+34, n+35,       // w bei hellblau
    ];

  //var string =document.getElementById("string").value;
  var string = document.getElementById("string").value;


  var input = [];

  for (var i = 0; i < string.length; i++){

    input[i] = string.substr(i,1);

  }



  //var input = ['m', 'e', 't', 'a', 'm', 'o', 'r', 'p', 'h', 'o', 's', 'e'];
  //var input = ['e', 'c', 'z', 'a', 'd', 'h', 't', 'g', 'k', 'i', 'j', 'u', 'b', 'f', 'p'];
  //var input = ['d', 'e', 'f', 'i', 'n', 'i', 't', 'i', 'o', 'n'];
  //var input = ['t', 'h', 'e', 'k', 'l', 'e', 'i', 'n', 'e'];
  //varr input = ['t', 'h', 'o', 'm', 'a', 's'];

  var word = [];

  for (var i = 0; i < input.length; i++){

    switch(input[i]){

      case 'e': case 'w': case 'x':
        word[i] = [0];
        break;

      case 'c':
        word[i] = [2];
        break;

      case 'z':
        word[i] = [3];
        break;

      case 'a':
        word[i] = [4];
        break;

      case 'd': case 'm':
        word[i] = [5];
        break;

      case 'h':
        word[i] = [6];
        break;

      case 't':
        word[i] = [7];
        break;

      case 'g': case 'o': case 'q':
        word[i] = [8];
        break;

      case 'k': case 'l': case 'r': case 's': case 'v':
        word[i] = [9];
        break;

      case 'i': case 'y':
        word[i] = [10];
        break;

      case 'j':
        word[i] = [11];
        break;

      case 'u':
        word[i] = [12];
        break;

      case 'b': case 'n':
        word[i] = [13];
        break;

      case 'f':
        word[i] = [15];
        break;

      case 'p':
        word[i] = [16];
        break;

      case '.':
        word[i] = [17];
        break;

      default:
        word[i] = [1];
    }

  }


  var VertexIndices = [];
  VertexIndices[0] = [];


  //	var cubeVertexIndices = "";
  var test =[];

  for (var i = 0; i < word.length; i++){


    var cubeVertexIndices = VertexIndices[0].concat(all_cubeVertexIndices[word[i]]);
    VertexIndices[0] = cubeVertexIndices;
  }


  /*
  //alt aber alles, daher vielleicht noch wichtig =)

  var cubeVertexIndices = all_cubeVertexIndices[0].concat(all_cubeVertexIndices[1], all_cubeVertexIndices[2], all_cubeVertexIndices[3], all_cubeVertexIndices[4], all_cubeVertexIndices[5], all_cubeVertexIndices[6], all_cubeVertexIndices[7], all_cubeVertexIndices[8], all_cubeVertexIndices[9], all_cubeVertexIndices[10], all_cubeVertexIndices[11], all_cubeVertexIndices[12], all_cubeVertexIndices[13], all_cubeVertexIndices[14], all_cubeVertexIndices[15], all_cubeVertexIndices[16]);
  */



  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;
}


function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);

  mat4.translate(mvMatrix, [x, y, z]);

  mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, glassTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  var blending = false;
  if (blending) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1f(shaderProgram.alphaUniform, parseFloat(document.getElementById("alpha").value));
  } else {
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(shaderProgram.alphaUniform, parseFloat(document.getElementById("alpha").value));
  }

  var ambientR = 0.2;
  var ambientG = 0.2;
  var ambientB = 0.2;
  var lightDirectionX = -0.25;
  var lightDirectionY = -0.25;
  var lightDirectionZ = -1.0;
  var directionalR = 0.8;
  var directionalG = 0.8;
  var directionalB = 0.8;

  var lighting = false;
  gl.uniform1i(shaderProgram.useLightingUniform, lighting);
  if (lighting) {
    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        ambientR,
        ambientG,
        ambientB
        //                parseFloat(document.getElementById("ambientR").value),
        //                parseFloat(document.getElementById("ambientG").value),
        //                parseFloat(document.getElementById("ambientB").value)
        );

    var lightingDirection = [
      lightDirectionX,
      lightDirectionY,
      lightDirectionZ
        //                parseFloat(document.getElementById("lightDirectionX").value),
        //                parseFloat(document.getElementById("lightDirectionY").value),
        //                parseFloat(document.getElementById("lightDirectionZ").value)
        ];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

    gl.uniform3f(
        shaderProgram.directionalColorUniform,
        directionalR,
        directionalG,
        directionalB
        //                parseFloat(document.getElementById("directionalR").value),
        //                parseFloat(document.getElementById("directionalG").value),
        //                parseFloat(document.getElementById("directionalB").value)
        );
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


var lastTime = 0;

function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;

    xRot += (xSpeed * elapsed) / 1000.0;
    yRot += (ySpeed * elapsed) / 1000.0;
  }
  lastTime = timeNow;
}


function tick() {
  requestAnimFrame(tick);
  handleKeys();
  drawScene();
  animate();
}



function webGLStart() {
  var canvas = document.getElementById("lesson08-canvas");
  initGL(canvas);
  initShaders();
  initBuffers();
  initTexture();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  tick();
}


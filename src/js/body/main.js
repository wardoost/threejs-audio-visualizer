var renderer, scene, camera;
var controls, effect, manager;
var light, dirLight, dirLight;
var greenMat, blueMat, whiteWF;
var terrain, cubesCenter;
var cubes = new Array();
var drawingDistance = 1000;
var amount = 8;

init(); // Initiante scene
animate(); // Kick off animation loop

function init(){

  // -------------------------------------------------
  // SCENE SETUP
  // -------------------------------------------------

  //Setup three.js WebGL renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  // Enable shadows
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFShadowMap;

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);

  // Create a three.js scene.
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, drawingDistance / 4 , drawingDistance );

  // Create a three.js camera.
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10 * drawingDistance);
  scene.add(camera);

  // Apply VR headset positional data to camera.
  controls = new THREE.VRControls(camera);

  // Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  // Create a VR manager helper to enter and exit VR mode.
  manager = new WebVRManager(renderer, effect);


  // -------------------------------------------------
  // LIGHTS
  // -------------------------------------------------

  // Lights
  light = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( light );

  dirLight = new THREE.DirectionalLight( 0xfff5c4, 0.9 );
  dirLight.castShadow = true;
  // dirLight.shadowCameraVisible = true;
  dirLight.shadowMapWidth = 1024;
  dirLight.shadowMapHeight = 1024;
  dirLight.position.set( 1000, 1000, 0 );
  scene.add( dirLight );

  // -------------------------------------------------
  // MATERIALS
  // -------------------------------------------------

  // Materials
  greenMat = new THREE.MeshLambertMaterial({ 
    color: 0xd8de3f,
    shading: THREE.FlatShading,
    // wireframe: true
  });

  blueMat = new THREE.MeshLambertMaterial({ 
    color: 0x1b3349, 
    shading: THREE.FlatShading,
    // wireframe: true
  });

  whiteWF = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    shading: THREE.FlatShading,
    wireframe: true
  });


  // -------------------------------------------------
  // OBJECTS
  // -------------------------------------------------

  terrain = generateTerrain("heightmap", drawingDistance * 2, 500, drawingDistance * 2);
  terrain.position.set(0, -20, 0);
  terrain.receiveShadow = true;
  scene.add( terrain );

  // Cubes
  var radius = 50;
  var size = 10;
  cubesCenter = new THREE.Object3D();
  cubesCenter.position.set(0, -20, 0);
  for(var i = 0; i < 256 / amount; i++) {
    var geometry = new THREE.BoxGeometry(size, size, size);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, size / 2, 0 ));
    geometry.castShadow = true;

    cubes[i] = new THREE.Mesh(geometry, greenMat);    
    cubes[i].position.set(radius * Math.cos(i / amount * Math.PI * 2), 0, radius * Math.sin(i / amount * Math.PI * 2));
    cubes[i].rotation.y = -i / amount * Math.PI * 2;

    cubesCenter.add(cubes[i]);
  }
  scene.add(cubesCenter);
}

// Function to generate terrain
function generateTerrain(heightMap, width, height, depth) {
  var heightMap = heightMap || "heightmap";
  var width = width || 100;
  var height = height || 100;
  var depth = depth || 100;

  //To get the pixels, draw the image onto a canvas. From the canvas get the Pixel (R,G,B,A)
  var img = document.getElementById(heightMap);
  var canvas = document.getElementById("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

  var data = canvas.getContext('2d').getImageData(0,0, img.height, img.width).data;
  var terrainData = [];

  for (var i = 0, n = data.length; i < n; i += 4) {
    // get the average value of R, G and B.
    terrainData.push((data[i] + data[i+1] + data[i+2]) / 3);
  }

  var terrainGeometry = new THREE.PlaneGeometry(width, depth, img.width - 1, img.height - 1); 

  for (var i = 0; i < terrainGeometry.vertices.length; i++) {
    var terrainValue = terrainData[i] / 255;
    terrainGeometry.vertices[i].z = terrainGeometry.vertices[i].z + terrainValue * height ;
  }

  terrainGeometry.computeFaceNormals();
  terrainGeometry.computeVertexNormals();

  var terrain = new THREE.Mesh(terrainGeometry, blueMat);

  var q = new THREE.Quaternion();
  q.setFromAxisAngle( new THREE.Vector3(-1, 0, 0), 90 * Math.PI / 180 );
  terrain.quaternion.multiplyQuaternions( q, terrain.quaternion );

  return terrain;
}

// Request animation frame loop function
function animate() {

  cubesCenter.rotation.y += 0.005;

  if(typeof array === 'object' && array.length > 0) {
    var k = 0;
    for(var i = 0; i < cubes.length; i++) {
        var scale = (array[k] + boost) / 20;
        cubes[i].scale.y = (scale < 1 ? 1 : scale);
        k += (k < array.length ? 1 : 0);
    }
  }

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera);

  requestAnimationFrame( animate );
}

// Listen for keyboard event and zero positional sensor on appropriate keypress.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.zeroSensor();
  }
};

window.addEventListener('keydown', onKey, true);


// Handle window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);
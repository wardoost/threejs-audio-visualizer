var renderer, scene, camera, cameraPivot;
var controls, effect, manager;
var light, dirLight, dirLight;
var greenMat, blackMat, whiteMat, whiteWFMat;
var terrain, cubesCenter, selector;
var selectorRadius = 100;
var cubes = new Array();
var drawingDistance = 500;
var amount = 128;

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
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapType = THREE.PCFShadowMap;

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);

  // Create a three.js scene.
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xCCCCCC, drawingDistance / 5 , drawingDistance );

  // Create a three.js camera.
  cameraPivot = new THREE.Object3D();
  cameraPivot.position.y = 2000;
  cameraPivot.rotation.x = -Math.PI / 2;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10 * drawingDistance);
  cameraPivot.add(camera);
  scene.add(cameraPivot);

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
  dirLight.shadowCameraVisible = true;
  dirLight.shadowMapWidth = 1024;
  dirLight.shadowMapHeight = 1024;
  dirLight.shadowCameraFar = drawingDistance * 3;
  dirLight.position.set( drawingDistance, drawingDistance, 0 );
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

  blackMat = new THREE.MeshLambertMaterial({ 
    color: 0x030303, 
    shading: THREE.FlatShading
  });

  blackWFMat = new THREE.MeshLambertMaterial({ 
    color: 0x030303, 
    shading: THREE.FlatShading,
    wireframe: true
  });

  whiteWFMat = new THREE.MeshLambertMaterial({ 
    color: 0xFFFFFF, 
    shading: THREE.FlatShading,
    wireframe: true
  });

  whiteMat = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    shading: THREE.FlatShading,
    specular: 0xFFFFFF
  });


  // -------------------------------------------------
  // OBJECTS
  // -------------------------------------------------

  // Terrain
  terrain = generateTerrain("heightmap", blackWFMat, drawingDistance * 2, 1500, drawingDistance * 2);
  // terrain.receiveShadow = true;
  scene.add( terrain );

  // Cubes
  var radius = 60;
  var size = 10;
  cubesCenter = new THREE.Object3D();
  cubesCenter.position.set(0, 0, 0);
  for(var i = 0; i < amount; i++) {
    var geometry = new THREE.BoxGeometry(size, size, size);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, size / 2, 0 ));
    // geometry.castShadow = true;

    cubes[i] = new THREE.Mesh(geometry, whiteMat);    
    cubes[i].position.x = -radius * Math.cos(i / amount * Math.PI * 2);
    cubes[i].position.z = radius * Math.sin(i / amount * Math.PI * 2);
    //cubes[i].rotation.y = -i / amount * Math.PI * 2;

    cubesCenter.add(cubes[i]);
  }
  scene.add(cubesCenter);

  // Selector
  var geometry = new THREE.CircleGeometry(10, 16);
  selector = new THREE.Mesh(geometry, whiteWFMat);
  var vec = new THREE.Vector3( 0, 0, -selectorRadius );
  vec.applyQuaternion( camera.quaternion );
  selector.position.x = vec.x;
  selector.position.z = vec.z;
  selector.rotation.x = -Math.PI / 2;
  //scene.add(selector);

  var cube = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8), whiteMat);
  cube.position.z = -selectorRadius;
  //scene.add(cube);  
}



// -------------------------------------------------
// GERERATE TERRAIN
// -------------------------------------------------
function generateTerrain(heightMap, material, width, height, depth) {
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

  var terrain = new THREE.Mesh(terrainGeometry, material);

  var q = new THREE.Quaternion();
  q.setFromAxisAngle( new THREE.Vector3(-1, 0, 0), 90 * Math.PI / 180 );
  terrain.quaternion.multiplyQuaternions( q, terrain.quaternion );

  return terrain;
}

// -------------------------------------------------
// REQUEST ANIMATION FRAME LOOP FUNCTION
// -------------------------------------------------
function animate() {

  // Rotate cubes
  cubesCenter.rotation.y += 0.005;

  // Reposition selector
  var vec = new THREE.Vector3( 0, 0, -selectorRadius );
  vec.applyQuaternion( camera.quaternion );
  selector.position.x = vec.x;
  selector.position.z = vec.z;
  
  // Elevate camera  
  if(cameraPivot.position.y > drawingDistance / 2){
    cameraPivot.position.y -= 0.5 * 8;
  }

  if(typeof array === 'object' && array.length > 0) {
    var k = 0;
    for(var i = 0; i < cubes.length; i++) {
        var scale = (array[k] + boost) / 40;
        cubes[i].scale.y = (scale < 1 ? 1 : scale);
        k += (k < array.length ? 1 : 0);
    }
  }

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera);

  // Limit framerate to max 60fps
  setTimeout( function() { requestAnimationFrame( animate ); }, 1000 / 60 );
}

// -------------------------------------------------
// LISTEN FOR KEYBOARD EVENT AND ZERO POSITIONAL SENSOR ON APPROPRIATE KEYPRESS.
// -------------------------------------------------
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.zeroSensor();
  }
};

window.addEventListener('keydown', onKey, true);

// -------------------------------------------------
// HANDLE WINDOW RESIZES
// -------------------------------------------------
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);
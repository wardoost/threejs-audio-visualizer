//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = false;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();
//scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 5000);
camera.position.set( 0, 75, 300 );
scene.add(camera);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect);

// Lights
var light = new THREE.AmbientLight( 0x202020, 0.1 ); // soft white light
scene.add( light );

var dirLight = new THREE.DirectionalLight( 0xfff5c4, 0.5 );
dirLight.position.set( 500, 1000, 100 );
dirLight.castShadow = true;
dirLight.shadowDarkness = 0.3;
dirLight.shadowCameraNear = 100;
dirLight.shadowCameraFar = camera.far;
dirLight.shadowMapWidth = 2048;
dirLight.shadowMapHeight = 2048;
// dirLight.shadowCameraVisible = true;
scene.add( dirLight );

var spotLightCenter = new THREE.Object3D();
spotLightCenter.position.set( 0, 1000, 0 );
scene.add( spotLightCenter );

var spotLight = new THREE.SpotLight( 0xfffde8, 0.6 );
spotLight.position.set( 1500, 0, 0 );
spotLight.castShadow = true;
spotLight.shadowDarkness = 0.6;
spotLight.shadowCameraNear = 100;
spotLight.shadowCameraFar = camera.far;
spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;
// spotLight.shadowCameraVisible = true;
spotLightCenter.add( spotLight );

// Materials
var material = new THREE.MeshPhongMaterial( { 
    color: 0x22FF88, 
    specular: 0x050505,
    shininess: 100,
    shading: THREE.FlatShading,
    //wireframe: true
} );

// Textures
var bumpTexFloor = THREE.ImageUtils.loadTexture("img/textures/wall-bump.jpg");
bumpTexFloor.wrapS = THREE.RepeatWrapping;
bumpTexFloor.wrapT = THREE.RepeatWrapping;
bumpTexFloor.repeat = new THREE.Vector2(10, 10);
bumpTexFloor.anisotropy = renderer.getMaxAnisotropy();

// Materials
var materialFloor = new THREE.MeshPhongMaterial( { 
    color: 0xCFC9C1,
    specular: 0xCCDDF6,
    shininess: 5,
    specularMap: bumpTexFloor,
    bumpMap: bumpTexFloor,
    bumpScale: 0.2
} );

// Floor
var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), materialFloor);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );

// text
var textGeom = new THREE.TextGeometry( 'Oink', {
        font: 'helvetiker', // Must be lowercase!
        size: 100,
        height: 30,
        curveSegments: 5
    });
textGeom.center();
var text = new THREE.Mesh( textGeom, material );
text.position.x = 300;
text.position.y = 50;
text.position.z = -100;
text.castShadow = true;
scene.add( text );

// Cube
var cube = new THREE.Mesh(new THREE.BoxGeometry( 50, 40, 60 ), material);
cube.position.x = 70;
cube.position.y = 50;
cube.castShadow = true;
scene.add( cube );

// Sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry( 50, 16, 16 ), material);
sphere.position.x = -50;
sphere.position.y = 50;
sphere.position.z = -100;
sphere.castShadow = true;
scene.add( sphere );

// Octahedron
var octahedron = new THREE.Mesh(new THREE.OctahedronGeometry( 50 ), material);
octahedron.position.x = -150;
octahedron.position.y = 50;
octahedron.castShadow = true;
scene.add( octahedron );

// Torus
var torus = new THREE.Mesh(new THREE.TorusGeometry( 40, 10, 8, 16 ), material);
torus.position.x = -350;
torus.position.y = 50;
torus.position.z = -100;
torus.castShadow = true;
scene.add( torus );

// postprocessing
var composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
dotScreenEffect.uniforms[ 'scale' ].value = 4;
composer.addPass( dotScreenEffect );

var rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
rgbEffect.uniforms[ 'amount' ].value = 0.0015;
rgbEffect.renderToScreen = true;
composer.addPass( rgbEffect );

// Request animation frame loop function
function animate() {
  // Apply rotation to objects
  cube.rotation.x += 0.034;
  cube.rotation.y += 0.05;
  cube.rotation.z -= 0.04;
  sphere.rotation.x -= 0.1;
  sphere.rotation.y += 0.015;
  sphere.rotation.z += 0.005;
  octahedron.rotation.x += 0.02;
  octahedron.rotation.y -= 0.01;
  octahedron.rotation.z -= 0.018;
  torus.rotation.x -= 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z -= 0.02;
  text.rotation.y -= 0.015
  spotLightCenter.rotation.y += 0.02

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera);

  composer.render();

  requestAnimationFrame( animate );
}

// Kick off animation loop
animate();

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
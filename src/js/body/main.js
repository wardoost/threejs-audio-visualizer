var renderer, scene, camera;
var controls, effect, manager;
var light, dirLight, spotLightCenter, spotLight;
var terrain, text, cube, sphere, icosahedron, torus;
// var mirror, mirrorMesh;
// var composer, rgbEffect;
var drawingDistance = 2000;

var effectController = {
  //rgbEffect: 0,
  speed: 1,
  // mirrorRotation: Math.PI / 9,
  shadows: true
}

//initGUI(); // Initiate parameter control UI
init(); // Initiante scene
animate(); // Kick off animation loop

function initGUI() {

  var gui = new dat.GUI();

  /*gui.add( effectController, "rgbEffect", -0.05, 0.05 ).onChange( function( value ) {
    rgbEffect.uniforms[ 'amount' ].value = value;
  } );*/
  gui.add( effectController, "speed", 0, 10 );
  /*gui.add( effectController, "mirrorRotation", -Math.PI / 3, Math.PI / 3 ).onChange( function( value ) {
    mirrorMesh.rotation.y = value;
  } );*/
  gui.add( effectController, "shadows").onChange( function( value ) {
    renderer.shadowMapEnabled = value;
  } );
}

function init(){

  // -------------------------------------------------
  // SCENE SETUP
  // -------------------------------------------------

  //Setup three.js WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.antialias = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMapEnabled = effectController.shadows;
  renderer.shadowMapType = THREE.PCFShadowMap;

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);

  // Create a three.js scene.
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 1000, drawingDistance );

  // Create a three.js camera.
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, drawingDistance);
  camera.position.set( 0, 275, 0 );
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
  light = new THREE.AmbientLight( 0x202020, 0.5 ); // soft white light
  scene.add( light );

  dirLight = new THREE.DirectionalLight( 0xfff5c4, 0.5 );
  dirLight.position.set( 500, 1000, 100 );
  dirLight.castShadow = true;
  dirLight.shadowDarkness = 0.9;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;
  // dirLight.shadowCameraVisible = true;
  scene.add( dirLight );

  spotLightCenter = new THREE.Object3D();
  spotLightCenter.position.set( 0, 0, -300 );
  scene.add( spotLightCenter );

  spotLight = new THREE.SpotLight( 0xbd5c70, 0.8, 0, Math.PI / 2 );
  spotLight.position.set( 500, 500, 0 );
  spotLight.target = spotLightCenter;
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 100;
  spotLight.shadowCameraFar = 10000;
  spotLight.shadowDarkness = 0.6;
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowCameraVisible = true;
  spotLightCenter.add( spotLight );


  // -------------------------------------------------
  // MATERIALS
  // -------------------------------------------------

  // Materials
  var green = new THREE.MeshLambertMaterial( { 
    color: 0xd8de3f,
    shading: THREE.FlatShading,
    // wireframe: true
  } );
  var blue = new THREE.MeshLambertMaterial( { 
    color: 0x1b3349, 
    shading: THREE.FlatShading,
    //wireframe: true
  } );

  // Textures
  var bumpTexTerrain = THREE.ImageUtils.loadTexture("img/textures/wall-bump.jpg");
  bumpTexTerrain.wrapS = THREE.RepeatWrapping;
  bumpTexTerrain.wrapT = THREE.RepeatWrapping;
  bumpTexTerrain.repeat = new THREE.Vector2(10, 10);
  bumpTexTerrain.anisotropy = renderer.getMaxAnisotropy();

  // Tectured materials
  var materialTerrain = new THREE.MeshPhongMaterial( { 
    color: 0xCFC9C1,
    specular: 0xCCDDF6,
    shininess: 5,
    specularMap: bumpTexTerrain,
    bumpMap: bumpTexTerrain,
    bumpScale: 1,
    shading: THREE.FlatShading
    //wireframe: true
  } );


  // -------------------------------------------------
  // OBJECTS
  // -------------------------------------------------

  // text
  var textGeom = new THREE.TextGeometry( 'Oink', {
        font: 'helvetiker', // Must be lowercase!
        size: 100,
        height: 30,
        curveSegments: 5
      });
  textGeom.center();
  text = new THREE.Mesh( textGeom, green );
  text.position.set(300, 50, -400);
  text.castShadow = true;
  scene.add( text );

  // Cube
  cube = new THREE.Mesh(new THREE.BoxGeometry( 50, 40, 60 ), green);
  cube.position.set(70, 50, -300);
  cube.castShadow = true;
  scene.add( cube );
  
  // Sphere
  sphere = new THREE.Mesh(new THREE.SphereGeometry( 50, 16, 16 ), green);
  sphere.position.set(-50, 50, -400);
  sphere.castShadow = true;
  scene.add( sphere );

  // Octahedron
  icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry( 50, 0 ), green);
  icosahedron.position.set(-150, 50, -300);
  icosahedron.castShadow = true;
  scene.add( icosahedron );

  // Torus
  torus = new THREE.Mesh(new THREE.TorusGeometry( 40, 10, 8, 16 ), green);
  torus.position.set(-350, 50, -400);
  torus.castShadow = true;
  scene.add( torus );

  // Terrain
  terrain = THREE.Terrain({
      easing: THREE.Terrain.EaseOut,
      frequency: 1,
      heightmap: THREE.Terrain.PerlinLayers,
      material: materialTerrain,
      maxHeight: 0,
      minHeight: -500,
      steps: 8,
      xSegments: 32,
      xSize: 4096,
      ySegments: 32,
      ySize: 4096,
  });
  terrain.receiveShadow = true;
  scene.add(terrain);


  /*/ Mirror
  mirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color:0x889999 } );
  
  mirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 300, 300 ), mirror.material );
  mirrorMesh.add( mirror );
  mirrorMesh.position.y = -500;
  mirrorMesh.position.y = 100;
  mirrorMesh.position.z = -700;
  mirrorMesh.rotation.y = Math.PI / 9;
  scene.add( mirrorMesh );*/


  /*/ -------------------------------------------------
  // POSTPROCESSING
  // -------------------------------------------------
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );

  var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
  dotScreenEffect.uniforms[ 'scale' ].value = 1;
  composer.addPass( dotScreenEffect );

  rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
  rgbEffect.uniforms[ 'amount' ].value = effectController.rgbEffect;
  rgbEffect.renderToScreen = true;
  composer.addPass( rgbEffect );*/
}

// Request animation frame loop function
function animate() {
  // Apply rotation to objects
  cube.rotation.x += effectController.speed * 0.034;
  cube.rotation.y += effectController.speed * 0.05;
  cube.rotation.z -= effectController.speed * 0.04;
  sphere.rotation.x += effectController.speed * 0.02;
  sphere.rotation.y -= effectController.speed * 0.01;
  sphere.rotation.z -= effectController.speed * 0.018;
  icosahedron.rotation.x -= effectController.speed * 0.1;
  icosahedron.rotation.y += effectController.speed * 0.015;
  icosahedron.rotation.z += effectController.speed * 0.05;
  torus.rotation.x -= effectController.speed * 0.01;
  torus.rotation.y += effectController.speed * 0.03;
  torus.rotation.z -= effectController.speed * 0.02;
  text.rotation.y -= effectController.speed * 0.015;
  spotLightCenter.rotation.y += effectController.speed * 0.02

  // Update VR headset position and apply to camera.
  controls.update();

  // render (update) the mirrors
  //mirror.render( );

  // Render the scene through the manager.
  manager.render(scene, camera);

  //composer.render();

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
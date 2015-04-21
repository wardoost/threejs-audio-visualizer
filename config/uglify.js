module.exports = function(grunt, options){
  return {
    options: {
      compress: false,
      beautify: true,
      mangle: false
    },
    head: {
      src: [
        // -------------------------------------------------------
        // Libraries and main.js
        // -------------------------------------------------------
        'src/js/head/libs/*.js',
        'src/js/head/main.js',
      ],
      dest: 'build/<%= grunt.option("deploySubDir") %>assets/head.min.js'
    },
    body: {
      src: [
        'src/js/body/libs/three.js', // Three.js 3d library
        'src/js/body/libs/VRControls.js', // VRControls.js acquires positional information from connected VR devices and applies the transformations to a three.js camera object.
        'src/js/body/libs/VREffect.js', // VREffect.js handles stereo camera setup and rendering.
        'src/js/body/libs/webvr-polyfill.js', // A polyfill for WebVR using the Device{Motion,Orientation}Event API.
        'src/js/body/libs/webvr-manager.js', // Helps enter and exit VR mode, provides best practices while in VR.
        'src/js/body/libs/*.js',
        'src/js/body/*.js',
        'src/js/body/main.js',
      ],
      dest: 'build/<%= grunt.option("deploySubDir") %>assets/body.min.js'
    }
  }
};
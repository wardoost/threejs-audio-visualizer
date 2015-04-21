module.exports = function(grunt, options){
  return {
    fonts: {
      expand: true,
      cwd: 'src',
      src: ['fonts/*.{eot,svg,ttf,woff}'],
      dest: 'build/<%= grunt.option("deploySubDir") %>assets'
    },
    assets:{
      expand: true,
      cwd: 'src',
      src: ['assets/*.{pdf,mp3,m4a}'],
      dest: 'build/<%= grunt.option("deploySubDir") %>'
    }
  }
};
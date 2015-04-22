module.exports = function(grunt, options){
  return {
    build: {
      path: 'http://<%= grunt.option("ipAddress") %>:<%= connect.build.options.port %>/<%= grunt.option("deploySubDir") %>',
      app: 'Chromium'
    },
    deploy: {
      path: 'http://<%= grunt.option("deployURL") %>'
    }
  }
};